import { CheckboxField } from '@components/common/form/CheckboxField.js';
import { InputField } from '@components/common/form/InputField.js';
import { SelectField } from '@components/common/form/SelectField.js';
import { Button } from '@components/common/ui/Button.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
export default function AnafSettings({ setting }) {
    const [checking, setChecking] = React.useState(false);
    const [disconnecting, setDisconnecting] = React.useState(false);
    const connectionState = setting?.anafConnectionState;
    const environmentLocked = Boolean(setting?.anafEnvironmentLocked);
    const environmentLabel = setting?.anafEnvironment === 'prod' ? _('Live / production') : _('Sandbox / test');
    async function startConnect() {
        const response = await axios.post(setting.anafConnectStartApi);
        const redirectUrl = response.data?.data?.redirectUrl;
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }
    async function checkConnection() {
        setChecking(true);
        try {
            const response = await axios.post(setting.anafConnectionCheckApi);
            const message = response.data?.data?.message ?? _('Connection check finished');
            toast.success(message);
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.error?.message ?? _('Connection check failed'));
        } finally{
            setChecking(false);
        }
    }
    async function disconnect() {
        setDisconnecting(true);
        try {
            await axios.post(setting.anafDisconnectApi);
            toast.success(_('ANAF connection disconnected'));
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.error?.message ?? _('Could not disconnect ANAF'));
        } finally{
            setDisconnecting(false);
        }
    }
    return /*#__PURE__*/ React.createElement("div", {
        className: "border-t border-border pt-5 mt-5 space-y-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-1"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-semibold"
    }, _('ANAF e-Factura / SPV')), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-textSubdued"
    }, _('Configure the Romanian legal entity, choose sandbox or live mode, and decide whether ANAF submission runs automatically or waits for manual approval.'))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-5"
    }, /*#__PURE__*/ React.createElement(CheckboxField, {
        name: "anafEnabled",
        label: _('Enable ANAF-controlled order confirmation'),
        value: "true",
        defaultValue: Boolean(setting?.anafEnabled)
    }), /*#__PURE__*/ React.createElement(SelectField, {
        name: "anafEnvironment",
        label: _('ANAF environment'),
        defaultValue: setting?.anafEnvironment ?? 'test',
        disabled: environmentLocked,
        options: [
            {
                value: 'test',
                label: _('Sandbox / test')
            },
            {
                value: 'prod',
                label: _('Live / production')
            }
        ]
    }), /*#__PURE__*/ React.createElement(SelectField, {
        name: "anafSubmissionMode",
        label: _('Submission policy'),
        defaultValue: setting?.anafSubmissionMode ?? 'automatic',
        options: [
            {
                value: 'automatic',
                label: _('Automatic on order placement')
            },
            {
                value: 'manual',
                label: _('Manual approval required')
            }
        ]
    }), /*#__PURE__*/ React.createElement(InputField, {
        name: "companyTaxId",
        label: _('Company tax identifier'),
        placeholder: "RO12345678",
        defaultValue: setting?.anafCompanyTaxId ?? ''
    })), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-textSubdued space-y-2"
    }, environmentLocked ? /*#__PURE__*/ React.createElement("p", null, _('This deployment locks ANAF to'), " ", /*#__PURE__*/ React.createElement("strong", null, environmentLabel), ".", ' ', _('Switching between sandbox and live is disabled here and controlled by deployment config.')) : /*#__PURE__*/ React.createElement("p", null, _('Use this screen to switch between sandbox/test and live ANAF for this store.')), /*#__PURE__*/ React.createElement("p", null, _('Connection status'), ": ", /*#__PURE__*/ React.createElement("strong", null, connectionState?.label ?? _('Disconnected'))), /*#__PURE__*/ React.createElement("p", null, _('Use sandbox first. The Connect button opens the ANAF authorization flow, Connection check validates the stored token, and Disconnect removes the refresh token from the secure connection state table.')), /*#__PURE__*/ React.createElement("p", null, _('ANAF SPV authentication requires the registered OAuth application plus the company certificate or token flow available to the authorized administrator using this screen.')), /*#__PURE__*/ React.createElement("p", null, _('If authentication expires, queued orders will pause in blocked-authentication until an admin reconnects the profile.')), /*#__PURE__*/ React.createElement("p", null, _('Reconnect after certificate renewal, token replacement, or redirect URI changes, then run Connection check to confirm the store can refresh the ANAF session successfully.')), connectionState?.lastErrorMessage ? /*#__PURE__*/ React.createElement("p", {
        className: "text-destructive"
    }, connectionState.lastErrorMessage) : null), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-3"
    }, /*#__PURE__*/ React.createElement(Button, {
        type: "button",
        variant: "default",
        onClick: ()=>void startConnect()
    }, _('Connect / reconnect')), /*#__PURE__*/ React.createElement(Button, {
        type: "button",
        variant: "secondary",
        onClick: ()=>void checkConnection(),
        isLoading: checking
    }, _('Check connection')), /*#__PURE__*/ React.createElement(Button, {
        type: "button",
        variant: "outline",
        onClick: ()=>void disconnect(),
        isLoading: disconnecting
    }, _('Disconnect'))));
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
