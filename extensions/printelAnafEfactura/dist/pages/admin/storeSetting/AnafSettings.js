import { CheckboxField } from '@components/common/form/CheckboxField.js';
import { InputField } from '@components/common/form/InputField.js';
import { SelectField } from '@components/common/form/SelectField.js';
import { Button } from '@components/common/ui/Button.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
export default function AnafSettings({ setting }) {
    var _a, _b, _c, _d;
    const [checking, setChecking] = React.useState(false);
    const [disconnecting, setDisconnecting] = React.useState(false);
    const connectionState = setting === null || setting === void 0 ? void 0 : setting.anafConnectionState;
    const environmentLocked = Boolean(setting === null || setting === void 0 ? void 0 : setting.anafEnvironmentLocked);
    const environmentLabel = (setting === null || setting === void 0 ? void 0 : setting.anafEnvironment) === 'prod' ? _('Live / production') : _('Sandbox / test');
    async function startConnect() {
        var _a, _b;
        const response = await axios.post(setting.anafConnectStartApi);
        const redirectUrl = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.redirectUrl;
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }
    async function checkConnection() {
        var _a, _b, _c, _d, _e, _f, _g;
        setChecking(true);
        try {
            const response = await axios.post(setting.anafConnectionCheckApi);
            const message = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : _('Connection check finished');
            toast.success(message);
            window.location.reload();
        }
        catch (error) {
            toast.error((_g = (_f = (_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : _('Connection check failed'));
        }
        finally {
            setChecking(false);
        }
    }
    async function disconnect() {
        var _a, _b, _c, _d;
        setDisconnecting(true);
        try {
            await axios.post(setting.anafDisconnectApi);
            toast.success(_('ANAF connection disconnected'));
            window.location.reload();
        }
        catch (error) {
            toast.error((_d = (_c = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : _('Could not disconnect ANAF'));
        }
        finally {
            setDisconnecting(false);
        }
    }
    return (React.createElement("div", { className: "border-t border-border pt-5 mt-5 space-y-5" },
        React.createElement("div", { className: "space-y-1" },
            React.createElement("h3", { className: "text-lg font-semibold" }, _('ANAF e-Factura / SPV')),
            React.createElement("p", { className: "text-sm text-textSubdued" }, _('Configure the Romanian legal entity, choose sandbox or live mode, and decide whether ANAF submission runs automatically or waits for manual approval.'))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
            React.createElement(CheckboxField, { name: "anafEnabled", label: _('Enable ANAF-controlled order confirmation'), value: "true", checked: Boolean(setting === null || setting === void 0 ? void 0 : setting.anafEnabled) }),
            React.createElement(SelectField, { name: "anafEnvironment", label: _('ANAF environment'), defaultValue: (_a = setting === null || setting === void 0 ? void 0 : setting.anafEnvironment) !== null && _a !== void 0 ? _a : 'test', disabled: environmentLocked, options: [
                    { value: 'test', label: _('Sandbox / test') },
                    { value: 'prod', label: _('Live / production') }
                ] }),
            React.createElement(SelectField, { name: "anafSubmissionMode", label: _('Submission policy'), defaultValue: (_b = setting === null || setting === void 0 ? void 0 : setting.anafSubmissionMode) !== null && _b !== void 0 ? _b : 'automatic', options: [
                    { value: 'automatic', label: _('Automatic on order placement') },
                    { value: 'manual', label: _('Manual approval required') }
                ] }),
            React.createElement(InputField, { name: "companyTaxId", label: _('Company tax identifier'), placeholder: "RO12345678", defaultValue: (_c = setting === null || setting === void 0 ? void 0 : setting.anafCompanyTaxId) !== null && _c !== void 0 ? _c : '' })),
        React.createElement("div", { className: "rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-textSubdued space-y-2" },
            environmentLocked ? (React.createElement("p", null,
                _('This deployment locks ANAF to'),
                " ",
                React.createElement("strong", null, environmentLabel),
                ".",
                ' ',
                _('Switching between sandbox and live is disabled here and controlled by deployment config.'))) : (React.createElement("p", null, _('Use this screen to switch between sandbox/test and live ANAF for this store.'))),
            React.createElement("p", null,
                _('Connection status'),
                ": ",
                React.createElement("strong", null, (_d = connectionState === null || connectionState === void 0 ? void 0 : connectionState.label) !== null && _d !== void 0 ? _d : _('Disconnected'))),
            React.createElement("p", null, _('Use sandbox first. The Connect button opens the ANAF authorization flow, Connection check validates the stored token, and Disconnect removes the refresh token from the secure connection state table.')),
            React.createElement("p", null, _('ANAF SPV authentication requires the registered OAuth application plus the company certificate or token flow available to the authorized administrator using this screen.')),
            React.createElement("p", null, _('If authentication expires, queued orders will pause in blocked-authentication until an admin reconnects the profile.')),
            React.createElement("p", null, _('Reconnect after certificate renewal, token replacement, or redirect URI changes, then run Connection check to confirm the store can refresh the ANAF session successfully.')),
            (connectionState === null || connectionState === void 0 ? void 0 : connectionState.lastErrorMessage) ? (React.createElement("p", { className: "text-destructive" }, connectionState.lastErrorMessage)) : null),
        React.createElement("div", { className: "flex flex-wrap gap-3" },
            React.createElement(Button, { type: "button", variant: "default", onClick: () => void startConnect() }, _('Connect / reconnect')),
            React.createElement(Button, { type: "button", variant: "secondary", onClick: () => void checkConnection(), isLoading: checking }, _('Check connection')),
            React.createElement(Button, { type: "button", variant: "outline", onClick: () => void disconnect(), isLoading: disconnecting }, _('Disconnect')))));
}
export const layout = {
    areaId: 'storeInfoSetting',
    sortOrder: 50
};
export const query = `
  query Query {
    setting {
      anafEnabled
      anafEnvironment
      anafEnvironmentLocked
      anafSubmissionMode
      anafCompanyTaxId
      anafConnectionCheckApi
      anafConnectStartApi
      anafDisconnectApi
      anafConnectionState {
        connected
        environment
        label
        lastVerifiedAt
        lastErrorMessage
      }
    }
  }
`;
//# sourceMappingURL=AnafSettings.js.map