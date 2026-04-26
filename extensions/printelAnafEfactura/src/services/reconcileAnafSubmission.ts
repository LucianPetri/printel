import { buildAnafInvoicePayload } from '../lib/buildAnafInvoicePayload.js';
import {
  buildResponsePreview,
  ensureOrderComplianceRecord,
  finishAnafAttempt,
  getConnectionState,
  getOrderComplianceByOrderId,
  markComplianceAsBlockedAuth,
  markComplianceAsManualReview,
  markComplianceAsRegistered,
  queueComplianceRetry,
  recordAnafAttempt,
  updateComplianceState,
  updateConnectionTokenState
} from '../lib/anafComplianceRepository.js';
import { encryptAnafToken } from '../lib/tokenCipher.js';
import { submitInvoiceToAnaf } from '../lib/tsAnafClient.js';
import { translate } from '@evershop/evershop/lib/locale/translate/translate';
import { resolveAnafSubmissionPolicy } from './resolveAnafSubmissionPolicy.js';
import { sendDelayedOrderConfirmation } from './sendDelayedOrderConfirmation.js';
import { markAnafAttentionRequired } from './markAnafAttentionRequired.js';

export async function reconcileAnafSubmission(
  orderId: number,
  triggeredBy:
    | 'auto'
    | 'manual_approval'
    | 'retry_cron'
    | 'admin_retry'
    | 'reconcile' = 'reconcile',
  adminUserId?: number | null
) {
  const payload = await buildAnafInvoicePayload(orderId);
  const policy = await resolveAnafSubmissionPolicy();
  const existing =
    (await ensureOrderComplianceRecord({
      orderId,
      environment: policy.environment,
      submissionMode: policy.submissionMode,
      status: policy.manualApprovalRequired ? 'pending_approval' : 'queued',
      invoiceNumber: payload.invoiceNumber,
      invoiceHash: payload.invoiceHash,
      invoiceXml: payload.invoiceXml
    })) ?? (await getOrderComplianceByOrderId(orderId));

  if (!existing) {
    throw new Error(`Missing ANAF compliance state for order ${orderId}`);
  }

  if (
    existing.status === 'registered' &&
    existing.invoice_hash &&
    existing.invoice_hash !== payload.invoiceHash
  ) {
    return existing;
  }

  if (
    ['queued', 'pending_approval', 'attention_required', 'blocked_auth'].includes(
      existing.status
    ) &&
    existing.invoice_hash &&
    existing.invoice_hash !== payload.invoiceHash
  ) {
    return await markComplianceAsManualReview(
      orderId,
      translate('Order data changed after the ANAF snapshot was created. Manual review is required.')
    );
  }

  const attempt = await recordAnafAttempt({
    orderId,
    triggeredBy,
    adminUserId,
    status: 'started',
    requestHash: buildResponsePreview(payload.payload)
  });

  await updateComplianceState(orderId, {
    status: 'submitting',
    invoice_hash: payload.invoiceHash,
    invoice_xml: payload.invoiceXml,
    invoice_number: payload.invoiceNumber,
    approved_by_admin_user_id:
      triggeredBy === 'manual_approval' || triggeredBy === 'admin_retry'
        ? adminUserId ?? null
        : existing.approved_by_admin_user_id,
    approved_at:
      triggeredBy === 'manual_approval' || triggeredBy === 'admin_retry'
        ? new Date()
        : existing.approved_at
  });

  const connectionState = await getConnectionState();
  const result = await submitInvoiceToAnaf({
    invoiceXml: payload.invoiceXml,
    invoiceHash: payload.invoiceHash,
    environment: policy.environment,
    connectionState
  });

  if (result.refreshedRefreshToken) {
    await updateConnectionTokenState({
      encryptedRefreshToken: encryptAnafToken(result.refreshedRefreshToken),
      isConnected: result.outcome !== 'blocked_auth'
    });
  }

  await finishAnafAttempt(attempt.order_anaf_attempt_id, result.outcome, result.raw);

  if (result.outcome === 'blocked_auth') {
    return await markComplianceAsBlockedAuth(
      orderId,
      result.failureCode,
      result.failureMessage
    );
  }

  if (result.outcome === 'queued') {
    const retryCount = (existing.retry_count ?? 0) + 1;
    if (retryCount >= 5) {
      return await markAnafAttentionRequired(
        orderId,
        result.failureCode,
        result.failureMessage
      );
    }
    return await queueComplianceRetry(
      orderId,
      retryCount,
      result.failureCode,
      result.failureMessage
    );
  }

  if (result.outcome === 'duplicate') {
    const duplicateRegistration = await markComplianceAsRegistered(
      orderId,
      result.registrationCode,
      result.uploadIndex,
      result.downloadId
    );
    await sendDelayedOrderConfirmation(orderId);
    return duplicateRegistration;
  }

  const registered = await markComplianceAsRegistered(
    orderId,
    result.registrationCode,
    result.uploadIndex,
    result.downloadId
  );
  await sendDelayedOrderConfirmation(orderId);
  return registered;
}
