import { NumberField } from '@components/common/form/NumberField.js';
import { SelectField } from '@components/common/form/SelectField.js';
import { ToggleField } from '@components/common/form/ToggleField.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
export default function PrintOnDemandSettings({ category }) {
    var _a, _b, _c;
    const { getValues } = useFormContext();
    const enabled = useWatch({
        name: 'print_on_demand_enabled',
        defaultValue: ((_a = category === null || category === void 0 ? void 0 : category.printOnDemandPolicy) === null || _a === void 0 ? void 0 : _a.enabled) ? 1 : 0
    });
    const isEnabled = enabled === true || enabled === 1 || enabled === '1';
    const deliveryRange = (_b = category === null || category === void 0 ? void 0 : category.printOnDemandPolicy) === null || _b === void 0 ? void 0 : _b.deliveryRange;
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, _('Print-on-Demand Settings')),
            React.createElement(CardDescription, null, _('Enable category-level print-on-demand behavior for out-of-stock products and configure the shopper delivery promise.'))),
        React.createElement(CardContent, { className: "space-y-5" },
            React.createElement(ToggleField, { name: "print_on_demand_enabled", label: _('Enable print on demand'), helperText: _('When enabled, out-of-stock products assigned directly to this category remain purchasable and show the configured print lead time.'), defaultValue: ((_c = category === null || category === void 0 ? void 0 : category.printOnDemandPolicy) === null || _c === void 0 ? void 0 : _c.enabled) ? 1 : 0, trueValue: 1, falseValue: 0, trueLabel: _('Enabled'), falseLabel: _('Disabled') }),
            React.createElement("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-3", "aria-live": "polite", "aria-label": _('Print-on-demand delivery range') },
                React.createElement(NumberField, { name: "print_on_demand_min", label: _('Minimum delivery time'), allowDecimals: false, min: 1, disabled: !isEnabled, defaultValue: deliveryRange === null || deliveryRange === void 0 ? void 0 : deliveryRange.min, validation: isEnabled
                        ? {
                            required: _('Minimum delivery time is required'),
                            validate: {
                                positiveInteger: (value) => Number.isInteger(value) && Number(value) > 0
                                    ? true
                                    : _('Minimum delivery time must be a positive whole number')
                            }
                        }
                        : undefined }),
                React.createElement(NumberField, { name: "print_on_demand_max", label: _('Maximum delivery time'), allowDecimals: false, min: 1, disabled: !isEnabled, defaultValue: deliveryRange === null || deliveryRange === void 0 ? void 0 : deliveryRange.max, validation: isEnabled
                        ? {
                            required: _('Maximum delivery time is required'),
                            validate: {
                                positiveInteger: (value) => Number.isInteger(value) && Number(value) > 0
                                    ? true
                                    : _('Maximum delivery time must be a positive whole number'),
                                minLessThanOrEqual: (value) => {
                                    const minValue = getValues('print_on_demand_min');
                                    if (value === null ||
                                        value === undefined ||
                                        minValue === null ||
                                        minValue === undefined) {
                                        return true;
                                    }
                                    return Number(minValue) <= Number(value)
                                        ? true
                                        : _('Maximum delivery time must be greater than or equal to the minimum');
                                }
                            }
                        }
                        : undefined }),
                React.createElement(SelectField, { name: "print_on_demand_unit", label: _('Delivery time unit'), disabled: !isEnabled, defaultValue: deliveryRange === null || deliveryRange === void 0 ? void 0 : deliveryRange.unit, placeholder: _('Select delivery unit'), options: [
                        { value: 'days', label: _('Days') },
                        { value: 'weeks', label: _('Weeks') }
                    ], validation: isEnabled
                        ? {
                            required: {
                                value: true,
                                message: _('Delivery time unit is required')
                            }
                        }
                        : undefined })),
            React.createElement("div", { className: "rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-textSubdued" }, _('In-stock products keep the existing resale flow. Only out-of-stock products in this category switch to the print-on-demand call to action and delivery range.')))));
}
export const layout = {
    areaId: 'leftSide',
    sortOrder: 20
};
export const query = `
  query Query {
    category(id: getContextValue("categoryId", null)) {
      categoryId
      printOnDemandPolicy {
        enabled
        deliveryRange {
          min
          max
          unit
        }
      }
    }
  }
`;
//# sourceMappingURL=PrintOnDemandSettings.js.map