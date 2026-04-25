import React from 'react';
const adminLogoSrc = '/assets/branding/logo_only.svg';
export default function AdminLogo({ dashboardUrl }) {
    return (React.createElement("div", { className: "printel-admin-logo logo flex items-center" },
        React.createElement("a", { href: dashboardUrl, "aria-label": "Printel admin", style: { backgroundImage: `url(${adminLogoSrc})` } })));
}
export const layout = {
    areaId: 'header',
    sortOrder: 5
};
export const query = `
  query query {
    dashboardUrl: url(routeId:"dashboard")
  }
`;
//# sourceMappingURL=AdminLogo.js.map