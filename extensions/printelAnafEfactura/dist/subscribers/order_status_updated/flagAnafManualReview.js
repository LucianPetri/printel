import { pool } from '@evershop/evershop/lib/postgres';
import { translate } from '@evershop/evershop/lib/locale/translate/translate';
import { getOrderComplianceByOrderId, markComplianceAsManualReview } from '../../lib/anafComplianceRepository.js';
export default async function flagAnafManualReview(data) {
    if (data.after !== 'canceled') {
        return;
    }
    const compliance = await getOrderComplianceByOrderId(data.orderId);
    if (!compliance) {
        return;
    }
    if ([
        'registered',
        'manual_review'
    ].includes(compliance.status)) {
        return;
    }
    const orderResult = await pool.query(`SELECT order_number FROM "order" WHERE order_id = $1`, [
        data.orderId
    ]);
    const orderNumber = orderResult.rows[0]?.order_number ?? data.orderId;
    await markComplianceAsManualReview(data.orderId, translate('Order #${orderNumber} was canceled before ANAF registration completed.', {
        orderNumber: String(orderNumber)
    }));
}
