import { resolveAnafSubmissionPolicy } from '../../services/resolveAnafSubmissionPolicy.js';
import { reconcileAnafSubmission } from '../../services/reconcileAnafSubmission.js';
import { sendDelayedOrderConfirmation } from '../../services/sendDelayedOrderConfirmation.js';
export default async function processAutomaticAnafSubmission(data) {
    const policy = await resolveAnafSubmissionPolicy();
    if (!policy.enabled) {
        await sendLegacyOrderConfirmation(data.order_id);
        return;
    }
    if (policy.manualApprovalRequired) {
        return;
    }
    await reconcileAnafSubmission(data.order_id, 'auto');
}
async function sendLegacyOrderConfirmation(orderId) {
    var _a;
    const { pool } = await import('@evershop/evershop/lib/postgres');
    const orderResult = await pool.query(`SELECT order_id FROM "order" WHERE order_id = $1 LIMIT 1`, [orderId]);
    if (!((_a = orderResult.rows[0]) === null || _a === void 0 ? void 0 : _a.order_id)) {
        return;
    }
    await sendDelayedOrderConfirmation(orderId, { skipAnafRegistrationRequirement: true });
}
//# sourceMappingURL=processAutomaticAnafSubmission.js.map