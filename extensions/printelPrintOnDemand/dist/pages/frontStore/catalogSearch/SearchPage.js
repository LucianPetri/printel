import Area from '@components/common/Area.js';
import { SearchProvider } from '@components/frontStore/catalog/SearchContext.js';
import { SearchInfo } from '@components/frontStore/catalog/SearchInfo.js';
import { SearchProducts } from '@components/frontStore/catalog/SearchProducts.js';
import React from 'react';
export default function SearchPage({ search }) {
    return (React.createElement(SearchProvider, { searchData: search },
        React.createElement(Area, { id: "searchPageTop", className: "search__page__top" }),
        React.createElement("div", { className: "page-width grid grid-cols-1 " },
            React.createElement(SearchInfo, null),
            React.createElement(SearchProducts, null)),
        React.createElement(Area, { id: "searchPageBottom", className: "search__page__bottom" })));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10
};
export const query = `
  query Query {
    search: productSearch {
      keyword
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
//# sourceMappingURL=SearchPage.js.map