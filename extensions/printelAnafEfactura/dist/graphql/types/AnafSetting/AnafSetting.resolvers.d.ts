type SettingRow = {
    name: string;
    value: unknown;
};
declare const _default: {
    Setting: {
        anafEnabled: () => Promise<boolean>;
        anafEnvironment: () => Promise<"test" | "prod">;
        anafEnvironmentLocked: () => Promise<boolean>;
        anafSubmissionMode: (setting: SettingRow[]) => Promise<string>;
        anafConnectionState: () => Promise<{
            connected: boolean;
            environment: "test" | "prod";
            label: string;
            lastVerifiedAt: Date | null;
            lastErrorCode: string | null;
            lastErrorMessage: string | null;
        }>;
        anafCompanyTaxId: (setting: SettingRow[]) => Promise<string | null>;
        anafConnectionCheckApi: () => string;
        anafConnectStartApi: () => string;
        anafDisconnectApi: () => string;
    };
};
export default _default;
