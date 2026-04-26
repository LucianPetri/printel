export type BuiltAnafInvoicePayload = {
    invoiceNumber: string;
    invoiceHash: string;
    invoiceXml: string;
    payload: Record<string, unknown>;
};
export declare function loadOrderSnapshot(orderId: number): Promise<{
    order: Record<string, any>;
    items: any[];
    shippingAddress: any;
    billingAddress: any;
}>;
export declare function buildAnafInvoicePayload(orderId: number): Promise<BuiltAnafInvoicePayload>;
