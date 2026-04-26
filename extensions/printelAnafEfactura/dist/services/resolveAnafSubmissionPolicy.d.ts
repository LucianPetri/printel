export declare function resolveAnafSubmissionPolicy(): Promise<{
    enabled: boolean;
    environment: "test" | "prod";
    submissionMode: "automatic" | "manual";
    manualApprovalRequired: boolean;
}>;
export declare function canAdminApproveAnafSubmission(adminUser: Record<string, any> | null | undefined): boolean;
