import { Button } from '@components/common/ui/Button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
export default function AnafComplianceActions({ approveApi, retryApi, order }) {
    var _a, _b, _c;
    const [loadingAction, setLoadingAction] = React.useState(null);
    const status = (_c = (_b = (_a = order === null || order === void 0 ? void 0 : order.anafCompliance) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.code) !== null && _c !== void 0 ? _c : null;
    if (!status) {
        return null;
    }
    async function runAction(action) {
        var _a, _b, _c, _d;
        setLoadingAction(action);
        try {
            await axios.post(action === 'approve' ? approveApi : retryApi, {});
            toast.success(action === 'approve'
                ? _('ANAF submission approved')
                : _('ANAF submission retry started'));
            window.location.reload();
        }
        catch (error) {
            toast.error((_d = (_c = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : _('ANAF action failed'));
        }
        finally {
            setLoadingAction(null);
        }
    }
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, _('ANAF recovery actions'))),
        React.createElement(CardContent, { className: "flex flex-wrap gap-3" },
            React.createElement(Button, { type: "button", variant: "default", disabled: status !== 'pending_approval', isLoading: loadingAction === 'approve', onClick: () => void runAction('approve') }, _('Approve for submission')),
            React.createElement(Button, { type: "button", variant: "secondary", disabled: !['queued', 'attention_required', 'blocked_auth'].includes(status), isLoading: loadingAction === 'retry', onClick: () => void runAction('retry') }, _('Retry now')))));
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
//# sourceMappingURL=AnafComplianceActions.js.map