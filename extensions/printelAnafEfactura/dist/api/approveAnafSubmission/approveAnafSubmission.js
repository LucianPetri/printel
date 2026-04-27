import { OK, UNAUTHORIZED } from '@evershop/evershop/lib/util/httpStatus';
import { pool } from '@evershop/evershop/lib/postgres';
import { canAdminApproveAnafSubmission } from '../../services/resolveAnafSubmissionPolicy.js';
import { reconcileAnafSubmission } from '../../services/reconcileAnafSubmission.js';
export default async function approveAnafSubmission(request, response) {
    const adminUser = request.getCurrentUser?.() ?? request.locals?.user ?? null;
    if (!canAdminApproveAnafSubmission(adminUser)) {
        response.status(UNAUTHORIZED);
        response.json({
            error: {
                status: UNAUTHORIZED,
                message: 'Unauthorized'
            }
        });
        return;
    }
    const orderResult = await pool.query(`SELECT order_id FROM "order" WHERE uuid = $1`, [
        request.params.uuid
    ]);
    const orderId = orderResult.rows[0]?.order_id;
    if (!orderId) {
        response.status(UNAUTHORIZED);
        response.json({
            error: {
                status: UNAUTHORIZED,
                message: 'Order not found'
            }
        });
        return;
    }
    const compliance = await reconcileAnafSubmission(orderId, 'manual_approval', adminUser.admin_user_id);
    response.status(OK);
    response.json({
        data: compliance
    });
}
