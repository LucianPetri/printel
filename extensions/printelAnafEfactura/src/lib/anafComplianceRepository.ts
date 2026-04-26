import crypto from 'node:crypto';
import { pool } from '@evershop/evershop/lib/postgres';
import {
  AnafAttemptTrigger,
  AnafComplianceStatus,
  AnafEnvironment,
  AnafSubmissionMode,
  getAnafAttemptStatusLabel,
  getAnafAttemptTriggerLabel,
  getAnafStatusMeta,
  getNextRetryAt
} from './anafStatuses.js';

export type AnafComplianceRecord = {
  order_anaf_compliance_id: number;
  order_id: number;
  environment: AnafEnvironment;
  submission_mode: AnafSubmissionMode;
  status: AnafComplianceStatus;
  invoice_number: string | null;
  invoice_hash: string | null;
  invoice_xml: string | null;
  upload_index: string | null;
  download_id: string | null;
  registration_code: string | null;
  latest_failure_code: string | null;
  latest_failure_message: string | null;
  retry_count: number;
  next_retry_at: Date | null;
  approved_by_admin_user_id: number | null;
  approved_at: Date | null;
  email_released_at: Date | null;
  manual_review_reason: string | null;
  created_at: Date;
  updated_at: Date;
};

export type AnafAttemptRecord = {
  order_anaf_attempt_id: number;
  order_id: number;
  triggered_by: AnafAttemptTrigger;
  admin_user_id: number | null;
  status: string;
  request_hash: string | null;
  response_payload: string | null;
  started_at: Date;
  finished_at: Date | null;
};

export type AnafConnectionState = {
  anaf_connection_state_id: number;
  company_tax_id: string | null;
  environment: AnafEnvironment;
  encrypted_refresh_token: string | null;
  token_expires_at: Date | null;
  connected_by_admin_user_id: number | null;
  connected_at: Date | null;
  last_verified_at: Date | null;
  last_error_code: string | null;
  last_error_message: string | null;
  is_connected: boolean;
  last_disconnect_reason: string | null;
  created_at: Date;
  updated_at: Date;
};

