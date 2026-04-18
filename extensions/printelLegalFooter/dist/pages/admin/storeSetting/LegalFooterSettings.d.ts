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
export default function LegalFooterSettings({ setting }: LegalFooterSettingsProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    setting {\n      companyLegalName\n      companyLegalForm\n      companyTaxId\n      companyTradeRegister\n      companyRegisteredOffice\n      companyContactEmail\n      companyContactPhone\n    }\n  }\n";
export {};
