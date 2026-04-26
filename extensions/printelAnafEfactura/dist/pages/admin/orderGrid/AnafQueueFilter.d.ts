import React from 'react';
interface Props {
    orders: {
        currentFilters: Array<{
            key: string;
            value: string;
        }>;
    };
}
export default function AnafQueueFilter({ orders }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query($filters: [FilterInput]) {\n    orders(filters: $filters) {\n      currentFilters {\n        key\n        value\n      }\n    }\n  }\n";
export declare const variables = "\n{\n  filters: getContextValue('filtersFromUrl')\n}\n";
export {};
