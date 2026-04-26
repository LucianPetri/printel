import React from 'react';
interface Props {
    order: {
        anafCompliance?: {
            status: {
                code: string;
                label: string;
                badge: string;
            };
            submissionMode: string;
            environment: string;
            registrationCode?: string | null;
            latestFailureMessage?: string | null;
            retryCount: number;
            nextRetryAt?: {
                text?: string;
                value?: string;
            } | string | null;
            approvedByAdminUserId?: number | null;
            approvedAt?: string | null;
            emailReleasedAt?: string | null;
            manualReviewReason?: string | null;
            attempts: Array<{
                orderAnafAttemptId: number;
                triggeredBy: string;
                triggeredByLabel?: string;
                status: string;
                statusLabel?: string;
                startedAt: string;
            }>;
        } | null;
    };
}
export default function AnafComplianceSummary({ order }: Props): React.JSX.Element | null;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    order(uuid: getContextValue(\"orderId\")) {\n      anafCompliance {\n        status {\n          code\n          label\n          badge\n        }\n        submissionMode\n        environment\n        registrationCode\n        latestFailureMessage\n        retryCount\n        nextRetryAt\n        approvedByAdminUserId\n        approvedAt\n        emailReleasedAt\n        manualReviewReason\n        attempts {\n          orderAnafAttemptId\n          triggeredBy\n          triggeredByLabel\n          status\n          statusLabel\n          startedAt\n        }\n      }\n    }\n  }\n";
export {};
