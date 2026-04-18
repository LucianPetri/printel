import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

const anpcComplaintUrl = 'https://eservicii.anpc.ro/';
const anpcSalUrl = 'https://reclamatiisal.anpc.ro/';
const anpcLogoUrl =
  'https://anpc.ro/wp-content/uploads/brizy/imgs/B_EUsuntANPC-alb.png-1-282x52x2x0x280x52x1701199166.webp';

interface FooterSetting {
  companyLegalName?: string | null;
  companyLegalForm?: string | null;
  companyTaxId?: string | null;
  companyTradeRegister?: string | null;
  companyRegisteredOffice?: string | null;
  companyContactEmail?: string | null;
  companyContactPhone?: string | null;
}

interface LegalFooterProps {
  setting?: FooterSetting;
}

function Banner({
  href,
  title,
  description,
  testId
}: {
  href: string;
  title: string;
  description: string;
  testId: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-testid={testId}
      className="group flex items-start gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2.5 shadow-sm transition-colors hover:border-slate-400 xl:flex-1"
    >
      <div className="flex h-10 w-18 shrink-0 items-center justify-center rounded-md bg-slate-900 px-2">
        <img
          src={anpcLogoUrl}
          alt={title}
          className="max-h-7 w-auto object-contain"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          ANPC
        </p>
        <p className="text-sm font-semibold leading-4 text-slate-900">{title}</p>
        <p className="text-xs leading-4 text-slate-600">{description}</p>
      </div>
    </a>
  );
}

export default function LegalFooter({ setting = {} }: LegalFooterProps) {
  const rows = [
    {
      label: _('Legal Company Name'),
      value: setting.companyLegalName
    },
    {
      label: _('Legal Form'),
      value: setting.companyLegalForm
    },
    {
      label: _('CUI / CIF'),
      value: setting.companyTaxId
    },
    {
      label: _('Trade Register Number'),
      value: setting.companyTradeRegister
    },
    {
      label: _('Registered Office'),
      value: setting.companyRegisteredOffice
    },
    {
      label: _('Contact Email'),
      value: setting.companyContactEmail
    },
    {
      label: _('Contact Phone'),
      value: setting.companyContactPhone
    }
  ].filter((row) => row.value);

  return (
    <section
      className="page-width py-3"
      aria-label={_('Romanian legal footer information')}
      data-testid="legal-footer"
    >
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[2.2fr_1fr] xl:items-stretch">
        <div className="rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm">
          <div className="mb-2 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {_('Company Information')}
            </p>
            <h2 className="text-base font-semibold leading-5 text-slate-950 md:text-lg">
              {_('Legal information for Romanian consumers')}
            </h2>
          </div>
          {rows.length > 0 ? (
            <dl className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg bg-slate-50 px-3 py-2 leading-none"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {row.label}
                  </dt>
                  <dd className="mt-1 whitespace-pre-line text-sm leading-4.5 text-slate-800">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm leading-5 text-slate-600">
              {_('Complete the legal footer fields from the admin store settings to publish company information here.')}
            </p>
          )}
        </div>
        <div className="space-y-2 xl:flex xl:h-full xl:flex-col xl:space-y-0 xl:gap-2">
          <Banner
            href={anpcComplaintUrl}
            title={_('ANPC Complaints')}
            description={_('Direct consumers to the official ANPC electronic complaint portal.')}
            testId="anpc-complaints-banner"
          />
          <Banner
            href={anpcSalUrl}
            title={_('ANPC SAL')}
            description={_('Alternative dispute resolution for consumer disputes handled through ANPC.')}
            testId="anpc-sal-banner"
          />
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'footerTop',
  sortOrder: 10
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