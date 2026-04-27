import { getSetting } from '@evershop/evershop/setting/services';
import { translate } from '@evershop/evershop/lib/locale/translate/translate';
import { buildUrl } from '@evershop/evershop/lib/router';
import { getConnectionState } from '../../../lib/anafComplianceRepository.js';
import { getConnectionLabel } from '../../../lib/tsAnafClient.js';
import { getEffectiveAnafSettings } from '../../../lib/settings.js';
function getStringValue(setting, name) {
    const row = setting.find((item)=>item.name === name);
    if (row && typeof row.value === 'string' && row.value.trim() !== '') {
        return row.value;
    }
    return null;
}
export default {
    Setting: {
        anafEnabled: async ()=>(await getEffectiveAnafSettings()).enabled,
        anafEnvironment: async ()=>(await getEffectiveAnafSettings()).environment,
        anafEnvironmentLocked: async ()=>(await getEffectiveAnafSettings()).environmentLocked,
        anafSubmissionMode: async (setting)=>getStringValue(setting, 'anafSubmissionMode') ?? (await getEffectiveAnafSettings()).submissionMode,
        anafConnectionState: async ()=>{
            const settings = await getEffectiveAnafSettings();
            const connectionState = await getConnectionState();
            if (!connectionState) {
                return {
                    connected: false,
                    environment: settings.environment,
                    label: translate('Disconnected'),
                    lastVerifiedAt: null,
                    lastErrorCode: null,
                    lastErrorMessage: null
                };
            }
            return {
                connected: connectionState.is_connected,
                environment: connectionState.environment,
                label: getConnectionLabel(connectionState.environment, connectionState.is_connected),
                lastVerifiedAt: connectionState.last_verified_at,
                lastErrorCode: connectionState.last_error_code,
                lastErrorMessage: connectionState.last_error_message
            };
        },
        anafCompanyTaxId: async (setting)=>getStringValue(setting, 'companyTaxId') ?? await getSetting('companyTaxId', null),
        anafConnectionCheckApi: ()=>buildUrl('anafConnectionCheck'),
        anafConnectStartApi: ()=>buildUrl('anafConnectStart'),
        anafDisconnectApi: ()=>buildUrl('anafDisconnect')
    }
};
