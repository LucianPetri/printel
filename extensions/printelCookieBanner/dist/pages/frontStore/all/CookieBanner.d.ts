import React from 'react';
interface CookieBannerProps {
    setting?: {
        cookieBannerTitle?: string | null;
        cookieBannerMessage?: string | null;
        cookiePolicyUrl?: string | null;
        cookiePolicyLinkLabel?: string | null;
    };
}
export default function CookieBanner({ setting }: CookieBannerProps): React.JSX.Element | null;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    setting {\n      cookieBannerTitle\n      cookieBannerMessage\n      cookiePolicyUrl\n      cookiePolicyLinkLabel\n    }\n  }\n";
export {};
