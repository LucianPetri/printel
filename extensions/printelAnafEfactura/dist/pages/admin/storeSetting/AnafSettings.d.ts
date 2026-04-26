import React from 'react';
interface Props {
    setting: {
        anafEnabled: boolean;
        anafEnvironment: string;
        anafEnvironmentLocked: boolean;
        anafSubmissionMode: string;
        anafCompanyTaxId?: string | null;
        anafConnectionState?: {
            connected: boolean;
            environment: string;
            label: string;
            lastVerifiedAt?: string | null;
            lastErrorMessage?: string | null;
        } | null;
        anafConnectionCheckApi: string;
        anafConnectStartApi: string;
        anafDisconnectApi: string;
    };
}
export default function AnafSettings({ setting }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    setting {\n      anafEnabled\n      anafEnvironment\n      anafEnvironmentLocked\n      anafSubmissionMode\n      anafCompanyTaxId\n      anafConnectionCheckApi\n      anafConnectStartApi\n      anafDisconnectApi\n      anafConnectionState {\n        connected\n        environment\n        label\n        lastVerifiedAt\n        lastErrorMessage\n      }\n    }\n  }\n";
export {};
