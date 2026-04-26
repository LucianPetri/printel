export declare const ANAF_ENVIRONMENTS: readonly ["test", "prod"];
export type AnafEnvironment = (typeof ANAF_ENVIRONMENTS)[number];
export declare const ANAF_SUBMISSION_MODES: readonly ["automatic", "manual"];
export type AnafSubmissionMode = (typeof ANAF_SUBMISSION_MODES)[number];
export declare const ANAF_COMPLIANCE_STATUSES: readonly ["pending_approval", "queued", "submitting", "registered", "attention_required", "manual_review", "blocked_auth"];
export type AnafComplianceStatus = (typeof ANAF_COMPLIANCE_STATUSES)[number];
export declare const ANAF_ATTEMPT_TRIGGERS: readonly ["auto", "manual_approval", "retry_cron", "admin_retry", "reconcile"];
export type AnafAttemptTrigger = (typeof ANAF_ATTEMPT_TRIGGERS)[number];
export declare const ANAF_TERMINAL_STATUSES: Set<"pending_approval" | "queued" | "submitting" | "registered" | "attention_required" | "manual_review" | "blocked_auth">;
export declare const ANAF_RETRY_BACKOFF_MINUTES: number[];
export declare function isAnafEnvironment(value: string | null | undefined): value is AnafEnvironment;
export declare function isAnafSubmissionMode(value: string | null | undefined): value is AnafSubmissionMode;
export declare function getNextRetryAt(retryCount: number, now?: Date): Date;
export declare function getAnafStatusMeta(status: AnafComplianceStatus): {
    badge: string;
    label: string;
};
export declare function getAnafAttemptTriggerLabel(trigger: AnafAttemptTrigger): string;
export declare function getAnafAttemptStatusLabel(status: string): string;
