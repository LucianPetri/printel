import { Image } from '@components/common/Image.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { Button } from '@components/common/ui/Button.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
import { toast } from 'react-toastify';
import { getProductPrintOnDemandDisplay } from '../../../lib/printOnDemandPresentation.js';
export const ProductListItemRender = ({ product, imageWidth, imageHeight, layout = 'grid', showAddToCart = false, customAddToCartRenderer }) => {
    const podDisplay = getProductPrintOnDemandDisplay(product, _);
    const addToCartRenderer = (React.createElement(AddToCart, { product: {
            sku: product.sku,
            isInStock: podDisplay.purchasable
        }, qty: 1, onError: (error) => toast.error(error) }, (state, actions) => (React.createElement(Button, { className: layout === 'grid' ? 'w-full' : undefined, disabled: !state.canAddToCart || state.isLoading, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            actions.addToCart();
        } }, state.isLoading
        ? _('Adding...')
        : podDisplay.ctaLabel || _('Add to Cart')))));
    if (layout === 'list') {
        return (React.createElement("div", { className: "product__list__item__inner group relative overflow-hidden flex gap-4 p-4" },
            React.createElement("div", { className: "product__list__image flex-shrink-0" },
                React.createElement("a", { href: product.url },
                    product.image && (React.createElement(Image, { src: product.image.url, alt: product.image.alt || product.name, width: imageWidth || 120, height: imageHeight || 120, loading: "lazy", sizes: "(max-width: 768px) 100vw, 33vw", className: "transition-transform duration-300 ease-in-out group-hover:scale-105 rounded-lg" })),
                    !product.image && (React.createElement(ProductNoThumbnail, { width: imageWidth, height: imageHeight })))),
            React.createElement("div", { className: "product__list__info flex-1 flex flex-col justify-between" },
                React.createElement("div", null,
                    React.createElement("h3", { className: "product__list__name h5 mb-2" },
                        React.createElement("a", { href: product.url, className: "hover:text-primary transition-colors" }, product.name)),
                    React.createElement("div", { className: "product__list__sku text-sm text-gray-600 mb-2" }, _('SKU ${sku}', { sku: product.sku })),
                    React.createElement("div", { className: "product__list__price mb-2" }, product.price.special &&
                        product.price.regular < product.price.special ? (React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("span", { className: "regular-price text-sm", style: { textDecoration: 'line-through', color: '#777' } }, product.price.regular.text),
                        React.createElement("span", { className: "special-price text-lg font-bold", style: { color: '#e53e3e' } }, product.price.special.text))) : (React.createElement("span", { className: "regular-price text-lg font-bold" }, product.price.regular.text))),
                    React.createElement("div", { className: "product__list__stock mb-3" }, podDisplay.deliveryLabel ? (React.createElement("span", { className: "text-primary text-sm font-medium" }, podDisplay.deliveryLabel)) : product.inventory.isInStock ? (React.createElement("span", { className: "text-green-600 text-sm font-medium" }, _('In Stock'))) : (React.createElement("span", { className: "text-red-600 text-sm font-medium" }, _('Out of Stock'))))),
                showAddToCart && (React.createElement("div", { className: "product__list__actions invisible transform translate-y-2 transition-all duration-300 ease-in-out group-hover:visible group-hover:translate-y-0" }, customAddToCartRenderer
                    ? customAddToCartRenderer(product)
                    : addToCartRenderer)))));
    }
    return (React.createElement("div", { className: "product__list__item__inner group overflow-hidden" },
        React.createElement("a", { href: product.url, className: "product__list__link block" },
            React.createElement("div", { className: "product__list__image overflow-hidden flex w-full justify-center" },
                product.image && (React.createElement(Image, { src: product.image.url, alt: product.image.alt || product.name, width: imageWidth || 120, height: imageHeight || 120, sizes: "(max-width: 768px) 100vw, 33vw", className: "transition-transform duration-500 ease-in-out group-hover:scale-110" })),
                !product.image && (React.createElement(ProductNoThumbnail, { width: imageWidth, height: imageHeight }))),
            React.createElement("div", { className: "product__list__info mt-3" },
                React.createElement("h3", { className: "product__list__name h5 font-medium" }, product.name),
                React.createElement("div", { className: "product__list__price" }, product.price.special &&
                    product.price.regular < product.price.special ? (React.createElement(React.Fragment, null,
                    React.createElement("span", { className: "regular-price" }, product.price.regular.text),
                    React.createElement("span", { className: "special-price" }, product.price.special.text))) : (React.createElement("span", { className: "regular-price" }, product.price.regular.text))),
                podDisplay.deliveryLabel && (React.createElement("div", { className: "mt-2 text-sm text-primary", "data-testid": "pod-delivery-range" }, podDisplay.deliveryLabel)))),
        showAddToCart && (React.createElement("div", { className: "product__list__actions p-4 invisible transform translate-y-4 transition-all duration-300 ease-in-out group-hover:visible group-hover:translate-y-0" }, customAddToCartRenderer
            ? customAddToCartRenderer(product)
            : addToCartRenderer))));
};
//# sourceMappingURL=ProductListItemRender.js.map