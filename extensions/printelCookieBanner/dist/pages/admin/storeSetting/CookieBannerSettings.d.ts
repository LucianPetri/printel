import React from 'react';
interface CookieBannerSettingsProps {
    setting?: {
        cookieBannerTitle?: string | null;
        cookieBannerMessage?: string | null;
        cookiePolicyUrl?: string | null;
        cookiePolicyLinkLabel?: string | null;
    };
}
export default function CookieBannerSettings({ setting }: CookieBannerSettingsProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    setting {\n      cookieBannerTitle\n      cookieBannerMessage\n      cookiePolicyUrl\n      cookiePolicyLinkLabel\n    }\n  }\n";
export {};
