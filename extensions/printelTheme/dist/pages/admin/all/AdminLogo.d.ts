import React from 'react';
interface AdminLogoProps {
    dashboardUrl: string;
}
export default function AdminLogo({ dashboardUrl }: AdminLogoProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query query {\n    dashboardUrl: url(routeId:\"dashboard\")\n  }\n";
export {};
