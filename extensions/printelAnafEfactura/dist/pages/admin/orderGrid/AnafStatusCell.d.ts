import React from 'react';
export default function AnafStatusCell({ row }: {
    row: any;
}): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query($filters: [FilterInput]) {\n    orders(filters: $filters) {\n      items {\n        uuid\n        anafCompliance {\n          status {\n            code\n            label\n            badge\n          }\n        }\n      }\n    }\n  }\n";
export declare const variables = "\n{\n  filters: getContextValue('filtersFromUrl')\n}\n";
