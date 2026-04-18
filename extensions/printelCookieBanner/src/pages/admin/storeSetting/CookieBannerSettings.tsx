import { InputField } from '@components/common/form/InputField.js';
import { TextareaField } from '@components/common/form/TextareaField.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

interface CookieBannerSettingsProps {
  setting?: {
    cookieBannerTitle?: string | null;
    cookieBannerMessage?: string | null;
    cookiePolicyUrl?: string | null;
    cookiePolicyLinkLabel?: string | null;
  };
}

export default function CookieBannerSettings({
  setting
}: CookieBannerSettingsProps) {
  const cookieBannerTitle = setting?.cookieBannerTitle ?? '';
  const cookieBannerMessage = setting?.cookieBannerMessage ?? '';
  const cookiePolicyUrl = setting?.cookiePolicyUrl ?? '';
  const cookiePolicyLinkLabel = setting?.cookiePolicyLinkLabel ?? '';

  return (
    <div className="border-t border-border pt-5 mt-5 space-y-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{_('Cookie Banner Settings')}</h3>
        <p className="text-sm text-textSubdued">
          {_('Configure the consent banner copy and cookie policy link shown to shoppers.')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          name="cookieBannerTitle"
          label={_('Banner Title')}
          placeholder={_('Your privacy, served with care.')}
          defaultValue={cookieBannerTitle}
        />
        <InputField
          name="cookiePolicyLinkLabel"
          label={_('Cookie Policy Link Label')}
          placeholder={_('Cookie Policy')}
          defaultValue={cookiePolicyLinkLabel}
        />
      </div>
      <TextareaField
        name="cookieBannerMessage"
        label={_('Banner Message')}
        placeholder={_('We use essential cookies to keep the store secure and functional. With your permission, we can also activate preferences, analytics, ad measurement, and personalized ads cookies.')}
        defaultValue={cookieBannerMessage}
        rows={4}
      />
      <InputField
        name="cookiePolicyUrl"
        label={_('Cookie Policy URL')}
        placeholder="/page/politica-cookie-uri"
        defaultValue={cookiePolicyUrl}
      />
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-textSubdued">
        {_('The storefront banner keeps essential cookies active and lets shoppers accept, reject, or customize non-essential cookies.')}
      </div>
    </div>
  );
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