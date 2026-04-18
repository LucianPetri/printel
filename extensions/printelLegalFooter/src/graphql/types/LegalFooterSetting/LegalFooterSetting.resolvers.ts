type SettingRow = {
  name: string;
  value: unknown;
};

function getStringValue(setting: SettingRow[], name: string) {
  const row = setting.find((item: SettingRow) => item.name === name);
  if (row && typeof row.value === 'string' && row.value.trim() !== '') {
    return row.value;
  }
  return null;
}

export default {
  Setting: {
    companyLegalName: (setting: SettingRow[]) =>
      getStringValue(setting, 'companyLegalName'),
    companyLegalForm: (setting: SettingRow[]) =>
      getStringValue(setting, 'companyLegalForm'),
    companyTaxId: (setting: SettingRow[]) =>
      getStringValue(setting, 'companyTaxId'),
    companyTradeRegister: (setting: SettingRow[]) =>
      getStringValue(setting, 'companyTradeRegister'),
    companyRegisteredOffice: (setting: SettingRow[]) =>
      getStringValue(setting, 'companyRegisteredOffice'),
    companyContactEmail: (setting: SettingRow[]) =>
      getStringValue(setting, 'companyContactEmail'),
    companyContactPhone: (setting: SettingRow[]) =>
      getStringValue(setting, 'companyContactPhone')
  }
};