import {
  getOrderComplianceByOrderId,
  listAnafAttempts,
  listOrderComplianceSummariesForOrderIds,
  mapComplianceForAdmin
} from '../../../lib/anafComplianceRepository.js';

type GraphqlContext = {
  orderAnafComplianceCache?: Map<number, any>;
};

async function loadCompliance(orderId: number, context: GraphqlContext) {
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
    anafCompliance: async (order: Record<string, any>, _: unknown, context: GraphqlContext) => {
      const orderId = Number.parseInt(String(order.orderId ?? order.order_id), 10);
      return await loadCompliance(orderId, context);
    }
  }
};
