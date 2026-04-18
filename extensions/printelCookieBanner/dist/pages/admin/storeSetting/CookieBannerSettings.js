import { InputField } from '@components/common/form/InputField.js';
import { TextareaField } from '@components/common/form/TextareaField.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
export default function CookieBannerSettings({ setting }) {
    const cookieBannerTitle = setting?.cookieBannerTitle ?? '';
    const cookieBannerMessage = setting?.cookieBannerMessage ?? '';
    const cookiePolicyUrl = setting?.cookiePolicyUrl ?? '';
    const cookiePolicyLinkLabel = setting?.cookiePolicyLinkLabel ?? '';
    return /*#__PURE__*/ React.createElement("div", {
        className: "border-t border-border pt-5 mt-5 space-y-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-1"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-semibold"
    }, _('Cookie Banner Settings')), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-textSubdued"
    }, _('Configure the consent banner copy and cookie policy link shown to shoppers.'))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-5"
    }, /*#__PURE__*/ React.createElement(InputField, {
        name: "cookieBannerTitle",
        label: _('Banner Title'),
        placeholder: _('Your privacy, served with care.'),
        defaultValue: cookieBannerTitle
    }), /*#__PURE__*/ React.createElement(InputField, {
        name: "cookiePolicyLinkLabel",
        label: _('Cookie Policy Link Label'),
        placeholder: _('Cookie Policy'),
        defaultValue: cookiePolicyLinkLabel
    })), /*#__PURE__*/ React.createElement(TextareaField, {
        name: "cookieBannerMessage",
        label: _('Banner Message'),
        placeholder: _('We use essential cookies to keep the store secure and functional. With your permission, we can also activate preferences, analytics, ad measurement, and personalized ads cookies.'),
        defaultValue: cookieBannerMessage,
        rows: 4
    }), /*#__PURE__*/ React.createElement(InputField, {
        name: "cookiePolicyUrl",
        label: _('Cookie Policy URL'),
        placeholder: "/page/politica-cookie-uri",
        defaultValue: cookiePolicyUrl
    }), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-textSubdued"
    }, _('The storefront banner keeps essential cookies active and lets shoppers accept, reject, or customize non-essential cookies.')));
}
export const layout = {
    areaId: 'storeInfoSetting',
    sortOrder: 40
};
export const query = `
  query Query {
    setting {
      cookieBannerTitle
      cookieBannerMessage
      cookiePolicyUrl
      cookiePolicyLinkLabel
    }
  }
`;
