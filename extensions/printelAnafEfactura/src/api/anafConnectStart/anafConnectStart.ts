import { OK } from '@evershop/evershop/lib/util/httpStatus';
import { getEffectiveAnafSettings } from '../../lib/settings.js';
import { buildAnafAuthorizationUrl } from '../../lib/tsAnafClient.js';

export default async function anafConnectStart(_request: any, response: any) {
  const settings = await getEffectiveAnafSettings();
  response.status(OK);
  response.json({
    data: {
      redirectUrl: buildAnafAuthorizationUrl(settings.environment)
    }
  });
}
