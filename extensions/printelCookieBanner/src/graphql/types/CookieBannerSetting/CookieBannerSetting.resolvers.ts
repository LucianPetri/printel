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
    cookieBannerTitle: (setting: SettingRow[]) =>
      getStringValue(setting, 'cookieBannerTitle'),
    cookieBannerMessage: (setting: SettingRow[]) =>
      getStringValue(setting, 'cookieBannerMessage'),
    cookiePolicyUrl: (setting: SettingRow[]) =>
      getStringValue(setting, 'cookiePolicyUrl'),
    cookiePolicyLinkLabel: (setting: SettingRow[]) =>
      getStringValue(setting, 'cookiePolicyLinkLabel')
  }
};