import { getConfig } from '@evershop/evershop/lib/util/getConfig';
import { getSetting } from '@evershop/evershop/setting/services';
import { isAnafEnvironment, isAnafSubmissionMode } from './anafStatuses.js';
export async function getEffectiveAnafSettings() {
    const readConfig = getConfig;
    const configuredEnabled = readConfig('anaf.enabled', false) === true;
    const configuredEnvironment = String(readConfig('anaf.environment', 'test'));
    const forcedEnvironment = String(readConfig('anaf.forceEnvironment', ''));
    const allowEnvironmentOverride = readConfig('anaf.allowEnvironmentOverride', true) !== false;
    const configuredSubmissionMode = String(readConfig('anaf.submissionMode', 'automatic'));
    const anafEnabledSetting = await getSetting('anafEnabled', null);
    const anafEnvironmentSetting = await getSetting('anafEnvironment', null);
    const anafSubmissionModeSetting = await getSetting('anafSubmissionMode', null);
    const environment = isAnafEnvironment(forcedEnvironment)
        ? forcedEnvironment
        : isAnafEnvironment(anafEnvironmentSetting)
            ? anafEnvironmentSetting
            : isAnafEnvironment(configuredEnvironment)
                ? configuredEnvironment
                : 'test';
    const submissionMode = isAnafSubmissionMode(anafSubmissionModeSetting)
        ? anafSubmissionModeSetting
        : isAnafSubmissionMode(configuredSubmissionMode)
            ? configuredSubmissionMode
            : 'automatic';
    return {
        enabled: anafEnabledSetting === null
            ? configuredEnabled
            : ['1', 'true', 'yes', 'on'].includes(String(anafEnabledSetting).toLowerCase()),
        environment,
        environmentLocked: isAnafEnvironment(forcedEnvironment) || allowEnvironmentOverride === false,
        submissionMode,
        companyLegalName: await getSetting('companyLegalName', null),
        companyTaxId: await getSetting('companyTaxId', null),
        companyTradeRegister: await getSetting('companyTradeRegister', null),
        companyRegisteredOffice: await getSetting('companyRegisteredOffice', null),
        storeName: await getSetting('storeName', null),
        storeEmail: await getSetting('storeEmail', null),
        storeAddress: await getSetting('storeAddress', null),
        storeCity: await getSetting('storeCity', null),
        storeProvince: await getSetting('storeProvince', null),
        storePostalCode: await getSetting('storePostalCode', null),
        storeCountry: await getSetting('storeCountry', null)
    };
}
export function getAnafRetryCronSchedule() {
    return String(getConfig('anaf.retryCron', '*/5 * * * *'));
}
//# sourceMappingURL=settings.js.map