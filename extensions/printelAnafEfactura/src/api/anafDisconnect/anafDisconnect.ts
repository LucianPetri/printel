import { OK, UNAUTHORIZED } from '@evershop/evershop/lib/util/httpStatus';
import { disconnectConnection } from '../../lib/anafComplianceRepository.js';

export default async function anafDisconnect(request: any, response: any) {
  const adminUser = request.getCurrentUser?.() ?? request.locals?.user ?? null;
  if (!adminUser?.admin_user_id) {
    response.status(UNAUTHORIZED);
    response.json({ error: { status: UNAUTHORIZED, message: 'Unauthorized' } });
    return;
  }

  await disconnectConnection(
    'Disconnected from store settings.',
    adminUser.admin_user_id
  );

  response.status(OK);
  response.json({
    data: {
      success: true
    }
  });
}
