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
    if (!order?.anafCompliance) {
        return null;
    }
    const compliance = order.anafCompliance;
    return /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, _('ANAF compliance'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement(Badge, {
        variant: compliance.status.badge
    }, _(compliance.status.label)), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm text-textSubdued"
    }, `${_(compliance.environment === 'prod' ? 'Live / production' : 'Sandbox / test')} · ${_(compliance.submissionMode === 'manual' ? 'Manual approval required' : 'Automatic on order placement')}`)), /*#__PURE__*/ React.createElement("dl", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("dt", {
        className: "font-semibold"
    }, _('Registration code')), /*#__PURE__*/ React.createElement("dd", null, renderValue(compliance.registrationCode))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("dt", {
        className: "font-semibold"
    }, _('Retry count')), /*#__PURE__*/ React.createElement("dd", null, renderValue(compliance.retryCount))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("dt", {
        className: "font-semibold"
    }, _('Next retry')), /*#__PURE__*/ React.createElement("dd", null, renderValue(compliance.nextRetryAt?.text ?? compliance.nextRetryAt))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("dt", {
        className: "font-semibold"
    }, _('Email released')), /*#__PURE__*/ React.createElement("dd", null, renderValue(compliance.emailReleasedAt)))), compliance.latestFailureMessage ? /*#__PURE__*/ React.createElement("div", {
        className: "rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    }, compliance.latestFailureMessage) : null, compliance.manualReviewReason ? /*#__PURE__*/ React.createElement("div", {
        className: "rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm"
    }, compliance.manualReviewReason) : null, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-semibold mb-2"
    }, _('Attempt history')), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2 text-sm"
    }, compliance.attempts.length === 0 ? /*#__PURE__*/ React.createElement("p", {
        className: "text-textSubdued"
    }, _('No ANAF attempts have been recorded yet.')) : compliance.attempts.slice(0, 5).map((attempt)=>/*#__PURE__*/ React.createElement("div", {
            key: attempt.orderAnafAttemptId,
            className: "rounded-lg border border-border px-3 py-2 flex items-center justify-between gap-3"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "font-medium"
        }, _(renderValue(attempt.triggeredByLabel ?? attempt.triggeredBy))), /*#__PURE__*/ React.createElement("div", {
            className: "text-textSubdued"
        }, renderValue(attempt.startedAt))), /*#__PURE__*/ React.createElement(Badge, {
            variant: "outline"
        }, _(renderValue(attempt.statusLabel ?? attempt.status)))))))));
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
