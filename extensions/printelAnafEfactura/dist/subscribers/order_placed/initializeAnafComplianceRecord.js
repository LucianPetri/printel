import { buildAnafInvoicePayload } from '../../lib/buildAnafInvoicePayload.js';
import { ensureOrderComplianceRecord } from '../../lib/anafComplianceRepository.js';
import { resolveAnafSubmissionPolicy } from '../../services/resolveAnafSubmissionPolicy.js';
export default async function initializeAnafComplianceRecord(data) {
    const policy = await resolveAnafSubmissionPolicy();
    if (!policy.enabled) {
        return;
    }
    const payload = await buildAnafInvoicePayload(data.order_id);
    await ensureOrderComplianceRecord({
        orderId: data.order_id,
        environment: policy.environment,
        submissionMode: policy.submissionMode,
        status: policy.manualApprovalRequired ? 'pending_approval' : 'queued',
        invoiceNumber: payload.invoiceNumber,
        invoiceHash: payload.invoiceHash,
        invoiceXml: payload.invoiceXml
    });
}
