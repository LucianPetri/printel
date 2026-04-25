import { CategoryData } from '@components/frontStore/catalog/CategoryContext.js';
import React from 'react';
interface CategoryViewProps {
    category: CategoryData;
}
export default function CategoryView({ category }: CategoryViewProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    category: currentCategory {\n      showProducts\n      name\n      uuid\n      description\n      image {\n        alt\n        url\n      }\n      products {\n        items {\n          ...Product\n        }\n        currentFilters {\n          key\n          operation\n          value\n        }\n        total\n      }\n      availableAttributes {\n        attributeCode\n        attributeName\n        options {\n          optionId\n          optionText\n        }\n      }\n      priceRange {\n        min\n        max\n        minText\n        maxText\n      }\n      children {\n        categoryId,\n        name\n        uuid\n      }\n    }\n  }";
export declare const fragments = "\n  fragment Product on Product {\n    productId\n    name\n    sku\n    price {\n      regular {\n        value\n        text\n      }\n      special {\n        value\n        text\n      }\n    }\n    inventory {\n      isInStock\n    }\n    printOnDemandPresentation {\n      applies\n      purchasable\n      ctaLabel\n      sourceCategoryId\n      deliveryRange {\n        min\n        max\n        unit\n        label\n      }\n    }\n    image {\n      alt\n      url\n    }\n    url\n  }\n";
export {};
