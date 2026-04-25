import { ProductData } from '@components/frontStore/catalog/ProductContext.js';
import React, { ReactNode } from 'react';
export declare const ProductListItemRender: ({ product, imageWidth, imageHeight, layout, showAddToCart, customAddToCartRenderer }: {
    product: ProductData;
    imageWidth?: number;
    imageHeight?: number;
    layout?: "grid" | "list";
    showAddToCart?: boolean;
    customAddToCartRenderer?: (product: ProductData) => ReactNode;
}) => React.JSX.Element;
