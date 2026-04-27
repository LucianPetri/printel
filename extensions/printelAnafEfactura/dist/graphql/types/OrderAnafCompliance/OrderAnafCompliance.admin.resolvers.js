import { getOrderComplianceByOrderId, listAnafAttempts, mapComplianceForAdmin } from '../../../lib/anafComplianceRepository.js';
async function loadCompliance(orderId, context) {
    if (!context.orderAnafComplianceCache) {
        context.orderAnafComplianceCache = new Map();
    }
    if (!context.orderAnafComplianceCache.has(orderId)) {
        const compliance = await getOrderComplianceByOrderId(orderId);
        if (!compliance) {
            context.orderAnafComplianceCache.set(orderId, null);
        } else {
            const attempts = await listAnafAttempts(orderId);
            context.orderAnafComplianceCache.set(orderId, mapComplianceForAdmin(compliance, attempts));
        }
    }
    return context.orderAnafComplianceCache.get(orderId);
}
export default {
    Order: {
        anafCompliance: async (order, _, context)=>{
            const orderId = Number.parseInt(String(order.orderId ?? order.order_id), 10);
            return await loadCompliance(orderId, context);
        }
    }
};
