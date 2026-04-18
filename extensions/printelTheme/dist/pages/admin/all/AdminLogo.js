import React from 'react';
const logoSrc = '/assets/branding/printel-logo.jpeg';
export default function AdminLogo({ dashboardUrl }) {
    return /*#__PURE__*/ React.createElement("div", {
        className: "printel-admin-logo logo flex items-center"
    }, /*#__PURE__*/ React.createElement("a", {
        href: dashboardUrl,
        "aria-label": "Printel admin"
    }));
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
