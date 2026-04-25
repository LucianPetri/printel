import React from 'react';
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
export default function LegalFooter({ setting }: LegalFooterProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    setting {\n      companyLegalName\n      companyLegalForm\n      companyTaxId\n      companyTradeRegister\n      companyRegisteredOffice\n      companyContactEmail\n      companyContactPhone\n    }\n  }\n";
export {};
