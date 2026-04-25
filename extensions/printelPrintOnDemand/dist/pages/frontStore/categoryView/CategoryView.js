import Area from '@components/common/Area.js';
import { CategoryProvider } from '@components/frontStore/catalog/CategoryContext.js';
import { CategoryInfo } from '@components/frontStore/catalog/CategoryInfo.js';
import { CategoryProducts } from '@components/frontStore/catalog/CategoryProducts.js';
import { CategoryProductsFilter } from '@components/frontStore/catalog/CategoryProductsFilter.js';
import { CategoryProductsPagination } from '@components/frontStore/catalog/CategoryProductsPagination.js';
import { ProductSorting } from '@components/frontStore/catalog/ProductSorting.js';
import React from 'react';
export default function CategoryView({ category }) {
    return (React.createElement(CategoryProvider, { category: category },
        React.createElement(Area, { id: "categoryPageTop", className: "category__page__top" }),
        React.createElement(CategoryInfo, null),
        React.createElement("div", { className: "page-width grid grid-cols-1 md:grid-cols-4 gap-5" },
            React.createElement(Area, { id: "categoryLeftColumn", className: "md:col-span-1", coreComponents: [
                    {
                        component: { default: React.createElement(CategoryProductsFilter, null) },
                        sortOrder: 10,
                        id: 'productFilter'
                    }
                ] }),
            React.createElement(Area, { id: "categoryRightColumn", className: "md:col-span-3", coreComponents: [
                    {
                        component: {
                            default: (React.createElement(ProductSorting, { className: "flex justify-start", count: category.products.total }))
                        },
                        sortOrder: 10,
                        id: 'categoryProductsSorting'
                    },
                    {
                        component: { default: React.createElement(CategoryProducts, null) },
                        sortOrder: 20,
                        id: 'categoryProducts'
                    },
                    {
                        component: { default: React.createElement(CategoryProductsPagination, null) },
                        sortOrder: 30,
                        id: 'categoryProductsPagination'
                    }
                ] })),
        React.createElement(Area, { id: "categoryPageBottom", className: "category__page__bottom" })));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10
};
export const query = `
  query Query {
    category: currentCategory {
      showProducts
      name
      uuid
      description
      image {
        alt
        url
      }
      products {
        items {
          ...Product
        }
        currentFilters {
          key
          operation
          value
        }
        total
      }
      availableAttributes {
        attributeCode
        attributeName
        options {
          optionId
          optionText
        }
      }
      priceRange {
        min
        max
        minText
        maxText
      }
      children {
        categoryId,
        name
        uuid
      }
    }
  }`;
export const fragments = `
  fragment Product on Product {
    productId
    name
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
    image {
      alt
      url
    }
    url
  }
`;
//# sourceMappingURL=CategoryView.js.map