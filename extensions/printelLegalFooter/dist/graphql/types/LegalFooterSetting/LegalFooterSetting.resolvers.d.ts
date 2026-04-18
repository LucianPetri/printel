type SettingRow = {
    name: string;
    value: unknown;
};
declare const _default: {
    Setting: {
        companyLegalName: (setting: SettingRow[]) => string | null;
        companyLegalForm: (setting: SettingRow[]) => string | null;
        companyTaxId: (setting: SettingRow[]) => string | null;
        companyTradeRegister: (setting: SettingRow[]) => string | null;
        companyRegisteredOffice: (setting: SettingRow[]) => string | null;
        companyContactEmail: (setting: SettingRow[]) => string | null;
        companyContactPhone: (setting: SettingRow[]) => string | null;
    };
};
export default _default;
