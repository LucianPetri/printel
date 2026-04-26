export const ANAF_ENVIRONMENTS = ['test', 'prod'] as const;
export type AnafEnvironment = (typeof ANAF_ENVIRONMENTS)[number];

export const ANAF_SUBMISSION_MODES = ['automatic', 'manual'] as const;
export type AnafSubmissionMode = (typeof ANAF_SUBMISSION_MODES)[number];

export const ANAF_COMPLIANCE_STATUSES = [
  'pending_approval',
  'queued',
  'submitting',
  'registered',
  'attention_required',
  'manual_review',
  'blocked_auth'
] as const;
export type AnafComplianceStatus = (typeof ANAF_COMPLIANCE_STATUSES)[number];

export const ANAF_ATTEMPT_TRIGGERS = [
  'auto',
  'manual_approval',
  'retry_cron',
  'admin_retry',
  'reconcile'
] as const;
export type AnafAttemptTrigger = (typeof ANAF_ATTEMPT_TRIGGERS)[number];

export const ANAF_TERMINAL_STATUSES = new Set<AnafComplianceStatus>([
  'registered',
  'manual_review'
]);

export const ANAF_RETRY_BACKOFF_MINUTES = [5, 15, 30, 60, 360];

export function isAnafEnvironment(value: string | null | undefined): value is AnafEnvironment {
  return !!value && ANAF_ENVIRONMENTS.includes(value as AnafEnvironment);
}

export function isAnafSubmissionMode(
  value: string | null | undefined
): value is AnafSubmissionMode {
  return !!value && ANAF_SUBMISSION_MODES.includes(value as AnafSubmissionMode);
}

export function getNextRetryAt(retryCount: number, now = new Date()): Date {
  const delayMinutes =
    ANAF_RETRY_BACKOFF_MINUTES[
      Math.min(Math.max(retryCount, 0), ANAF_RETRY_BACKOFF_MINUTES.length - 1)
    ];
  return new Date(now.getTime() + delayMinutes * 60_000);
}

export function getAnafStatusMeta(status: AnafComplianceStatus) {
  const map: Record<AnafComplianceStatus, { badge: string; label: string }> = {
    pending_approval: { badge: 'outline', label: 'Pending approval' },
    queued: { badge: 'secondary', label: 'Queued for retry' },
    submitting: { badge: 'default', label: 'Submitting to ANAF' },
    registered: { badge: 'success', label: 'Registered' },
    attention_required: { badge: 'destructive', label: 'Attention required' },
    manual_review: { badge: 'warning', label: 'Manual review' },
    blocked_auth: { badge: 'destructive', label: 'Blocked authentication' }
  };

  return map[status];
}

export function getAnafAttemptTriggerLabel(trigger: AnafAttemptTrigger) {
  const map: Record<AnafAttemptTrigger, string> = {
    auto: 'Automatic submission',
    manual_approval: 'Manual approval',
    retry_cron: 'Retry worker',
    admin_retry: 'Administrator retry',
    reconcile: 'Reconciliation'
  };

  return map[trigger];
}

export function getAnafAttemptStatusLabel(status: string) {
  const map: Record<string, string> = {
    started: 'Started',
    registered: 'Registered',
    duplicate: 'Duplicate response',
    queued: 'Queued for retry',
    blocked_auth: 'Blocked authentication'
  };

  return map[status] ?? status;
}
