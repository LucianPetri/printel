import React from 'react';
export default function AdminLogo({ dashboardUrl }) {
    return (React.createElement("div", { className: "printel-admin-logo logo flex items-center" },
        React.createElement("a", { href: dashboardUrl, "aria-label": "Printel admin panel" }, "Printel Admin Panel")));
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