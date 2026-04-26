import { saveConnectionState } from '../../lib/anafComplianceRepository.js';
import { getEffectiveAnafSettings } from '../../lib/settings.js';
import { encryptAnafToken } from '../../lib/tokenCipher.js';
import { exchangeAnafAuthorizationCode } from '../../lib/tsAnafClient.js';

export default async function anafConnectCallback(request: any, response: any) {
  const settings = await getEffectiveAnafSettings();
  const authorizationCode = String(request.query.code || '').trim();
  const tokenResponse = await exchangeAnafAuthorizationCode(
    settings.environment,
    authorizationCode
  );

  await saveConnectionState({
    companyTaxId: settings.companyTaxId,
    environment: settings.environment,
    encryptedRefreshToken: encryptAnafToken(tokenResponse.refresh_token),
    tokenExpiresAt: new Date(Date.now() + Number(tokenResponse.expires_in || 0) * 1000),
    connectedByAdminUserId: request.getCurrentUser?.()?.admin_user_id ?? null,
    isConnected: true
  });

  response.redirect('/admin/setting/store');
}
