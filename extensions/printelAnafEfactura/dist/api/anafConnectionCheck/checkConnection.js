import { OK } from '@evershop/evershop/lib/util/httpStatus';
import { getConnectionState, markConnectionVerified, updateConnectionTokenState } from '../../lib/anafComplianceRepository.js';
import { getEffectiveAnafSettings } from '../../lib/settings.js';
import { checkAnafConnection, getConnectionLabel } from '../../lib/tsAnafClient.js';
import { encryptAnafToken } from '../../lib/tokenCipher.js';
export default async function checkConnection(_request, response) {
    const settings = await getEffectiveAnafSettings();
    const connectionState = await getConnectionState();
    const result = await checkAnafConnection({
        environment: settings.environment,
        connectionState
    });
    if (result.ok && result.refreshedRefreshToken) {
        await updateConnectionTokenState({
            encryptedRefreshToken: encryptAnafToken(result.refreshedRefreshToken),
            isConnected: true
        });
    }
    await markConnectionVerified(result.ok, result.ok ? null : result.code, result.message);
    response.status(OK);
    response.json({
        data: {
            ...result,
            label: getConnectionLabel(settings.environment, result.ok)
        }
    });
}
//# sourceMappingURL=checkConnection.js.map