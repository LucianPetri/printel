import { Badge } from '@components/common/ui/Badge.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

interface Props {
  order: {
    anafCompliance?: {
      status: {
        code: string;
        label: string;
        badge: string;
      };
      submissionMode: string;
      environment: string;
      registrationCode?: string | null;
      latestFailureMessage?: string | null;
      retryCount: number;
      nextRetryAt?: { text?: string; value?: string } | string | null;
      approvedByAdminUserId?: number | null;
      approvedAt?: string | null;
      emailReleasedAt?: string | null;
      manualReviewReason?: string | null;
      attempts: Array<{
        orderAnafAttemptId: number;
        triggeredBy: string;
        triggeredByLabel?: string;
        status: string;
        statusLabel?: string;
        startedAt: string;
      }>;
    } | null;
  };
}

function renderValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  return String(value);
}

export default function AnafComplianceSummary({ order }: Props) {
  if (!order?.anafCompliance) {
    return null;
  }

  const compliance = order.anafCompliance;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{_('ANAF compliance')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant={compliance.status.badge as any}>{_(compliance.status.label)}</Badge>
          <span className="text-sm text-textSubdued">
            {`${_(compliance.environment === 'prod' ? 'Live / production' : 'Sandbox / test')} · ${_(
              compliance.submissionMode === 'manual'
                ? 'Manual approval required'
                : 'Automatic on order placement'
            )}`}
          </span>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="font-semibold">{_('Registration code')}</dt>
            <dd>{renderValue(compliance.registrationCode)}</dd>
          </div>
          <div>
            <dt className="font-semibold">{_('Retry count')}</dt>
            <dd>{renderValue(compliance.retryCount)}</dd>
          </div>
          <div>
            <dt className="font-semibold">{_('Next retry')}</dt>
            <dd>{renderValue((compliance.nextRetryAt as any)?.text ?? compliance.nextRetryAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold">{_('Email released')}</dt>
            <dd>{renderValue(compliance.emailReleasedAt)}</dd>
          </div>
        </dl>

        {compliance.latestFailureMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {compliance.latestFailureMessage}
          </div>
        ) : null}

        {compliance.manualReviewReason ? (
          <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm">
            {compliance.manualReviewReason}
          </div>
        ) : null}

        <div>
          <h4 className="font-semibold mb-2">{_('Attempt history')}</h4>
          <div className="space-y-2 text-sm">
            {compliance.attempts.length === 0 ? (
              <p className="text-textSubdued">{_('No ANAF attempts have been recorded yet.')}</p>
            ) : (
              compliance.attempts.slice(0, 5).map((attempt) => (
                <div
                  key={attempt.orderAnafAttemptId}
                  className="rounded-lg border border-border px-3 py-2 flex items-center justify-between gap-3"
                  >
                  <div>
                    <div className="font-medium">
                      {_(renderValue(attempt.triggeredByLabel ?? attempt.triggeredBy))}
                    </div>
                    <div className="text-textSubdued">{renderValue(attempt.startedAt)}</div>
                  </div>
                  <Badge variant="outline">
                    {_(renderValue(attempt.statusLabel ?? attempt.status))}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
