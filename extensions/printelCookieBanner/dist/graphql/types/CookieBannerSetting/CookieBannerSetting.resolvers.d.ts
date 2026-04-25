type SettingRow = {
    name: string;
    value: unknown;
};
declare const _default: {
    Setting: {
        cookieBannerTitle: (setting: SettingRow[]) => string | null;
        cookieBannerMessage: (setting: SettingRow[]) => string | null;
        cookiePolicyUrl: (setting: SettingRow[]) => string | null;
        cookiePolicyLinkLabel: (setting: SettingRow[]) => string | null;
    };
};
export default _default;
