import { updateComplianceState } from '../lib/anafComplianceRepository.js';
export async function markAnafAttentionRequired(orderId, failureCode, failureMessage) {
    return await updateComplianceState(orderId, {
        status: 'attention_required',
        latest_failure_code: failureCode,
        latest_failure_message: failureMessage,
        next_retry_at: null
    });
}
