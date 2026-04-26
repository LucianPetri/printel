import crypto from 'node:crypto';
import { pool } from '@evershop/evershop/lib/postgres';
import { getAnafAttemptStatusLabel, getAnafAttemptTriggerLabel, getAnafStatusMeta, getNextRetryAt } from './anafStatuses.js';
function parseJson(value) {
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value);
    }
    catch (_a) {
        return null;
    }
}
function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}
export async function getOrderComplianceByOrderId(orderId) {
    var _a;
    const result = await pool.query(`SELECT *
     FROM order_anaf_compliance
     WHERE order_id = $1
     LIMIT 1`, [orderId]);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export async function getOrderComplianceByUuid(orderUuid) {
    var _a;
    const result = await pool.query(`SELECT compliance.*
     FROM order_anaf_compliance compliance
     INNER JOIN "order" o ON o.order_id = compliance.order_id
     WHERE o.uuid = $1
     LIMIT 1`, [orderUuid]);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export async function ensureOrderComplianceRecord({ orderId, environment, submissionMode, status, invoiceNumber, invoiceHash, invoiceXml }) {
    await pool.query(`INSERT INTO order_anaf_compliance (
      order_id,
      environment,
      submission_mode,
      status,
      invoice_number,
      invoice_hash,
      invoice_xml
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (order_id) DO UPDATE
    SET environment = EXCLUDED.environment,
        submission_mode = EXCLUDED.submission_mode,
        invoice_number = COALESCE(order_anaf_compliance.invoice_number, EXCLUDED.invoice_number),
        invoice_hash = COALESCE(order_anaf_compliance.invoice_hash, EXCLUDED.invoice_hash),
        invoice_xml = COALESCE(order_anaf_compliance.invoice_xml, EXCLUDED.invoice_xml),
        updated_at = NOW()`, [orderId, environment, submissionMode, status, invoiceNumber, invoiceHash, invoiceXml]);
    const compliance = await getOrderComplianceByOrderId(orderId);
    if (!compliance) {
        throw new Error(`Unable to initialize ANAF compliance row for order ${orderId}`);
    }
    return compliance;
}
export async function updateComplianceState(orderId, state) {
    var _a;
    const assignments = [];
    const values = [];
    Object.entries(state).forEach(([key, value], index) => {
        assignments.push(`${key} = $${index + 2}`);
        values.push(value);
    });
    if (assignments.length === 0) {
        return await getOrderComplianceByOrderId(orderId);
    }
    const result = await pool.query(`UPDATE order_anaf_compliance
     SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE order_id = $1
     RETURNING *`, [orderId, ...values]);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export async function recordAnafAttempt({ orderId, triggeredBy, adminUserId = null, status, requestHash = null, responsePayload = null, finished = false }) {
    const result = await pool.query(`INSERT INTO order_anaf_attempt (
      order_id,
      triggered_by,
      admin_user_id,
      status,
      request_hash,
      response_payload,
      started_at,
      finished_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
    RETURNING *`, [
        orderId,
        triggeredBy,
        adminUserId,
        status,
        requestHash,
        responsePayload ? JSON.stringify(responsePayload) : null,
        finished ? new Date() : null
    ]);
    return result.rows[0];
}
export async function finishAnafAttempt(attemptId, status, responsePayload) {
    var _a;
    const result = await pool.query(`UPDATE order_anaf_attempt
     SET status = $2,
         response_payload = $3,
         finished_at = NOW()
     WHERE order_anaf_attempt_id = $1
     RETURNING *`, [attemptId, status, responsePayload ? JSON.stringify(responsePayload) : null]);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export async function listAnafAttempts(orderId) {
    const result = await pool.query(`SELECT *
     FROM order_anaf_attempt
     WHERE order_id = $1
     ORDER BY started_at DESC, order_anaf_attempt_id DESC`, [orderId]);
    return result.rows;
}
export async function claimOrderConfirmationEmail(orderId) {
    var _a;
    const result = await pool.query(`UPDATE order_anaf_compliance
     SET email_released_at = NOW(),
         updated_at = NOW()
     WHERE order_id = $1
       AND email_released_at IS NULL
       AND status = 'registered'`, [orderId]);
    return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
}
export async function resetEmailReleaseClaim(orderId) {
    await pool.query(`UPDATE order_anaf_compliance
     SET email_released_at = NULL,
         updated_at = NOW()
     WHERE order_id = $1`, [orderId]);
}
export async function queueComplianceRetry(orderId, retryCount, failureCode, failureMessage) {
    return await updateComplianceState(orderId, {
        status: retryCount >= 5 ? 'attention_required' : 'queued',
        retry_count: retryCount,
        next_retry_at: retryCount >= 5 ? null : getNextRetryAt(retryCount),
        latest_failure_code: failureCode,
        latest_failure_message: failureMessage
    });
}
export async function getQueuedComplianceItems(limit = 25) {
    const result = await pool.query(`SELECT *
     FROM order_anaf_compliance
     WHERE status IN ('queued', 'submitting')
       AND (next_retry_at IS NULL OR next_retry_at <= NOW())
     ORDER BY COALESCE(next_retry_at, created_at) ASC
     LIMIT $1`, [limit]);
    return result.rows;
}
export async function markComplianceAsRegistered(orderId, registrationCode, uploadIndex, downloadId) {
    return await updateComplianceState(orderId, {
        status: 'registered',
        registration_code: registrationCode,
        upload_index: uploadIndex,
        download_id: downloadId,
        latest_failure_code: null,
        latest_failure_message: null,
        next_retry_at: null
    });
}
export async function markComplianceAsBlockedAuth(orderId, failureCode, failureMessage) {
    return await updateComplianceState(orderId, {
        status: 'blocked_auth',
        latest_failure_code: failureCode,
        latest_failure_message: failureMessage,
        next_retry_at: null
    });
}
export async function markComplianceAsManualReview(orderId, reason) {
    return await updateComplianceState(orderId, {
        status: 'manual_review',
        manual_review_reason: reason,
        next_retry_at: null
    });
}
export async function listOrderComplianceSummariesForOrderIds(orderIds) {
    if (orderIds.length === 0) {
        return new Map();
    }
    const result = await pool.query(`SELECT *
     FROM order_anaf_compliance
     WHERE order_id = ANY($1::int[])`, [orderIds]);
    return new Map(result.rows.map((row) => [row.order_id, row]));
}
export async function getConnectionState() {
    var _a;
    const result = await pool.query(`SELECT *
     FROM anaf_connection_state
     ORDER BY anaf_connection_state_id DESC
     LIMIT 1`);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export async function saveConnectionState({ companyTaxId, environment, encryptedRefreshToken, tokenExpiresAt, connectedByAdminUserId, isConnected, lastErrorCode = null, lastErrorMessage = null, lastDisconnectReason = null }) {
    await pool.query(`INSERT INTO anaf_connection_state (
      company_tax_id,
      environment,
      encrypted_refresh_token,
      token_expires_at,
      connected_by_admin_user_id,
      connected_at,
      last_verified_at,
      last_error_code,
      last_error_message,
      is_connected,
      last_disconnect_reason
    )
    VALUES ($1, $2, $3, $4, $5, CASE WHEN $6 THEN NOW() ELSE NULL END, NULL, $7, $8, $6, $9)`, [
        companyTaxId,
        environment,
        encryptedRefreshToken,
        tokenExpiresAt !== null && tokenExpiresAt !== void 0 ? tokenExpiresAt : null,
        connectedByAdminUserId !== null && connectedByAdminUserId !== void 0 ? connectedByAdminUserId : null,
        isConnected,
        lastErrorCode,
        lastErrorMessage,
        lastDisconnectReason
    ]);
    return await getConnectionState();
}
export async function markConnectionVerified(isConnected, failureCode, failureMessage) {
    var _a;
    const current = await getConnectionState();
    if (!current) {
        return null;
    }
    const result = await pool.query(`UPDATE anaf_connection_state
     SET last_verified_at = NOW(),
         is_connected = $2,
         last_error_code = $3,
         last_error_message = $4,
         updated_at = NOW()
     WHERE anaf_connection_state_id = $1
     RETURNING *`, [current.anaf_connection_state_id, isConnected, failureCode, failureMessage]);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export async function updateConnectionTokenState({ encryptedRefreshToken, tokenExpiresAt = null, failureCode = null, failureMessage = null, isConnected = true }) {
    var _a;
    const current = await getConnectionState();
    if (!current) {
        return null;
    }
    const result = await pool.query(`UPDATE anaf_connection_state
     SET encrypted_refresh_token = $2,
         token_expires_at = COALESCE($3, token_expires_at),
         is_connected = $4,
         last_verified_at = NOW(),
         last_error_code = $5,
         last_error_message = $6,
         updated_at = NOW()
     WHERE anaf_connection_state_id = $1
     RETURNING *`, [
        current.anaf_connection_state_id,
        encryptedRefreshToken,
        tokenExpiresAt,
        isConnected,
        failureCode,
        failureMessage
    ]);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export async function disconnectConnection(reason, adminUserId) {
    var _a;
    const current = await getConnectionState();
    if (!current) {
        return null;
    }
    const result = await pool.query(`UPDATE anaf_connection_state
     SET encrypted_refresh_token = NULL,
         token_expires_at = NULL,
         is_connected = FALSE,
         last_disconnect_reason = $2,
         connected_by_admin_user_id = COALESCE($3, connected_by_admin_user_id),
         updated_at = NOW()
     WHERE anaf_connection_state_id = $1
     RETURNING *`, [current.anaf_connection_state_id, reason, adminUserId !== null && adminUserId !== void 0 ? adminUserId : null]);
    return (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null;
}
export function buildResponsePreview(payload) {
    return hashValue(JSON.stringify(payload !== null && payload !== void 0 ? payload : null));
}
export function mapComplianceForAdmin(compliance, attempts = []) {
    if (!compliance) {
        return null;
    }
    const meta = getAnafStatusMeta(compliance.status);
    return {
        orderId: compliance.order_id,
        status: {
            code: compliance.status,
            label: meta.label,
            badge: meta.badge
        },
        submissionMode: compliance.submission_mode,
        environment: compliance.environment,
        invoiceNumber: compliance.invoice_number,
        invoiceHash: compliance.invoice_hash,
        registrationCode: compliance.registration_code,
        uploadIndex: compliance.upload_index,
        downloadId: compliance.download_id,
        latestFailureCode: compliance.latest_failure_code,
        latestFailureMessage: compliance.latest_failure_message,
        retryCount: compliance.retry_count,
        nextRetryAt: compliance.next_retry_at,
        approvedByAdminUserId: compliance.approved_by_admin_user_id,
        approvedAt: compliance.approved_at,
        emailReleasedAt: compliance.email_released_at,
        manualReviewReason: compliance.manual_review_reason,
        attempts: attempts.map((attempt) => ({
            orderAnafAttemptId: attempt.order_anaf_attempt_id,
            triggeredBy: attempt.triggered_by,
            triggeredByLabel: getAnafAttemptTriggerLabel(attempt.triggered_by),
            adminUserId: attempt.admin_user_id,
            status: attempt.status,
            statusLabel: getAnafAttemptStatusLabel(attempt.status),
            requestHash: attempt.request_hash,
            responsePayload: parseJson(attempt.response_payload),
            startedAt: attempt.started_at,
            finishedAt: attempt.finished_at
        }))
    };
}
//# sourceMappingURL=anafComplianceRepository.js.map