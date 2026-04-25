import { insertOnUpdate } from '@evershop/postgres-query-builder';
const footerSettingKeys = [
    'companyLegalName',
    'companyLegalForm',
    'companyTaxId',
    'companyTradeRegister',
    'companyRegisteredOffice',
    'companyContactEmail',
    'companyContactPhone'
];
export default async function migrate(connection) {
    await Promise.all(footerSettingKeys.map((name) => insertOnUpdate('setting', ['name'])
        .given({
        name,
        value: '',
        is_json: 0
    })
        .execute(connection, false)));
}
//# sourceMappingURL=Version-1.0.0.js.map