import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pool } from '@evershop/evershop/lib/postgres';
import { getEffectiveAnafSettings } from './settings.js';
const require = createRequire(import.meta.url);
const { UblBuilder } = require('@florinszilagyi/anaf-ts-sdk');
function normalizeText(value, fallback) {
    const normalized = String(value ?? '').trim();
    return normalized || fallback;
}
function normalizeVatNumber(value, fallback = 'RO00000000') {
    const normalized = normalizeText(value, fallback).replace(/\s+/g, '');
    return normalized.toUpperCase().startsWith('RO') ? normalized.toUpperCase() : `RO${normalized}`;
}
function buildPostalZone(value) {
    const normalized = String(value ?? '').replace(/[^0-9]/g, '').trim();
    return normalized || '010000';
}
function buildAddress(source, fallbackStreet) {
    return {
        street: normalizeText(source?.address_1 || source?.address_2 || source?.full_address, fallbackStreet),
        city: normalizeText(source?.city, 'Bucharest'),
        postalZone: buildPostalZone(source?.postcode),
        county: normalizeText(source?.province, 'Bucharest'),
        countryCode: normalizeText(source?.country, 'RO')
    };
}
function buildSupplierAddress(settings) {
    return {
        street: normalizeText(settings.storeAddress || settings.companyRegisteredOffice, settings.companyRegisteredOffice || 'Romania'),
        city: normalizeText(settings.storeCity, 'Bucharest'),
        postalZone: buildPostalZone(settings.storePostalCode),
        county: normalizeText(settings.storeProvince, 'Bucharest'),
        countryCode: normalizeText(settings.storeCountry, 'RO')
    };
}
export async function loadOrderSnapshot(orderId) {
    const orderResult = await pool.query(`SELECT * FROM "order" WHERE order_id = $1 LIMIT 1`, [
        orderId
    ]);
    const order = orderResult.rows[0];
    if (!order) {
        throw new Error(`Order ${orderId} was not found`);
    }
    const [itemsResult, shippingAddressResult, billingAddressResult] = await Promise.all([
        pool.query(`SELECT * FROM order_item WHERE order_item_order_id = $1 ORDER BY order_item_id ASC`, [
            orderId
        ]),
        order.shipping_address_id ? pool.query(`SELECT * FROM order_address WHERE order_address_id = $1`, [
            order.shipping_address_id
        ]) : Promise.resolve({
            rows: []
        }),
        order.billing_address_id ? pool.query(`SELECT * FROM order_address WHERE order_address_id = $1`, [
            order.billing_address_id
        ]) : Promise.resolve({
            rows: []
        })
    ]);
    return {
        order,
        items: itemsResult.rows,
        shippingAddress: shippingAddressResult.rows[0] ?? null,
        billingAddress: billingAddressResult.rows[0] ?? null
    };
}
export async function buildAnafInvoicePayload(orderId) {
    const snapshot = await loadOrderSnapshot(orderId);
    const settings = await getEffectiveAnafSettings();
    const builder = new UblBuilder();
    const invoiceNumber = `PRINTEL-${snapshot.order.order_number}`;
    const supplierVatNumber = normalizeVatNumber(settings.companyTaxId);
    const supplierAddress = buildSupplierAddress(settings);
    const customerAddressSource = snapshot.billingAddress || snapshot.shippingAddress;
    const customerAddress = buildAddress(customerAddressSource, 'Romania');
    const customerName = normalizeText(customerAddressSource?.company_name || customerAddressSource?.full_name || snapshot.order.customer_full_name, snapshot.order.customer_email || `Customer ${snapshot.order.order_number}`);
    const customerCompanyId = normalizeText(customerAddressSource?.company_name || customerAddressSource?.vat_number || customerAddressSource?.telephone, `CUSTOMER-${snapshot.order.order_number}`);
    const payload = {
        orderId: snapshot.order.order_id,
        orderNumber: snapshot.order.order_number,
        invoiceNumber,
        currency: snapshot.order.currency,
        customerEmail: snapshot.order.customer_email,
        company: {
            legalName: settings.companyLegalName,
            taxId: settings.companyTaxId,
            tradeRegister: settings.companyTradeRegister,
            registeredOffice: settings.companyRegisteredOffice
        },
        store: {
            name: settings.storeName,
            email: settings.storeEmail
        },
        billingAddress: snapshot.billingAddress,
        shippingAddress: snapshot.shippingAddress,
        totals: {
            subTotal: snapshot.order.sub_total,
            taxAmount: snapshot.order.tax_amount,
            grandTotal: snapshot.order.grand_total
        },
        items: snapshot.items.map((item)=>({
                sku: item.product_sku,
                name: item.product_name,
                qty: item.qty,
                taxPercent: item.tax_percent,
                finalPrice: item.final_price,
                total: item.line_total_incl_tax
            }))
    };
    const invoiceXml = builder.generateInvoiceXml({
        invoiceNumber,
        issueDate: snapshot.order.created_at ? new Date(snapshot.order.created_at) : new Date(),
        currency: normalizeText(snapshot.order.currency, 'RON'),
        note: `Printel order ${snapshot.order.order_number}`,
        supplier: {
            registrationName: normalizeText(settings.companyLegalName || settings.storeName, 'Printel'),
            companyId: supplierVatNumber,
            vatNumber: supplierVatNumber,
            address: supplierAddress,
            email: settings.storeEmail || undefined
        },
        customer: {
            registrationName: customerName,
            companyId: customerCompanyId,
            vatNumber: customerAddressSource?.vat_number ? normalizeVatNumber(customerAddressSource.vat_number) : undefined,
            address: customerAddress,
            email: snapshot.order.customer_email || undefined,
            telephone: customerAddressSource?.telephone || undefined
        },
        lines: snapshot.items.map((item, index)=>({
                id: index + 1,
                description: normalizeText(item.product_name, `Item ${index + 1}`),
                quantity: Number(item.qty ?? 0) || 1,
                unitPrice: Number(item.final_price ?? item.base_price ?? 0) || 0,
                taxPercent: Number(item.tax_percent ?? 0) || 0
            })),
        isSupplierVatPayer: supplierVatNumber.startsWith('RO')
    });
    return {
        invoiceNumber,
        invoiceHash: crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex'),
        invoiceXml,
        payload
    };
}
