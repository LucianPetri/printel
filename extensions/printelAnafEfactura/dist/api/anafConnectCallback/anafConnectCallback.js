import { saveConnectionState } from '../../lib/anafComplianceRepository.js';
import { getEffectiveAnafSettings } from '../../lib/settings.js';
import { encryptAnafToken } from '../../lib/tokenCipher.js';
import { exchangeAnafAuthorizationCode } from '../../lib/tsAnafClient.js';
export default async function anafConnectCallback(request, response) {
    var _a, _b, _c;
    const settings = await getEffectiveAnafSettings();
    const authorizationCode = String(request.query.code || '').trim();
    const tokenResponse = await exchangeAnafAuthorizationCode(settings.environment, authorizationCode);
    await saveConnectionState({
        companyTaxId: settings.companyTaxId,
        environment: settings.environment,
        encryptedRefreshToken: encryptAnafToken(tokenResponse.refresh_token),
        tokenExpiresAt: new Date(Date.now() + Number(tokenResponse.expires_in || 0) * 1000),
        connectedByAdminUserId: (_c = (_b = (_a = request.getCurrentUser) === null || _a === void 0 ? void 0 : _a.call(request)) === null || _b === void 0 ? void 0 : _b.admin_user_id) !== null && _c !== void 0 ? _c : null,
        isConnected: true
    });
    response.redirect('/admin/setting/store');
}
//# sourceMappingURL=anafConnectCallback.js.map