import React from 'react';
interface PrintOnDemandSettingsProps {
    category?: {
        printOnDemandPolicy?: {
            enabled?: boolean;
            deliveryRange?: {
                min?: number;
                max?: number;
                unit?: 'days' | 'weeks';
            } | null;
        } | null;
    } | null;
}
export default function PrintOnDemandSettings({ category }: PrintOnDemandSettingsProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    category(id: getContextValue(\"categoryId\", null)) {\n      categoryId\n      printOnDemandPolicy {\n        enabled\n        deliveryRange {\n          min\n          max\n          unit\n        }\n      }\n    }\n  }\n";
export {};
