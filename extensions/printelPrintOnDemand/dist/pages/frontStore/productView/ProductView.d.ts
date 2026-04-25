import { ProductData } from '@components/frontStore/catalog/ProductContext.js';
import React from 'react';
export default function ProductView({ product }: ProductData): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\nquery Query {\n    product: currentProduct {\n      name\n      description\n      sku\n      price {\n        regular {\n          value\n          text\n        }\n        special {\n          value\n          text\n        }\n      }\n      inventory {\n        isInStock\n      }\n      printOnDemandPresentation {\n        applies\n        purchasable\n        ctaLabel\n        sourceCategoryId\n        deliveryRange {\n          min\n          max\n          unit\n          label\n        }\n      }\n      attributes: attributeIndex {\n        attributeName\n        attributeCode\n        optionText\n      }\n      image {\n        alt\n        url\n      }\n      gallery {\n        alt\n        url\n      }\n      variantGroup {\n        variantAttributes {\n          attributeId\n          attributeCode\n          attributeName\n          options {\n            optionId\n            optionText\n            productId\n          }\n        }\n        items {\n          attributes {\n            attributeCode\n            optionId\n          }\n        }\n      }\n    }\n}";
