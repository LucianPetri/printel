import { Button } from '@components/common/ui/Button.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';

interface Props {
  approveApi: string;
  retryApi: string;
  order: {
    anafCompliance?: {
      status: {
        code: string;
      };
    } | null;
  };
}

export default function AnafComplianceActions({ approveApi, retryApi, order }: Props) {
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);
  const status = order?.anafCompliance?.status?.code ?? null;

  if (!status) {
    return null;
  }

  async function runAction(action: 'approve' | 'retry') {
    setLoadingAction(action);
    try {
      await axios.post(action === 'approve' ? approveApi : retryApi, {});
      toast.success(
        action === 'approve'
          ? _('ANAF submission approved')
          : _('ANAF submission retry started')
      );
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message ?? _('ANAF action failed'));
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{_('ANAF recovery actions')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="default"
          disabled={status !== 'pending_approval'}
          isLoading={loadingAction === 'approve'}
          onClick={() => void runAction('approve')}
        >
          {_('Approve for submission')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!['queued', 'attention_required', 'blocked_auth'].includes(status)}
          isLoading={loadingAction === 'retry'}
          onClick={() => void runAction('retry')}
        >
          {_('Retry now')}
        </Button>
      </CardContent>
    </Card>
  );
}

export const layout = {
  areaId: 'rightSide',
  sortOrder: 35
};

export const query = `
  query Query {
    approveApi: url(routeId: "approveAnafSubmission", params: [{key: "uuid", value: getContextValue("orderId")}])
    retryApi: url(routeId: "retryAnafSubmission", params: [{key: "uuid", value: getContextValue("orderId")}])
    order(uuid: getContextValue("orderId")) {
      anafCompliance {
        status {
          code
        }
      }
    }
  }
`;
