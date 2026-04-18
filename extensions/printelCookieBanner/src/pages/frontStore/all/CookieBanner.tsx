import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'printel_cookie_consent_v1';

type ConsentStatus =
  | 'accepted_all'
  | 'rejected_non_essential'
  | 'customized';

type ConsentCategoryKey =
  | 'preferences'
  | 'analytics'
  | 'adMeasurement'
  | 'personalizedAds';

type ConsentCategories = {
  essential: true;
  preferences: boolean;
  analytics: boolean;
  adMeasurement: boolean;
  personalizedAds: boolean;
};

type ConsentRecord = {
  version: 2;
  status: ConsentStatus;
  categories: ConsentCategories;
  updatedAt: string;
};

type LegacyConsentRecord = {
  version: 1;
  status: ConsentStatus;
  categories: {
    essential: true;
    preferences: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  updatedAt?: string;
};

interface CookieBannerProps {
  setting?: {
    cookieBannerTitle?: string | null;
    cookieBannerMessage?: string | null;
    cookiePolicyUrl?: string | null;
    cookiePolicyLinkLabel?: string | null;
  };
}

const defaultCategories: ConsentCategories = {
  essential: true,
  preferences: false,
  analytics: false,
  adMeasurement: false,
  personalizedAds: false
};

const optionalCategories: Array<{
  key: ConsentCategoryKey;
  title: string;
  description: string;
}> = [
  {
    key: 'preferences',
    title: 'Cookie-uri de preferințe',
    description: 'Memorează limba, regiunea și alte alegeri de cumpărare.'
  },
  {
    key: 'analytics',
    title: 'Cookie-uri de analiză',
    description:
      'Ne ajută să înțelegem vizitele, traseele de navigare și performanța magazinului pentru a îmbunătăți experiența de cumpărare.'
  },
  {
    key: 'adMeasurement',
    title: 'Cookie-uri de publicitate și măsurare',
    description:
      'Ne ajută să măsurăm performanța campaniilor, să limităm frecvența reclamelor, să detectăm traficul invalid și să înțelegem ce reclame aduc vizite sau vânzări.'
  },
  {
    key: 'personalizedAds',
    title: 'Cookie-uri pentru reclame personalizate',
    description:
      'Permit partenerilor publicitari, precum Google, să personalizeze reclamele și să afișeze promoții mai relevante, doar dacă îți dai acordul.'
  }
];

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isConsentStatus(value: unknown): value is ConsentStatus {
  return (
    value === 'accepted_all' ||
    value === 'rejected_non_essential' ||
    value === 'customized'
  );
}

function isVersionTwoConsentRecord(value: unknown): value is ConsentRecord {
  if (!isObjectRecord(value) || value.version !== 2 || !isConsentStatus(value.status)) {
    return false;
  }

  const categories = value.categories;
  return (
    isObjectRecord(categories) &&
    categories.essential === true &&
    typeof categories.preferences === 'boolean' &&
    typeof categories.analytics === 'boolean' &&
    typeof categories.adMeasurement === 'boolean' &&
    typeof categories.personalizedAds === 'boolean'
  );
}

function isLegacyConsentRecord(value: unknown): value is LegacyConsentRecord {
  if (!isObjectRecord(value) || value.version !== 1 || !isConsentStatus(value.status)) {
    return false;
  }

  const categories = value.categories;
  return (
    isObjectRecord(categories) &&
    categories.essential === true &&
    typeof categories.preferences === 'boolean' &&
    typeof categories.analytics === 'boolean' &&
    typeof categories.marketing === 'boolean'
  );
}

function readStoredConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as unknown;
    if (isVersionTwoConsentRecord(parsed)) {
      return {
        version: 2,
        status: parsed.status,
        categories: {
          essential: true,
          preferences: parsed.categories.preferences,
          analytics: parsed.categories.analytics,
          adMeasurement: parsed.categories.adMeasurement,
          personalizedAds: parsed.categories.personalizedAds
        },
        updatedAt:
          typeof parsed.updatedAt === 'string'
            ? parsed.updatedAt
            : new Date().toISOString()
      };
    }

    if (isLegacyConsentRecord(parsed)) {
      return {
        version: 2,
        status: parsed.status,
        categories: {
          essential: true,
          preferences: parsed.categories.preferences,
          analytics: parsed.categories.analytics,
          adMeasurement: parsed.categories.marketing,
          personalizedAds: parsed.categories.marketing
        },
        updatedAt:
          typeof parsed.updatedAt === 'string'
            ? parsed.updatedAt
            : new Date().toISOString()
      };
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return null;
}

function persistConsent(consent: ConsentRecord) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent('printel:cookie-consent-updated', {
      detail: consent
    })
  );
}

