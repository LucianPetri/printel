const identityTranslate = (text, values = {}) => `${text}`.replace(/\${(.*?)}/g, (match, key) => values[key.trim()] !== undefined ? values[key.trim()] : match);
function coerceBoolean(value) {
    return (value === true ||
        value === 1 ||
        value === '1' ||
        value === 'true' ||
        value === 'on');
}
export function coerceInteger(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const numericValue = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
    if (!Number.isInteger(numericValue)) {
        return null;
    }
    return numericValue;
}
export function normalizePrintOnDemandUnit(value) {
    if (typeof value !== 'string') {
        return null;
    }
    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue === 'days' || normalizedValue === 'weeks'
        ? normalizedValue
        : null;
}
export function normalizePrintOnDemandRange(value) {
    var _a, _b, _c;
    if (!value) {
        return null;
    }
    const min = coerceInteger((_a = value.min) !== null && _a !== void 0 ? _a : value.printOnDemandMin);
    const max = coerceInteger((_b = value.max) !== null && _b !== void 0 ? _b : value.printOnDemandMax);
    const unit = normalizePrintOnDemandUnit((_c = value.unit) !== null && _c !== void 0 ? _c : value.printOnDemandUnit);
    if (min === null || max === null || unit === null || min <= 0 || max <= 0) {
        return null;
    }
    if (min > max) {
        return null;
    }
    return {
        min,
        max,
        unit,
        label: typeof value.label === 'string' && value.label.trim() !== ''
            ? value.label
            : undefined
    };
}
export function normalizePrintOnDemandPolicy(value) {
    var _a, _b, _c, _d, _e, _f;
    const enabled = coerceBoolean((_b = (_a = value === null || value === void 0 ? void 0 : value.enabled) !== null && _a !== void 0 ? _a : value === null || value === void 0 ? void 0 : value.printOnDemandEnabled) !== null && _b !== void 0 ? _b : value === null || value === void 0 ? void 0 : value.print_on_demand_enabled);
    const deliveryRange = normalizePrintOnDemandRange((_c = value === null || value === void 0 ? void 0 : value.deliveryRange) !== null && _c !== void 0 ? _c : {
        min: (_d = value === null || value === void 0 ? void 0 : value.printOnDemandMin) !== null && _d !== void 0 ? _d : value === null || value === void 0 ? void 0 : value.print_on_demand_min,
        max: (_e = value === null || value === void 0 ? void 0 : value.printOnDemandMax) !== null && _e !== void 0 ? _e : value === null || value === void 0 ? void 0 : value.print_on_demand_max,
        unit: (_f = value === null || value === void 0 ? void 0 : value.printOnDemandUnit) !== null && _f !== void 0 ? _f : value === null || value === void 0 ? void 0 : value.print_on_demand_unit
    });
    return {
        enabled,
        deliveryRange: enabled ? deliveryRange : null
    };
}
export function hasValidPrintOnDemandPolicy(policy) {
    return Boolean((policy === null || policy === void 0 ? void 0 : policy.enabled) && policy.deliveryRange);
}
export function buildPrintOnDemandPayload(data, options = {}) {
    const hasPodFields = [
        'print_on_demand_enabled',
        'print_on_demand_min',
        'print_on_demand_max',
        'print_on_demand_unit'
    ].some((field) => Object.prototype.hasOwnProperty.call(data, field));
    if (!hasPodFields && options.allowMissing) {
        return data;
    }
    const enabled = coerceBoolean(data.print_on_demand_enabled);
    if (!enabled) {
        return {
            ...data,
            print_on_demand_enabled: false,
            print_on_demand_min: null,
            print_on_demand_max: null,
            print_on_demand_unit: null
        };
    }
    const min = coerceInteger(data.print_on_demand_min);
    const max = coerceInteger(data.print_on_demand_max);
    const unit = normalizePrintOnDemandUnit(data.print_on_demand_unit);
    if (min === null || max === null) {
        throw new Error('Print-on-demand delivery min and max are required.');
    }
    if (min <= 0 || max <= 0) {
        throw new Error('Print-on-demand delivery values must be positive integers.');
    }
    if (unit === null) {
        throw new Error('Print-on-demand delivery unit must be days or weeks.');
    }
    if (min > max) {
        throw new Error('Print-on-demand delivery minimum cannot be greater than the maximum.');
    }
    return {
        ...data,
        print_on_demand_enabled: true,
        print_on_demand_min: min,
        print_on_demand_max: max,
        print_on_demand_unit: unit
    };
}
export function isProductInStock(product) {
    var _a, _b, _c;
    if (typeof ((_a = product === null || product === void 0 ? void 0 : product.inventory) === null || _a === void 0 ? void 0 : _a.isInStock) === 'boolean') {
        return product.inventory.isInStock;
    }
    const manageStock = coerceBoolean((_b = product === null || product === void 0 ? void 0 : product.manageStock) !== null && _b !== void 0 ? _b : product === null || product === void 0 ? void 0 : product.manage_stock);
    if (!manageStock) {
        return true;
    }
    const stockAvailability = (_c = product === null || product === void 0 ? void 0 : product.stockAvailability) !== null && _c !== void 0 ? _c : product === null || product === void 0 ? void 0 : product.stock_availability;
    const qty = coerceInteger(product === null || product === void 0 ? void 0 : product.qty);
    return (qty !== null && qty !== void 0 ? qty : 0) > 0 && stockAvailability !== false && stockAvailability !== 0;
}
export function formatPrintOnDemandUnitLabel(unit, value, translate = identityTranslate) {
    if (unit === 'days') {
        return value === 1 ? translate('day') : translate('days');
    }
    return value === 1 ? translate('week') : translate('weeks');
}
export function formatPrintOnDemandRangeLabel(range, translate = identityTranslate) {
    if (!range) {
        return null;
    }
    if (range.min === range.max) {
        return translate('Print-on-demand delivery: ${value} ${unit}', {
            value: String(range.min),
            unit: formatPrintOnDemandUnitLabel(range.unit, range.min, translate)
        });
    }
    return translate('Print-on-demand delivery: ${min}-${max} ${unit}', {
        min: String(range.min),
        max: String(range.max),
        unit: formatPrintOnDemandUnitLabel(range.unit, range.max, translate)
    });
}
export function resolvePrintOnDemandPresentation(product, category) {
    var _a, _b, _c, _d;
    const policy = normalizePrintOnDemandPolicy(category);
    const inStock = isProductInStock(product);
    const sourceCategoryId = (_d = coerceInteger((_c = (_b = (_a = product === null || product === void 0 ? void 0 : product.categoryId) !== null && _a !== void 0 ? _a : product === null || product === void 0 ? void 0 : product.category_id) !== null && _b !== void 0 ? _b : category === null || category === void 0 ? void 0 : category.categoryId) !== null && _c !== void 0 ? _c : category === null || category === void 0 ? void 0 : category.category_id)) !== null && _d !== void 0 ? _d : null;
    if (!inStock && hasValidPrintOnDemandPolicy(policy)) {
        const deliveryRange = policy.deliveryRange
            ? {
                ...policy.deliveryRange,
                label: formatPrintOnDemandRangeLabel(policy.deliveryRange) || undefined
            }
            : null;
        return {
            applies: true,
            purchasable: true,
            ctaLabel: 'Print Now',
            sourceCategoryId,
            deliveryRange
        };
    }
    return {
        applies: false,
        purchasable: inStock,
        ctaLabel: '',
        sourceCategoryId,
        deliveryRange: null
    };
}
export function normalizePrintOnDemandPresentation(value) {
    var _a, _b;
    const deliveryRange = normalizePrintOnDemandRange(value === null || value === void 0 ? void 0 : value.deliveryRange);
    return {
        applies: coerceBoolean(value === null || value === void 0 ? void 0 : value.applies),
        purchasable: typeof (value === null || value === void 0 ? void 0 : value.purchasable) === 'boolean'
            ? value.purchasable
            : coerceBoolean(value === null || value === void 0 ? void 0 : value.purchasable),
        ctaLabel: typeof (value === null || value === void 0 ? void 0 : value.ctaLabel) === 'string'
            ? value.ctaLabel
            : (value === null || value === void 0 ? void 0 : value.cta_label) || '',
        sourceCategoryId: (_b = coerceInteger((_a = value === null || value === void 0 ? void 0 : value.sourceCategoryId) !== null && _a !== void 0 ? _a : value === null || value === void 0 ? void 0 : value.source_category_id)) !== null && _b !== void 0 ? _b : null,
        deliveryRange
    };
}
export function getProductPrintOnDemandDisplay(product, translate = identityTranslate) {
    var _a, _b, _c;
    const presentation = normalizePrintOnDemandPresentation((_a = product === null || product === void 0 ? void 0 : product.printOnDemandPresentation) !== null && _a !== void 0 ? _a : product === null || product === void 0 ? void 0 : product.print_on_demand_presentation);
    if (!presentation.applies) {
        return {
            applies: false,
            purchasable: isProductInStock(product),
            ctaLabel: null,
            deliveryLabel: null,
            deliveryRange: null
        };
    }
    const deliveryRange = presentation.deliveryRange;
    return {
        applies: true,
        purchasable: presentation.purchasable,
        ctaLabel: translate('Print Now'),
        deliveryLabel: (_c = (_b = formatPrintOnDemandRangeLabel(deliveryRange, translate)) !== null && _b !== void 0 ? _b : deliveryRange === null || deliveryRange === void 0 ? void 0 : deliveryRange.label) !== null && _c !== void 0 ? _c : null,
        deliveryRange
    };
}
export function shouldSkipPrintOnDemandStockDecrement(product, category) {
    return resolvePrintOnDemandPresentation(product, category).applies;
}
//# sourceMappingURL=printOnDemandPresentation.js.map