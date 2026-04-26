import { getEffectiveAnafSettings } from '../lib/settings.js';

export async function resolveAnafSubmissionPolicy() {
  const settings = await getEffectiveAnafSettings();

  return {
    enabled: settings.enabled,
    environment: settings.environment,
    submissionMode: settings.submissionMode,
    manualApprovalRequired: settings.enabled && settings.submissionMode === 'manual'
  };
}

export function canAdminApproveAnafSubmission(adminUser: Record<string, any> | null | undefined) {
  return !!adminUser?.admin_user_id;
}
