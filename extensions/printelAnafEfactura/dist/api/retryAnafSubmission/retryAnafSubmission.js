import { OK, UNAUTHORIZED } from '@evershop/evershop/lib/util/httpStatus';
import { pool } from '@evershop/evershop/lib/postgres';
import { canAdminApproveAnafSubmission } from '../../services/resolveAnafSubmissionPolicy.js';
import { reconcileAnafSubmission } from '../../services/reconcileAnafSubmission.js';
export default async function retryAnafSubmission(request, response) {
    var _a, _b, _c, _d, _e;
    const adminUser = (_d = (_b = (_a = request.getCurrentUser) === null || _a === void 0 ? void 0 : _a.call(request)) !== null && _b !== void 0 ? _b : (_c = request.locals) === null || _c === void 0 ? void 0 : _c.user) !== null && _d !== void 0 ? _d : null;
    if (!canAdminApproveAnafSubmission(adminUser)) {
        response.status(UNAUTHORIZED);
        response.json({ error: { status: UNAUTHORIZED, message: 'Unauthorized' } });
        return;
    }
    const orderResult = await pool.query(`SELECT order_id FROM "order" WHERE uuid = $1`, [
        request.params.uuid
    ]);
    const orderId = (_e = orderResult.rows[0]) === null || _e === void 0 ? void 0 : _e.order_id;
    if (!orderId) {
        response.status(UNAUTHORIZED);
        response.json({ error: { status: UNAUTHORIZED, message: 'Order not found' } });
        return;
    }
    const compliance = await reconcileAnafSubmission(orderId, 'admin_retry', adminUser.admin_user_id);
    response.status(OK);
    response.json({
        data: compliance
    });
}
//# sourceMappingURL=retryAnafSubmission.js.map