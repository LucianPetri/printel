import Area from '@components/common/Area.js';
import { Form } from '@components/common/form/Form.js';
import { NumberField } from '@components/common/form/NumberField.js';
import { Button } from '@components/common/ui/Button.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
import { VariantSelector } from '@components/frontStore/catalog/VariantSelector.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getProductPrintOnDemandDisplay } from '../../../lib/printOnDemandPresentation.js';
export function ProductSingleForm() {
    const product = useProduct();
    const { price, sku } = product;
    const podDisplay = getProductPrintOnDemandDisplay(product, _);
    const form = useForm();
    const [addingToCart, setAddingToCart] = React.useState(false);
    return (React.createElement(Form, { id: "productForm", method: "POST", submitBtn: false, form: form },
        React.createElement(Area, { id: "productSinglePageForm", coreComponents: [
                {
                    component: {
                        default: (React.createElement("div", { className: "product__single__price text-2xl" }, price.regular.text))
                    },
                    sortOrder: 5,
                    id: 'price'
                },
                {
                    component: {
                        default: React.createElement(VariantSelector, null)
                    },
                    sortOrder: 10,
                    id: 'variantSelector'
                },
                {
                    component: {
                        default: (React.createElement(AddToCart, { product: {
                                sku,
                                isInStock: podDisplay.purchasable
                            }, qty: form.watch('qty') || 1, onSuccess: () => { }, onError: (errorMessage) => {
                                toast.error(errorMessage || _('Failed to add product to cart'));
                            } }, (state, actions) => (React.createElement("div", { className: "mt-6 space-y-3" },
                            podDisplay.deliveryLabel && (React.createElement("div", { className: "rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary", "data-testid": "pod-delivery-range" }, podDisplay.deliveryLabel)),
                            state.isInStock === true && (React.createElement(React.Fragment, null,
                                React.createElement(NumberField, { name: "qty", label: _('Quantity'), className: "w-24", min: 1, required: true, placeholder: _('Quantity'), defaultValue: 1, wrapperClassName: "w-1/2" }),
                                React.createElement(Button, { variant: "default", size: "lg", onClick: () => {
                                        form
                                            .trigger()
                                            .then((isValid) => {
                                            if (isValid) {
                                                setAddingToCart(true);
                                                actions.addToCart();
                                            }
                                        })
                                            .finally(() => {
                                            setAddingToCart(false);
                                        });
                                    }, className: "w-full py-6", isLoading: addingToCart || state.isLoading }, podDisplay.ctaLabel || _('ADD TO CART')))),
                            state.isInStock === false && (React.createElement(Button, { onClick: () => { }, className: "w-full py-6", disabled: true }, _('SOLD OUT')))))))
                    },
                    sortOrder: 30,
                    id: 'addToCartButton'
                }
            ] })));
}
//# sourceMappingURL=ProductSingleForm.js.map