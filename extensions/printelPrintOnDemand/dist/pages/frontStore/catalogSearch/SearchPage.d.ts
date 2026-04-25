import { SearchPageData } from '@components/frontStore/catalog/SearchContext.js';
import React from 'react';
interface SearchPageProps {
    search: SearchPageData;
}
export default function SearchPage({ search }: SearchPageProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    search: productSearch {\n      keyword\n      products {\n        items {\n          ...Product\n        }\n        currentFilters {\n          key\n          operation\n          value\n        }\n        total\n      }\n    }\n}";
export declare const fragments = "\n  fragment Product on Product {\n    productId\n    name\n    sku\n    price {\n      regular {\n        value\n        text\n      }\n      special {\n        value\n        text\n      }\n    }\n    inventory {\n      isInStock\n    }\n    printOnDemandPresentation {\n      applies\n      purchasable\n      ctaLabel\n      sourceCategoryId\n      deliveryRange {\n        min\n        max\n        unit\n        label\n      }\n    }\n    image {\n      alt\n      url\n    }\n    url\n  }\n";
export {};
