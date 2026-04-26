import { Badge } from '@components/common/ui/Badge.js';
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
function renderValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }
    return String(value);
}
export default function AnafComplianceSummary({ order }) {
    var _a, _b;
    if (!(order === null || order === void 0 ? void 0 : order.anafCompliance)) {
        return null;
    }
    const compliance = order.anafCompliance;
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, _('ANAF compliance'))),
        React.createElement(CardContent, { className: "space-y-4" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(Badge, { variant: compliance.status.badge }, _(compliance.status.label)),
                React.createElement("span", { className: "text-sm text-textSubdued" }, `${_(compliance.environment === 'prod' ? 'Live / production' : 'Sandbox / test')} · ${_(compliance.submissionMode === 'manual'
                    ? 'Manual approval required'
                    : 'Automatic on order placement')}`)),
            React.createElement("dl", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" },
                React.createElement("div", null,
                    React.createElement("dt", { className: "font-semibold" }, _('Registration code')),
                    React.createElement("dd", null, renderValue(compliance.registrationCode))),
                React.createElement("div", null,
                    React.createElement("dt", { className: "font-semibold" }, _('Retry count')),
                    React.createElement("dd", null, renderValue(compliance.retryCount))),
                React.createElement("div", null,
                    React.createElement("dt", { className: "font-semibold" }, _('Next retry')),
                    React.createElement("dd", null, renderValue((_b = (_a = compliance.nextRetryAt) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : compliance.nextRetryAt))),
                React.createElement("div", null,
                    React.createElement("dt", { className: "font-semibold" }, _('Email released')),
                    React.createElement("dd", null, renderValue(compliance.emailReleasedAt)))),
            compliance.latestFailureMessage ? (React.createElement("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" }, compliance.latestFailureMessage)) : null,
            compliance.manualReviewReason ? (React.createElement("div", { className: "rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm" }, compliance.manualReviewReason)) : null,
            React.createElement("div", null,
                React.createElement("h4", { className: "font-semibold mb-2" }, _('Attempt history')),
                React.createElement("div", { className: "space-y-2 text-sm" }, compliance.attempts.length === 0 ? (React.createElement("p", { className: "text-textSubdued" }, _('No ANAF attempts have been recorded yet.'))) : (compliance.attempts.slice(0, 5).map((attempt) => {
                    var _a, _b;
                    return (React.createElement("div", { key: attempt.orderAnafAttemptId, className: "rounded-lg border border-border px-3 py-2 flex items-center justify-between gap-3" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "font-medium" }, _(renderValue((_a = attempt.triggeredByLabel) !== null && _a !== void 0 ? _a : attempt.triggeredBy))),
                            React.createElement("div", { className: "text-textSubdued" }, renderValue(attempt.startedAt))),
                        React.createElement(Badge, { variant: "outline" }, _(renderValue((_b = attempt.statusLabel) !== null && _b !== void 0 ? _b : attempt.status)))));
                })))))));
}
export const layout = {
    areaId: 'rightSide',
    sortOrder: 30
};
export const query = `
  query Query {
    order(uuid: getContextValue("orderId")) {
      anafCompliance {
        status {
          code
          label
          badge
        }
        submissionMode
        environment
        registrationCode
        latestFailureMessage
        retryCount
        nextRetryAt
        approvedByAdminUserId
        approvedAt
        emailReleasedAt
        manualReviewReason
        attempts {
          orderAnafAttemptId
          triggeredBy
          triggeredByLabel
          status
          statusLabel
          startedAt
        }
      }
    }
  }
`;
//# sourceMappingURL=AnafComplianceSummary.js.map