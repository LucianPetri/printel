export const ANAF_ENVIRONMENTS = ['test', 'prod'];
export const ANAF_SUBMISSION_MODES = ['automatic', 'manual'];
export const ANAF_COMPLIANCE_STATUSES = [
    'pending_approval',
    'queued',
    'submitting',
    'registered',
    'attention_required',
    'manual_review',
    'blocked_auth'
];
export const ANAF_ATTEMPT_TRIGGERS = [
    'auto',
    'manual_approval',
    'retry_cron',
    'admin_retry',
    'reconcile'
];
export const ANAF_TERMINAL_STATUSES = new Set([
    'registered',
    'manual_review'
]);
export const ANAF_RETRY_BACKOFF_MINUTES = [5, 15, 30, 60, 360];
export function isAnafEnvironment(value) {
    return !!value && ANAF_ENVIRONMENTS.includes(value);
}
export function isAnafSubmissionMode(value) {
    return !!value && ANAF_SUBMISSION_MODES.includes(value);
}
export function getNextRetryAt(retryCount, now = new Date()) {
    const delayMinutes = ANAF_RETRY_BACKOFF_MINUTES[Math.min(Math.max(retryCount, 0), ANAF_RETRY_BACKOFF_MINUTES.length - 1)];
    return new Date(now.getTime() + delayMinutes * 60000);
}
export function getAnafStatusMeta(status) {
    const map = {
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
export function getAnafAttemptTriggerLabel(trigger) {
    const map = {
        auto: 'Automatic submission',
        manual_approval: 'Manual approval',
        retry_cron: 'Retry worker',
        admin_retry: 'Administrator retry',
        reconcile: 'Reconciliation'
    };
    return map[trigger];
}
export function getAnafAttemptStatusLabel(status) {
    var _a;
    const map = {
        started: 'Started',
        registered: 'Registered',
        duplicate: 'Duplicate response',
        queued: 'Queued for retry',
        blocked_auth: 'Blocked authentication'
    };
    return (_a = map[status]) !== null && _a !== void 0 ? _a : status;
}
//# sourceMappingURL=anafStatuses.js.map