function buildConsentRecord(
  status: ConsentStatus,
  categories: ConsentCategories
): ConsentRecord {
  return {
    version: 2,
    status,
    categories,
    updatedAt: new Date().toISOString()
  };
}

function PreferenceToggle({
  checked,
  disabled = false,
  testId,
  onChange
}: {
  checked: boolean;
  disabled?: boolean;
  testId?: string;
  onChange?: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onChange}
      className={[
        'relative inline-flex h-7 w-12 items-center rounded-full border transition',
        disabled
          ? 'cursor-not-allowed border-white/15 bg-white/10 opacity-80'
          : checked
            ? 'border-amber-300/70 bg-amber-300/90'
            : 'border-white/20 bg-white/10 hover:border-white/35'
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-5 w-5 rounded-full bg-slate-950 shadow-sm transition',
          checked ? 'translate-x-6' : 'translate-x-1'
        ].join(' ')}
      />
    </button>
  );
}

export default function CookieBanner({ setting = {} }: CookieBannerProps) {
  const [mounted, setMounted] = useState(false);
  const [storedConsent, setStoredConsent] = useState<ConsentRecord | null>(null);
  const [draftCategories, setDraftCategories] =
    useState<ConsentCategories>(defaultCategories);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showManagePanel, setShowManagePanel] = useState(false);
  const [showSavedNotice, setShowSavedNotice] = useState(false);

  const title =
    setting.cookieBannerTitle?.trim() || _('Your privacy, served with care.');
  const message =
    setting.cookieBannerMessage?.trim() ||
    _('We use essential cookies to keep the store secure and functional. With your permission, we can also activate preferences, analytics, ad measurement, and personalized ads cookies.');
  const policyUrl = setting.cookiePolicyUrl?.trim() || '/page/politica-cookie-uri';
  const policyLabel =
    setting.cookiePolicyLinkLabel?.trim() || _('Cookie Policy');

  useEffect(() => {
    const consent = readStoredConsent();
    setStoredConsent(consent);
    setDraftCategories(consent?.categories ?? defaultCategories);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showSavedNotice) {
      return undefined;
    }

    const timer = window.setTimeout(() => setShowSavedNotice(false), 2400);
    return () => window.clearTimeout(timer);
  }, [showSavedNotice]);

  if (!mounted) {
    return null;
  }

  const isPrompting = storedConsent === null;
  const isExpanded = isPrompting ? showPreferences : showManagePanel;

  function updateDraftCategory(key: ConsentCategoryKey) {
    setDraftCategories((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }

  function applyConsent(status: ConsentStatus, categories: ConsentCategories) {
    const nextConsent = buildConsentRecord(status, {
      essential: true,
      preferences: categories.preferences,
      analytics: categories.analytics,
      adMeasurement: categories.adMeasurement,
      personalizedAds: categories.personalizedAds
    });

    persistConsent(nextConsent);
    setStoredConsent(nextConsent);
    setDraftCategories(nextConsent.categories);
    setShowPreferences(false);
    setShowManagePanel(false);
    setShowSavedNotice(true);
  }

  function acceptAllCookies() {
    applyConsent('accepted_all', {
      essential: true,
      preferences: true,
      analytics: true,
      adMeasurement: true,
      personalizedAds: true
    });
  }

  function rejectNonEssentialCookies() {
    applyConsent('rejected_non_essential', defaultCategories);
  }

  function saveCustomPreferences() {
    applyConsent('customized', draftCategories);
  }

  return (
    <>
      {showSavedNotice ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-36 z-[60] flex justify-center px-4">
          <div className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-800 shadow-lg backdrop-blur-sm">
            {_('Selected preferences saved.')}
          </div>
        </div>
      ) : null}

      {!isPrompting && !showManagePanel ? (
        <div className="fixed bottom-4 left-4 z-50 sm:left-6 lg:left-10">
          <button
            type="button"
            data-testid="manage-cookies-button"
            onClick={() => setShowManagePanel(true)}
            className="group inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg backdrop-blur-sm transition hover:border-slate-400"
          >
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {_('Manage cookies')}
          </button>
        </div>
      ) : null}

      {(isPrompting || showManagePanel) ? (
        <section
          aria-label={_('Cookie preferences')}
          data-testid="cookie-banner"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 lg:px-10"
        >
          <div className="pointer-events-auto mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-stone-900 text-white shadow-[0_-18px_60px_rgba(15,23,42,0.45)]">
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-amber-300/15 blur-3xl" />
              <div className="pointer-events-none absolute left-12 top-10 h-24 w-24 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative grid gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:px-8 lg:py-7">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-100">
                      {_('Privacy choices')}
                    </span>
                    <div className="space-y-2">
                      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                        {title}
                      </h2>
                      <p className="max-w-2xl text-sm leading-6 text-slate-200 sm:text-[15px]">
                        {message}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                      {policyUrl ? (
                        <a
                          href={policyUrl}
                          className="font-semibold text-amber-200 underline decoration-amber-200/40 underline-offset-4 transition hover:text-amber-100"
                        >
                          {policyLabel}
                        </a>
                      ) : null}
                      <span className="rounded-full border border-white/10 bg-white/7 px-3 py-1 text-xs font-medium text-slate-200">
                        {_('No non-essential cookies will be set unless you choose them.')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      data-testid="accept-all-cookies"
                      onClick={acceptAllCookies}
                      className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                    >
                      {_('Accept all cookies')}
                    </button>
                    <button
                      type="button"
                      data-testid="reject-non-essential-cookies"
                      onClick={rejectNonEssentialCookies}
                      className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/12"
                    >
                      {_('Reject non-essential')}
                    </button>
                    <button
                      type="button"
                      data-testid="customize-cookies"
                      onClick={() =>
                        isPrompting
                          ? setShowPreferences((current) => !current)
                          : setShowManagePanel((current) => !current)
                      }
                      className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-3 text-sm font-semibold text-slate-200 transition hover:text-white"
                    >
                      {isExpanded ? _('Hide customization') : _('Customize')}
                    </button>
                    {!isPrompting ? (
                      <button
                        type="button"
                        onClick={() => setShowManagePanel(false)}
                        className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-3 text-sm font-semibold text-slate-400 transition hover:text-slate-200"
                      >
                        {_('Close')}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm">
                  {isExpanded ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                          {_('Cookie preferences')}
                        </p>
                        <p className="text-sm leading-6 text-slate-200">
                          {_('Choose which optional cookies can help us improve Printel. Essential cookies stay on because the store cannot function without them.')}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4 rounded-3xl border border-white/12 bg-white/6 px-4 py-4 backdrop-blur-sm">
                          <div className="space-y-2 pr-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-white">
                                {_('Essential cookies')}
                              </p>
                              <span className="rounded-full border border-white/12 bg-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                                {_('Always active')}
                              </span>
                            </div>
                            <p className="text-sm leading-6 text-slate-300">
                              {_('Needed for cart, checkout, security, and your consent selection.')}
                            </p>
                          </div>
                          <PreferenceToggle checked disabled testId="toggle-essential-cookies" />
                        </div>
                        {optionalCategories.map((category) => (
                          <div
                            key={category.key}
                            className="flex items-start justify-between gap-4 rounded-3xl border border-white/12 bg-white/6 px-4 py-4 backdrop-blur-sm"
                          >
                            <div className="space-y-2 pr-2">
                              <p className="text-sm font-semibold text-white">
                                {category.title}
                              </p>
                              <p className="text-sm leading-6 text-slate-300">
                                {category.description}
                              </p>
                            </div>
                            <PreferenceToggle
                              checked={draftCategories[category.key]}
                              testId={`toggle-${category.key}-cookies`}
                              onChange={() => updateDraftCategory(category.key)}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        data-testid="save-cookie-preferences"
                        onClick={saveCustomPreferences}
                        className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                      >
                        {_('Save preferences')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                        {_('What stays on')}
                      </p>
                      <div className="space-y-3">
                        <div className="rounded-3xl border border-white/10 bg-black/10 px-4 py-4">
                          <p className="text-sm font-semibold text-white">
                            {_('Essential cookies')}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {_('Needed for cart, checkout, security, and your consent selection.')}
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                            <p className="text-sm font-semibold text-white">
                              {_('Reject is as easy as accept')}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {_('You can refuse optional cookies immediately without losing access to the shop.')}
                            </p>
                          </div>
                          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                            <p className="text-sm font-semibold text-white">
                              {_('Change your mind anytime')}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {_('Use the manage cookies button later to review or update your preferences.')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export const layout = {
  areaId: 'footerTop',
  sortOrder: 5
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