type EnsureComplianceArgs = {
  orderId: number;
  environment: AnafEnvironment;
  submissionMode: AnafSubmissionMode;
  status: AnafComplianceStatus;
  invoiceNumber: string;
  invoiceHash: string;
  invoiceXml: string;
};

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function hashValue(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export async function getOrderComplianceByOrderId(
  orderId: number
): Promise<AnafComplianceRecord | null> {
  const result = await pool.query(
    `SELECT *
     FROM order_anaf_compliance
     WHERE order_id = $1
     LIMIT 1`,
    [orderId]
  );

  return (result.rows[0] as AnafComplianceRecord | undefined) ?? null;
}

export async function getOrderComplianceByUuid(orderUuid: string) {
  const result = await pool.query(
    `SELECT compliance.*
     FROM order_anaf_compliance compliance
     INNER JOIN "order" o ON o.order_id = compliance.order_id
     WHERE o.uuid = $1
     LIMIT 1`,
    [orderUuid]
  );

  return (result.rows[0] as AnafComplianceRecord | undefined) ?? null;
}

export async function ensureOrderComplianceRecord({
  orderId,
  environment,
  submissionMode,
  status,
  invoiceNumber,
  invoiceHash,
  invoiceXml
}: EnsureComplianceArgs): Promise<AnafComplianceRecord> {
  await pool.query(
    `INSERT INTO order_anaf_compliance (
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
        updated_at = NOW()`,
    [orderId, environment, submissionMode, status, invoiceNumber, invoiceHash, invoiceXml]
  );

  const compliance = await getOrderComplianceByOrderId(orderId);
  if (!compliance) {
    throw new Error(`Unable to initialize ANAF compliance row for order ${orderId}`);
  }
  return compliance;
}

export async function updateComplianceState(
  orderId: number,
  state: Partial<
    Pick<
      AnafComplianceRecord,
      | 'status'
      | 'upload_index'
      | 'download_id'
      | 'registration_code'
      | 'latest_failure_code'
      | 'latest_failure_message'
      | 'retry_count'
      | 'next_retry_at'
      | 'approved_by_admin_user_id'
      | 'approved_at'
      | 'email_released_at'
      | 'manual_review_reason'
      | 'invoice_hash'
      | 'invoice_xml'
      | 'invoice_number'
    >
  >
) {
  const assignments: string[] = [];
  const values: unknown[] = [];

  Object.entries(state).forEach(([key, value], index) => {
    assignments.push(`${key} = $${index + 2}`);
    values.push(value);
  });

  if (assignments.length === 0) {
    return await getOrderComplianceByOrderId(orderId);
  }

  const result = await pool.query(
    `UPDATE order_anaf_compliance
     SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE order_id = $1
     RETURNING *`,
    [orderId, ...values]
  );

  return (result.rows[0] as AnafComplianceRecord | undefined) ?? null;
}

export async function recordAnafAttempt({
  orderId,
  triggeredBy,
  adminUserId = null,
  status,
  requestHash = null,
  responsePayload = null,
  finished = false
}: {
  orderId: number;
  triggeredBy: AnafAttemptTrigger;
  adminUserId?: number | null;
  status: string;
  requestHash?: string | null;
  responsePayload?: unknown;
  finished?: boolean;
}) {
  const result = await pool.query(
    `INSERT INTO order_anaf_attempt (
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
    RETURNING *`,
    [
      orderId,
      triggeredBy,
      adminUserId,
      status,
      requestHash,
      responsePayload ? JSON.stringify(responsePayload) : null,
      finished ? new Date() : null
    ]
  );

  return result.rows[0] as AnafAttemptRecord;
}

export async function finishAnafAttempt(
  attemptId: number,
  status: string,
  responsePayload?: unknown
) {
  const result = await pool.query(
    `UPDATE order_anaf_attempt
     SET status = $2,
         response_payload = $3,
         finished_at = NOW()
     WHERE order_anaf_attempt_id = $1
     RETURNING *`,
    [attemptId, status, responsePayload ? JSON.stringify(responsePayload) : null]
  );

  return (result.rows[0] as AnafAttemptRecord | undefined) ?? null;
}

export async function listAnafAttempts(orderId: number): Promise<AnafAttemptRecord[]> {
  const result = await pool.query(
    `SELECT *
     FROM order_anaf_attempt
     WHERE order_id = $1
     ORDER BY started_at DESC, order_anaf_attempt_id DESC`,
    [orderId]
  );

  return result.rows as AnafAttemptRecord[];
}

export async function claimOrderConfirmationEmail(orderId: number): Promise<boolean> {
  const result = await pool.query(
    `UPDATE order_anaf_compliance
     SET email_released_at = NOW(),
         updated_at = NOW()
     WHERE order_id = $1
       AND email_released_at IS NULL
       AND status = 'registered'`,
    [orderId]
  );

  return (result.rowCount ?? 0) > 0;
}

export async function resetEmailReleaseClaim(orderId: number) {
  await pool.query(
    `UPDATE order_anaf_compliance
     SET email_released_at = NULL,
         updated_at = NOW()
     WHERE order_id = $1`,
    [orderId]
  );
}

export async function queueComplianceRetry(
  orderId: number,
  retryCount: number,
  failureCode: string | null,
  failureMessage: string | null
) {
  return await updateComplianceState(orderId, {
    status: retryCount >= 5 ? 'attention_required' : 'queued',
    retry_count: retryCount,
    next_retry_at: retryCount >= 5 ? null : getNextRetryAt(retryCount),
    latest_failure_code: failureCode,
    latest_failure_message: failureMessage
  });
}

export async function getQueuedComplianceItems(limit = 25) {
  const result = await pool.query(
    `SELECT *
     FROM order_anaf_compliance
     WHERE status IN ('queued', 'submitting')
       AND (next_retry_at IS NULL OR next_retry_at <= NOW())
     ORDER BY COALESCE(next_retry_at, created_at) ASC
     LIMIT $1`,
    [limit]
  );

  return result.rows as AnafComplianceRecord[];
}

export async function markComplianceAsRegistered(
  orderId: number,
  registrationCode: string,
  uploadIndex: string | null,
  downloadId: string | null
) {
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

export async function markComplianceAsBlockedAuth(
  orderId: number,
  failureCode: string,
  failureMessage: string
) {
  return await updateComplianceState(orderId, {
    status: 'blocked_auth',
    latest_failure_code: failureCode,
    latest_failure_message: failureMessage,
    next_retry_at: null
  });
}

export async function markComplianceAsManualReview(
  orderId: number,
  reason: string
) {
  return await updateComplianceState(orderId, {
    status: 'manual_review',
    manual_review_reason: reason,
    next_retry_at: null
  });
}

export async function listOrderComplianceSummariesForOrderIds(orderIds: number[]) {
  if (orderIds.length === 0) {
    return new Map<number, AnafComplianceRecord>();
  }

  const result = await pool.query(
    `SELECT *
     FROM order_anaf_compliance
     WHERE order_id = ANY($1::int[])`,
    [orderIds]
  );

  return new Map<number, AnafComplianceRecord>(
    (result.rows as AnafComplianceRecord[]).map((row) => [row.order_id, row])
  );
}

export async function getConnectionState(): Promise<AnafConnectionState | null> {
  const result = await pool.query(
    `SELECT *
     FROM anaf_connection_state
     ORDER BY anaf_connection_state_id DESC
     LIMIT 1`
  );

  return (result.rows[0] as AnafConnectionState | undefined) ?? null;
}

export async function saveConnectionState({
  companyTaxId,
  environment,
  encryptedRefreshToken,
  tokenExpiresAt,
  connectedByAdminUserId,
  isConnected,
  lastErrorCode = null,
  lastErrorMessage = null,
  lastDisconnectReason = null
}: {
  companyTaxId: string | null;
  environment: AnafEnvironment;
  encryptedRefreshToken: string | null;
  tokenExpiresAt?: Date | null;
  connectedByAdminUserId?: number | null;
  isConnected: boolean;
  lastErrorCode?: string | null;
  lastErrorMessage?: string | null;
  lastDisconnectReason?: string | null;
}) {
  await pool.query(
    `INSERT INTO anaf_connection_state (
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
    VALUES ($1, $2, $3, $4, $5, CASE WHEN $6 THEN NOW() ELSE NULL END, NULL, $7, $8, $6, $9)`,
    [
      companyTaxId,
      environment,
      encryptedRefreshToken,
      tokenExpiresAt ?? null,
      connectedByAdminUserId ?? null,
      isConnected,
      lastErrorCode,
      lastErrorMessage,
      lastDisconnectReason
    ]
  );

  return await getConnectionState();
}

export async function markConnectionVerified(
  isConnected: boolean,
  failureCode: string | null,
  failureMessage: string | null
) {
  const current = await getConnectionState();
  if (!current) {
    return null;
  }

  const result = await pool.query(
    `UPDATE anaf_connection_state
     SET last_verified_at = NOW(),
         is_connected = $2,
         last_error_code = $3,
         last_error_message = $4,
         updated_at = NOW()
     WHERE anaf_connection_state_id = $1
     RETURNING *`,
    [current.anaf_connection_state_id, isConnected, failureCode, failureMessage]
  );

  return (result.rows[0] as AnafConnectionState | undefined) ?? null;
}

export async function updateConnectionTokenState({
  encryptedRefreshToken,
  tokenExpiresAt = null,
  failureCode = null,
  failureMessage = null,
  isConnected = true
}: {
  encryptedRefreshToken: string;
  tokenExpiresAt?: Date | null;
  failureCode?: string | null;
  failureMessage?: string | null;
  isConnected?: boolean;
}) {
  const current = await getConnectionState();
  if (!current) {
    return null;
  }

  const result = await pool.query(
    `UPDATE anaf_connection_state
     SET encrypted_refresh_token = $2,
         token_expires_at = COALESCE($3, token_expires_at),
         is_connected = $4,
         last_verified_at = NOW(),
         last_error_code = $5,
         last_error_message = $6,
         updated_at = NOW()
     WHERE anaf_connection_state_id = $1
     RETURNING *`,
    [
      current.anaf_connection_state_id,
      encryptedRefreshToken,
      tokenExpiresAt,
      isConnected,
      failureCode,
      failureMessage
    ]
  );

  return (result.rows[0] as AnafConnectionState | undefined) ?? null;
}

export async function disconnectConnection(reason: string, adminUserId?: number | null) {
  const current = await getConnectionState();
  if (!current) {
    return null;
  }

  const result = await pool.query(
    `UPDATE anaf_connection_state
     SET encrypted_refresh_token = NULL,
         token_expires_at = NULL,
         is_connected = FALSE,
         last_disconnect_reason = $2,
         connected_by_admin_user_id = COALESCE($3, connected_by_admin_user_id),
         updated_at = NOW()
     WHERE anaf_connection_state_id = $1
     RETURNING *`,
    [current.anaf_connection_state_id, reason, adminUserId ?? null]
  );

  return (result.rows[0] as AnafConnectionState | undefined) ?? null;
}

export function buildResponsePreview(payload: unknown) {
  return hashValue(JSON.stringify(payload ?? null));
}

export function mapComplianceForAdmin(
  compliance: AnafComplianceRecord | null,
  attempts: AnafAttemptRecord[] = []
) {
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
      responsePayload: parseJson<Record<string, unknown>>(attempt.response_payload),
      startedAt: attempt.started_at,
      finishedAt: attempt.finished_at
    }))
  };
}
