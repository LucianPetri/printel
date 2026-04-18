import { EmailField } from '@components/common/form/EmailField.js';
import { InputField } from '@components/common/form/InputField.js';
import { TelField } from '@components/common/form/TelField.js';
import { TextareaField } from '@components/common/form/TextareaField.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
export default function LegalFooterSettings({ setting }) {
    var _a, _b, _c, _d, _e, _f, _g;
    const companyLegalName = (_a = setting === null || setting === void 0 ? void 0 : setting.companyLegalName) !== null && _a !== void 0 ? _a : '';
    const companyLegalForm = (_b = setting === null || setting === void 0 ? void 0 : setting.companyLegalForm) !== null && _b !== void 0 ? _b : '';
    const companyTaxId = (_c = setting === null || setting === void 0 ? void 0 : setting.companyTaxId) !== null && _c !== void 0 ? _c : '';
    const companyTradeRegister = (_d = setting === null || setting === void 0 ? void 0 : setting.companyTradeRegister) !== null && _d !== void 0 ? _d : '';
    const companyRegisteredOffice = (_e = setting === null || setting === void 0 ? void 0 : setting.companyRegisteredOffice) !== null && _e !== void 0 ? _e : '';
    const companyContactEmail = (_f = setting === null || setting === void 0 ? void 0 : setting.companyContactEmail) !== null && _f !== void 0 ? _f : '';
    const companyContactPhone = (_g = setting === null || setting === void 0 ? void 0 : setting.companyContactPhone) !== null && _g !== void 0 ? _g : '';
    return (React.createElement("div", { className: "border-t border-border pt-5 mt-5 space-y-5" },
        React.createElement("div", { className: "space-y-1" },
            React.createElement("h3", { className: "text-lg font-semibold" }, _('Legal Footer Information')),
            React.createElement("p", { className: "text-sm text-textSubdued" }, _('Configure the company details and ANPC-ready footer content for the storefront.'))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
            React.createElement(InputField, { name: "companyLegalName", label: _('Legal Company Name'), placeholder: "SC Exemplu SRL", defaultValue: companyLegalName }),
            React.createElement(InputField, { name: "companyLegalForm", label: _('Legal Form'), placeholder: "SRL, SA, PFA", defaultValue: companyLegalForm }),
            React.createElement(InputField, { name: "companyTaxId", label: _('CUI / CIF'), placeholder: "RO12345678", defaultValue: companyTaxId }),
            React.createElement(InputField, { name: "companyTradeRegister", label: _('Trade Register Number'), placeholder: "J00/1234/2024", defaultValue: companyTradeRegister }),
            React.createElement(EmailField, { name: "companyContactEmail", label: _('Footer Contact Email'), placeholder: "contact@exemplu.ro", defaultValue: companyContactEmail }),
            React.createElement(TelField, { name: "companyContactPhone", label: _('Footer Contact Phone'), placeholder: "+40 700 000 000", defaultValue: companyContactPhone })),
        React.createElement(TextareaField, { name: "companyRegisteredOffice", label: _('Registered Office'), placeholder: "Str. Exemplu nr. 1, Bucuresti, Romania", defaultValue: companyRegisteredOffice, rows: 4 }),
        React.createElement("div", { className: "rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-textSubdued" }, _('ANPC complaint and SAL banners are displayed automatically in the storefront footer using official destinations.'))));
}
export const layout = {
    areaId: 'storeInfoSetting',
    sortOrder: 30
};
export const query = `
  query Query {
    setting {
      companyLegalName
      companyLegalForm
      companyTaxId
      companyTradeRegister
      companyRegisteredOffice
      companyContactEmail
      companyContactPhone
    }
  }
`;
//# sourceMappingURL=LegalFooterSettings.js.map