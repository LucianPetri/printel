import Area from '@components/common/Area.js';
import { Media } from '@components/frontStore/catalog/Media.js';
import { ProductProvider } from '@components/frontStore/catalog/ProductContext.js';
import { ProductSingleAttributes } from '@components/frontStore/catalog/ProductSingleAttributes.js';
import { ProductSingleDescription } from '@components/frontStore/catalog/ProductSingleDescription.js';
import { ProductSingleForm } from '@components/frontStore/catalog/ProductSingleForm.js';
import { ProductSingleName } from '@components/frontStore/catalog/ProductSingleName.js';
import React from 'react';
export default function ProductView({ product }) {
    return (React.createElement(ProductProvider, { product: product },
        React.createElement("div", { className: "product__detail" },
            React.createElement(Area, { id: "productPageTop", className: "product__page__top" }),
            React.createElement("div", { className: "product__page__middle page-width" },
                React.createElement("div", { className: "grid grid-cols-1 gap-7 md:grid-cols-2" },
                    React.createElement(Area, { id: "productPageMiddleLeft", className: "product__detail__left", coreComponents: [
                            {
                                component: { default: React.createElement(Media, null) },
                                sortOrder: 0,
                                id: 'media'
                            }
                        ] }),
                    React.createElement(Area, { id: "productPageMiddleRight", className: "product__detail__right", coreComponents: [
                            {
                                component: { default: React.createElement(ProductSingleName, null) },
                                sortOrder: 10,
                                id: 'name'
                            },
                            {
                                component: { default: React.createElement(ProductSingleAttributes, null) },
                                sortOrder: 20,
                                id: 'attributes'
                            },
                            {
                                component: { default: React.createElement(ProductSingleForm, null) },
                                sortOrder: 30,
                                id: 'productForm'
                            }
                        ] })),
                React.createElement(Area, { id: "productSingleDescription", coreComponents: [
                        {
                            component: { default: React.createElement(ProductSingleDescription, null) },
                            sortOrder: 10,
                            id: 'productSingleDescription'
                        }
                    ] })),
            React.createElement(Area, { id: "productPageBottom", className: "product__page__bottom" }))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10
};
export const query = `
query Query {
    product: currentProduct {
      name
      description
      sku
      price {
        regular {
          value
          text
        }
        special {
          value
          text
        }
      }
      inventory {
        isInStock
      }
      printOnDemandPresentation {
        applies
        purchasable
        ctaLabel
        sourceCategoryId
        deliveryRange {
          min
          max
          unit
          label
        }
      }
      attributes: attributeIndex {
        attributeName
        attributeCode
        optionText
      }
      image {
        alt
        url
      }
      gallery {
        alt
        url
      }
      variantGroup {
        variantAttributes {
          attributeId
          attributeCode
          attributeName
          options {
            optionId
            optionText
            productId
          }
        }
        items {
          attributes {
            attributeCode
            optionId
          }
        }
      }
    }
}`;
//# sourceMappingURL=ProductView.js.map