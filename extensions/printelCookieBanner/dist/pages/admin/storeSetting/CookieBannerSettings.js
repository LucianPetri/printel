import { InputField } from '@components/common/form/InputField.js';
import { TextareaField } from '@components/common/form/TextareaField.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
export default function CookieBannerSettings({ setting }) {
    var _a, _b, _c, _d;
    const cookieBannerTitle = (_a = setting === null || setting === void 0 ? void 0 : setting.cookieBannerTitle) !== null && _a !== void 0 ? _a : '';
    const cookieBannerMessage = (_b = setting === null || setting === void 0 ? void 0 : setting.cookieBannerMessage) !== null && _b !== void 0 ? _b : '';
    const cookiePolicyUrl = (_c = setting === null || setting === void 0 ? void 0 : setting.cookiePolicyUrl) !== null && _c !== void 0 ? _c : '';
    const cookiePolicyLinkLabel = (_d = setting === null || setting === void 0 ? void 0 : setting.cookiePolicyLinkLabel) !== null && _d !== void 0 ? _d : '';
    return (React.createElement("div", { className: "border-t border-border pt-5 mt-5 space-y-5" },
        React.createElement("div", { className: "space-y-1" },
            React.createElement("h3", { className: "text-lg font-semibold" }, _('Cookie Banner Settings')),
            React.createElement("p", { className: "text-sm text-textSubdued" }, _('Configure the consent banner copy and cookie policy link shown to shoppers.'))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
            React.createElement(InputField, { name: "cookieBannerTitle", label: _('Banner Title'), placeholder: _('Your privacy, served with care.'), defaultValue: cookieBannerTitle }),
            React.createElement(InputField, { name: "cookiePolicyLinkLabel", label: _('Cookie Policy Link Label'), placeholder: _('Cookie Policy'), defaultValue: cookiePolicyLinkLabel })),
        React.createElement(TextareaField, { name: "cookieBannerMessage", label: _('Banner Message'), placeholder: _('We use essential cookies to keep the store secure and functional. With your permission, we can also activate preferences, analytics, ad measurement, and personalized ads cookies.'), defaultValue: cookieBannerMessage, rows: 4 }),
        React.createElement(InputField, { name: "cookiePolicyUrl", label: _('Cookie Policy URL'), placeholder: "/page/politica-cookie-uri", defaultValue: cookiePolicyUrl }),
        React.createElement("div", { className: "rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-textSubdued" }, _('The storefront banner keeps essential cookies active and lets shoppers accept, reject, or customize non-essential cookies.'))));
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
//# sourceMappingURL=CookieBannerSettings.js.map