import { OK } from '@evershop/evershop/lib/util/httpStatus';
import { getOrderComplianceByUuid, listAnafAttempts, mapComplianceForAdmin } from '../../lib/anafComplianceRepository.js';

export default async function getOrderAnafStatus(request: any, response: any) {
  const compliance = await getOrderComplianceByUuid(request.params.uuid);
  if (!compliance) {
    response.status(OK);
    response.json({ data: null });
    return;
  }

  const attempts = await listAnafAttempts(compliance.order_id);
  response.status(OK);
  response.json({
    data: mapComplianceForAdmin(compliance, attempts)
  });
}
