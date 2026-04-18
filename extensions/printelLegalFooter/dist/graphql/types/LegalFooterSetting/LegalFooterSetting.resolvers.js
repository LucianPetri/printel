function getStringValue(setting, name) {
    const row = setting.find((item) => item.name === name);
    if (row && typeof row.value === 'string' && row.value.trim() !== '') {
        return row.value;
    }
    return null;
}
export default {
    Setting: {
        companyLegalName: (setting) => getStringValue(setting, 'companyLegalName'),
        companyLegalForm: (setting) => getStringValue(setting, 'companyLegalForm'),
        companyTaxId: (setting) => getStringValue(setting, 'companyTaxId'),
        companyTradeRegister: (setting) => getStringValue(setting, 'companyTradeRegister'),
        companyRegisteredOffice: (setting) => getStringValue(setting, 'companyRegisteredOffice'),
        companyContactEmail: (setting) => getStringValue(setting, 'companyContactEmail'),
        companyContactPhone: (setting) => getStringValue(setting, 'companyContactPhone')
    }
};
//# sourceMappingURL=LegalFooterSetting.resolvers.js.map