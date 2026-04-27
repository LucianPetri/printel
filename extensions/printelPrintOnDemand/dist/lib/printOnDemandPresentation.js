const identityTranslate = (text, values = {})=>`${text}`.replace(/\${(.*?)}/g, (match, key)=>values[key.trim()] !== undefined ? values[key.trim()] : match);
function coerceBoolean(value) {
    return value === true || value === 1 || value === '1' || value === 'true' || value === 'on';
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
    return normalizedValue === 'days' || normalizedValue === 'weeks' ? normalizedValue : null;
}
export function normalizePrintOnDemandRange(value) {
    if (!value) {
        return null;
    }
    const min = coerceInteger(value.min ?? value.printOnDemandMin);
    const max = coerceInteger(value.max ?? value.printOnDemandMax);
    const unit = normalizePrintOnDemandUnit(value.unit ?? value.printOnDemandUnit);
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
        label: typeof value.label === 'string' && value.label.trim() !== '' ? value.label : undefined
    };
}
export function normalizePrintOnDemandPolicy(value) {
    const enabled = coerceBoolean(value?.enabled ?? value?.printOnDemandEnabled ?? value?.print_on_demand_enabled);
    const deliveryRange = normalizePrintOnDemandRange(value?.deliveryRange ?? {
        min: value?.printOnDemandMin ?? value?.print_on_demand_min,
        max: value?.printOnDemandMax ?? value?.print_on_demand_max,
        unit: value?.printOnDemandUnit ?? value?.print_on_demand_unit
    });
    return {
        enabled,
        deliveryRange: enabled ? deliveryRange : null
    };
}
export function hasValidPrintOnDemandPolicy(policy) {
    return Boolean(policy?.enabled && policy.deliveryRange);
}
export function buildPrintOnDemandPayload(data, options = {}) {
    const hasPodFields = [
        'print_on_demand_enabled',
        'print_on_demand_min',
        'print_on_demand_max',
        'print_on_demand_unit'
    ].some((field)=>Object.prototype.hasOwnProperty.call(data, field));
    if (!hasPodFields && options.allowMissing) {
        return data;
    }
    const translate = options.translate ?? identityTranslate;
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
        throw new Error(translate('Print-on-demand delivery minimum and maximum are required.'));
    }
    if (min <= 0 || max <= 0) {
        throw new Error(translate('Print-on-demand delivery minimum and maximum must be positive integers.'));
    }
    if (unit === null) {
        throw new Error(translate('Print-on-demand delivery unit must be days or weeks.'));
    }
    if (min > max) {
        throw new Error(translate('Print-on-demand delivery minimum cannot be greater than the maximum.'));
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
    if (typeof product?.inventory?.isInStock === 'boolean') {
        return product.inventory.isInStock;
    }
    const manageStock = coerceBoolean(product?.manageStock ?? product?.manage_stock);
    if (!manageStock) {
        return true;
    }
    const stockAvailability = product?.stockAvailability ?? product?.stock_availability;
    const qty = coerceInteger(product?.qty);
    return (qty ?? 0) > 0 && stockAvailability !== false && stockAvailability !== 0;
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
    const policy = normalizePrintOnDemandPolicy(category);
    const inStock = isProductInStock(product);
    const sourceCategoryId = coerceInteger(product?.categoryId ?? product?.category_id ?? category?.categoryId ?? category?.category_id) ?? null;
    if (!inStock && hasValidPrintOnDemandPolicy(policy)) {
        const deliveryRange = policy.deliveryRange ? {
            ...policy.deliveryRange,
            label: formatPrintOnDemandRangeLabel(policy.deliveryRange) || undefined
        } : null;
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
    const deliveryRange = normalizePrintOnDemandRange(value?.deliveryRange);
    return {
        applies: coerceBoolean(value?.applies),
        purchasable: typeof value?.purchasable === 'boolean' ? value.purchasable : coerceBoolean(value?.purchasable),
        ctaLabel: typeof value?.ctaLabel === 'string' ? value.ctaLabel : value?.cta_label || '',
        sourceCategoryId: coerceInteger(value?.sourceCategoryId ?? value?.source_category_id) ?? null,
        deliveryRange
    };
}
export function getProductPrintOnDemandDisplay(product, translate = identityTranslate) {
    const presentation = normalizePrintOnDemandPresentation(product?.printOnDemandPresentation ?? product?.print_on_demand_presentation);
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
        deliveryLabel: formatPrintOnDemandRangeLabel(deliveryRange, translate) ?? deliveryRange?.label ?? null,
        deliveryRange
    };
}
export function shouldSkipPrintOnDemandStockDecrement(product, category) {
    return resolvePrintOnDemandPresentation(product, category).applies;
}
