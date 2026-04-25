function getStringValue(setting, name) {
    const row = setting.find((item) => item.name === name);
    if (row && typeof row.value === 'string' && row.value.trim() !== '') {
        return row.value;
    }
    return null;
}
export default {
    Setting: {
        cookieBannerTitle: (setting) => getStringValue(setting, 'cookieBannerTitle'),
        cookieBannerMessage: (setting) => getStringValue(setting, 'cookieBannerMessage'),
        cookiePolicyUrl: (setting) => getStringValue(setting, 'cookiePolicyUrl'),
        cookiePolicyLinkLabel: (setting) => getStringValue(setting, 'cookiePolicyLinkLabel')
    }
};
//# sourceMappingURL=CookieBannerSetting.resolvers.js.map