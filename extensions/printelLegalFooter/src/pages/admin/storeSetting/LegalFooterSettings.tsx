import { EmailField } from '@components/common/form/EmailField.js';
import { InputField } from '@components/common/form/InputField.js';
import { TelField } from '@components/common/form/TelField.js';
import { TextareaField } from '@components/common/form/TextareaField.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

interface LegalFooterSettingsProps {
  setting?: {
    companyLegalName?: string | null;
    companyLegalForm?: string | null;
    companyTaxId?: string | null;
    companyTradeRegister?: string | null;
    companyRegisteredOffice?: string | null;
    companyContactEmail?: string | null;
    companyContactPhone?: string | null;
  };
}

export default function LegalFooterSettings({
  setting
}: LegalFooterSettingsProps) {
  const companyLegalName = setting?.companyLegalName ?? '';
  const companyLegalForm = setting?.companyLegalForm ?? '';
  const companyTaxId = setting?.companyTaxId ?? '';
  const companyTradeRegister = setting?.companyTradeRegister ?? '';
  const companyRegisteredOffice = setting?.companyRegisteredOffice ?? '';
  const companyContactEmail = setting?.companyContactEmail ?? '';
  const companyContactPhone = setting?.companyContactPhone ?? '';

  return (
    <div className="border-t border-border pt-5 mt-5 space-y-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{_('Legal Footer Information')}</h3>
        <p className="text-sm text-textSubdued">
          {_('Configure the company details and ANPC-ready footer content for the storefront.')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          name="companyLegalName"
          label={_('Legal Company Name')}
          placeholder="SC Exemplu SRL"
          defaultValue={companyLegalName}
        />
        <InputField
          name="companyLegalForm"
          label={_('Legal Form')}
          placeholder="SRL, SA, PFA"
          defaultValue={companyLegalForm}
        />
        <InputField
          name="companyTaxId"
          label={_('CUI / CIF')}
          placeholder="RO12345678"
          defaultValue={companyTaxId}
        />
        <InputField
          name="companyTradeRegister"
          label={_('Trade Register Number')}
          placeholder="J00/1234/2024"
          defaultValue={companyTradeRegister}
        />
        <EmailField
          name="companyContactEmail"
          label={_('Footer Contact Email')}
          placeholder="contact@exemplu.ro"
          defaultValue={companyContactEmail}
        />
        <TelField
          name="companyContactPhone"
          label={_('Footer Contact Phone')}
          placeholder="+40 700 000 000"
          defaultValue={companyContactPhone}
        />
      </div>
      <TextareaField
        name="companyRegisteredOffice"
        label={_('Registered Office')}
        placeholder="Str. Exemplu nr. 1, Bucuresti, Romania"
        defaultValue={companyRegisteredOffice}
        rows={4}
      />
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-textSubdued">
        {_('ANPC complaint and SAL banners are displayed automatically in the storefront footer using official destinations.')}
      </div>
    </div>
  );
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