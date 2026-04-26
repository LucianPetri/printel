import React from 'react';
interface Props {
    approveApi: string;
    retryApi: string;
    order: {
        anafCompliance?: {
            status: {
                code: string;
            };
        } | null;
    };
}
export default function AnafComplianceActions({ approveApi, retryApi, order }: Props): React.JSX.Element | null;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    approveApi: url(routeId: \"approveAnafSubmission\", params: [{key: \"uuid\", value: getContextValue(\"orderId\")}])\n    retryApi: url(routeId: \"retryAnafSubmission\", params: [{key: \"uuid\", value: getContextValue(\"orderId\")}])\n    order(uuid: getContextValue(\"orderId\")) {\n      anafCompliance {\n        status {\n          code\n        }\n      }\n    }\n  }\n";
export {};
