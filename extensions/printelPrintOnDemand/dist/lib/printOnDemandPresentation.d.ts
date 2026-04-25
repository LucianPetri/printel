export type PrintOnDemandDeliveryUnit = 'days' | 'weeks';
export type PrintOnDemandDeliveryRange = {
    min: number;
    max: number;
    unit: PrintOnDemandDeliveryUnit;
    label?: string;
};
export type PrintOnDemandPolicy = {
    enabled: boolean;
    deliveryRange: PrintOnDemandDeliveryRange | null;
};
export type PrintOnDemandPresentation = {
    applies: boolean;
    purchasable: boolean;
    ctaLabel: string;
    sourceCategoryId: number | null;
    deliveryRange: PrintOnDemandDeliveryRange | null;
};
type TranslateFunction = (text: string, values?: Record<string, string>) => string;
type LooseRecord = Record<string, any> | null | undefined;
export declare function coerceInteger(value: unknown): number | null;
export declare function normalizePrintOnDemandUnit(value: unknown): PrintOnDemandDeliveryUnit | null;
export declare function normalizePrintOnDemandRange(value: LooseRecord): PrintOnDemandDeliveryRange | null;
export declare function normalizePrintOnDemandPolicy(value: LooseRecord): PrintOnDemandPolicy;
export declare function hasValidPrintOnDemandPolicy(policy: PrintOnDemandPolicy | null | undefined): boolean;
export declare function buildPrintOnDemandPayload<T extends Record<string, any>>(data: T, options?: {
    allowMissing?: boolean;
    translate?: TranslateFunction;
}): T & {
    print_on_demand_enabled?: boolean;
    print_on_demand_min?: number | null;
    print_on_demand_max?: number | null;
    print_on_demand_unit?: PrintOnDemandDeliveryUnit | null;
};
export declare function isProductInStock(product: LooseRecord): boolean;
export declare function formatPrintOnDemandUnitLabel(unit: PrintOnDemandDeliveryUnit, value: number, translate?: TranslateFunction): string;
export declare function formatPrintOnDemandRangeLabel(range: PrintOnDemandDeliveryRange | null | undefined, translate?: TranslateFunction): string | null;
export declare function resolvePrintOnDemandPresentation(product: LooseRecord, category: LooseRecord): PrintOnDemandPresentation;
export declare function normalizePrintOnDemandPresentation(value: LooseRecord): PrintOnDemandPresentation;
export declare function getProductPrintOnDemandDisplay(product: LooseRecord, translate?: TranslateFunction): {
    applies: boolean;
    purchasable: boolean;
    ctaLabel: string | null;
    deliveryLabel: string | null;
    deliveryRange: PrintOnDemandDeliveryRange | null;
};
export declare function shouldSkipPrintOnDemandStockDecrement(product: LooseRecord, category: LooseRecord): boolean;
export {};
