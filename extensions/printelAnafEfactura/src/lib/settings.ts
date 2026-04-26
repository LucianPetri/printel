import { getConfig } from '@evershop/evershop/lib/util/getConfig';
import { getSetting } from '@evershop/evershop/setting/services';
import {
  AnafEnvironment,
  AnafSubmissionMode,
  isAnafEnvironment,
  isAnafSubmissionMode
} from './anafStatuses.js';

export type EffectiveAnafSettings = {
  enabled: boolean;
  environment: AnafEnvironment;
  environmentLocked: boolean;
  submissionMode: AnafSubmissionMode;
  companyLegalName: string | null;
  companyTaxId: string | null;
  companyTradeRegister: string | null;
  companyRegisteredOffice: string | null;
  storeName: string | null;
  storeEmail: string | null;
  storeAddress: string | null;
  storeCity: string | null;
  storeProvince: string | null;
  storePostalCode: string | null;
  storeCountry: string | null;
};

export async function getEffectiveAnafSettings(): Promise<EffectiveAnafSettings> {
  const readConfig = getConfig as any;
  const configuredEnabled = readConfig('anaf.enabled', false) === true;
  const configuredEnvironment = String(readConfig('anaf.environment', 'test'));
  const forcedEnvironment = String(readConfig('anaf.forceEnvironment', ''));
  const allowEnvironmentOverride = readConfig('anaf.allowEnvironmentOverride', true) !== false;
  const configuredSubmissionMode = String(readConfig('anaf.submissionMode', 'automatic'));

  const anafEnabledSetting = await getSetting<string | null>('anafEnabled', null);
  const anafEnvironmentSetting = await getSetting<string | null>(
    'anafEnvironment',
    null
  );
  const anafSubmissionModeSetting = await getSetting<string | null>(
    'anafSubmissionMode',
    null
  );

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
    enabled:
      anafEnabledSetting === null
        ? configuredEnabled
        : ['1', 'true', 'yes', 'on'].includes(String(anafEnabledSetting).toLowerCase()),
    environment,
    environmentLocked:
      isAnafEnvironment(forcedEnvironment) || allowEnvironmentOverride === false,
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

export function getAnafRetryCronSchedule(): string {
  return String((getConfig as any)('anaf.retryCron', '*/5 * * * *'));
}
