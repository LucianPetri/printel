import { pool } from '@evershop/evershop/lib/postgres';
import { translate } from '@evershop/evershop/lib/locale/translate/translate';
import { getOrderComplianceByOrderId, markComplianceAsManualReview } from '../../lib/anafComplianceRepository.js';
export default async function flagAnafManualReview(data) {
    var _a, _b;
    if (data.after !== 'canceled') {
        return;
    }
    const compliance = await getOrderComplianceByOrderId(data.orderId);
    if (!compliance) {
        return;
    }
    if (['registered', 'manual_review'].includes(compliance.status)) {
        return;
    }
    const orderResult = await pool.query(`SELECT order_number FROM "order" WHERE order_id = $1`, [
        data.orderId
    ]);
    const orderNumber = (_b = (_a = orderResult.rows[0]) === null || _a === void 0 ? void 0 : _a.order_number) !== null && _b !== void 0 ? _b : data.orderId;
    await markComplianceAsManualReview(data.orderId, translate('Order #${orderNumber} was canceled before ANAF registration completed.', {
        orderNumber: String(orderNumber)
    }));
}
//# sourceMappingURL=flagAnafManualReview.js.map