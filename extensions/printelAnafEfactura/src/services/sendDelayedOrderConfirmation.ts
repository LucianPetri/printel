import { pool } from '@evershop/evershop/lib/postgres';
import { buildEmailBodyFromTemplate, sendEmail } from '@evershop/evershop/lib/mail/emailHelper';
import { getConfig } from '@evershop/evershop/lib/util/getConfig';
import { translate } from '@evershop/evershop/lib/locale/translate/translate';
import {
  claimOrderConfirmationEmail,
  getOrderComplianceByOrderId,
  resetEmailReleaseClaim
} from '../lib/anafComplianceRepository.js';

function buildOrderConfirmationTemplate() {
  return `
<html>
  <body style="font-family: Arial, sans-serif; color: #111827; background: #f9fafb; margin: 0; padding: 24px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="padding: 24px 24px 16px;">
        <h1 style="margin: 0 0 8px; font-size: 28px;">${translate('Thank you for your order')}</h1>
        <p style="margin: 0; color: #4b5563;">${translate('Order number')}: <strong>#{{order.order_number}}</strong></p>
      </div>
      <div style="padding: 0 24px 24px;">
        <p style="margin: 0 0 16px; color: #4b5563;">
          ${translate('Your order details are confirmed below. We only release this confirmation once the related ANAF e-Factura registration has completed.')}
        </p>
    {{#if anafRegistrationCode}}
        <div style="border: 1px solid #d9f99d; background: #f7fee7; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px; font-size: 14px; font-weight: 700;">${translate('ANAF registration code')}</p>
          <p style="margin: 0; font-size: 18px;">{{anafRegistrationCode}}</p>
        </div>
    {{/if}}
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th align="left" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${translate('Item')}</th>
              <th align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${translate('Qty')}</th>
              <th align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${translate('Total')}</th>
            </tr>
          </thead>
          <tbody>
            {{#each order.items}}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">{{this.product_name}}</td>
                <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">{{this.qty}}</td>
                <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">{{this.line_total_incl_tax}} {{../order.currency}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #4b5563;">${translate('Subtotal')}</td>
            <td align="right" style="padding: 6px 0;">{{order.sub_total}} {{order.currency}}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #4b5563;">${translate('Tax')}</td>
            <td align="right" style="padding: 6px 0;">{{order.tax_amount}} {{order.currency}}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 700;">${translate('Grand total')}</td>
            <td align="right" style="padding: 6px 0; font-weight: 700;">{{order.grand_total}} {{order.currency}}</td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td valign="top" width="50%" style="padding-right: 16px;">
              <h2 style="font-size: 16px; margin: 0 0 8px;">${translate('Billing address')}</h2>
              <p style="margin: 0; color: #4b5563;">
                {{billingAddress.full_name}}<br />
                {{billingAddress.address_1}}<br />
                {{#if billingAddress.address_2}}{{billingAddress.address_2}}<br />{{/if}}
                {{billingAddress.city}}, {{billingAddress.province}} {{billingAddress.postcode}}<br />
                {{billingAddress.country_name}}
              </p>
            </td>
            {{#unless order.no_shipping_required}}
            <td valign="top" width="50%" style="padding-left: 16px;">
              <h2 style="font-size: 16px; margin: 0 0 8px;">${translate('Shipping address')}</h2>
              <p style="margin: 0; color: #4b5563;">
                {{shippingAddress.full_name}}<br />
                {{shippingAddress.address_1}}<br />
                {{#if shippingAddress.address_2}}{{shippingAddress.address_2}}<br />{{/if}}
                {{shippingAddress.city}}, {{shippingAddress.province}} {{shippingAddress.postcode}}<br />
                {{shippingAddress.country_name}}
              </p>
            </td>
            {{/unless}}
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>`;
}

export async function sendDelayedOrderConfirmation(
  orderId: number,
  options: { skipAnafRegistrationRequirement?: boolean } = {}
) {
  const compliance = await getOrderComplianceByOrderId(orderId);
  if (!options.skipAnafRegistrationRequirement && (!compliance || compliance.status !== 'registered')) {
    return false;
  }

  const claimed = options.skipAnafRegistrationRequirement
    ? true
    : await claimOrderConfirmationEmail(orderId);
  if (!claimed) {
    return false;
  }

  const orderResult = await pool.query(
    `SELECT order_id, order_number, customer_email, currency, grand_total, sub_total, tax_amount, no_shipping_required, shipping_address_id, billing_address_id
     FROM "order"
     WHERE order_id = $1
     LIMIT 1`,
    [orderId]
  );
  const order = orderResult.rows[0];
  if (!order?.customer_email) {
    return false;
  }

  try {
    const [itemsResult, shippingAddressResult, billingAddressResult] = await Promise.all([
      pool.query(
        `SELECT product_name, qty, line_total_incl_tax
         FROM order_item
         WHERE order_item_order_id = $1
         ORDER BY order_item_id ASC`,
        [orderId]
      ),
      order.shipping_address_id
        ? pool.query(
            `SELECT full_name, address_1, address_2, city, province, postcode, country_name
             FROM order_address
             WHERE order_address_id = $1
             LIMIT 1`,
            [order.shipping_address_id]
          )
        : Promise.resolve({ rows: [] }),
      order.billing_address_id
        ? pool.query(
            `SELECT full_name, address_1, address_2, city, province, postcode, country_name
             FROM order_address
             WHERE order_address_id = $1
             LIMIT 1`,
            [order.billing_address_id]
          )
        : Promise.resolve({ rows: [] })
    ]);
    const emailEnabled =
      (getConfig as any)('system.notification_emails.order_confirmation', { enabled: true })
        ?.enabled !== false;
    if (!emailEnabled) {
      // The ANAF extension owns confirmation timing; disabling the core sender must not suppress the delayed release.
    }

    const emailData = {
      order: {
        ...order,
        items: itemsResult.rows
      },
      shippingAddress: shippingAddressResult.rows[0] ?? null,
      billingAddress: billingAddressResult.rows[0] ?? null,
      anafRegistrationCode: compliance?.registration_code ?? null
    };
    const template = buildOrderConfirmationTemplate();
    const body = await buildEmailBodyFromTemplate(template, {
      ...emailData
    });
    await sendEmail('order_confirmation', {
      to: order.customer_email,
      subject: translate('Your order has been confirmed!'),
      template,
      body,
      data: emailData
    });
    return true;
  } catch (error) {
    if (!options.skipAnafRegistrationRequirement) {
      await resetEmailReleaseClaim(orderId);
    }
    throw error;
  }
}
