import React from 'react';

interface AdminLogoProps {
  dashboardUrl: string;
}

export default function AdminLogo({ dashboardUrl }: AdminLogoProps) {
  return (
    <div className="printel-admin-logo logo flex items-center">
      <a href={dashboardUrl} aria-label="Printel admin panel">
        Printel Admin Panel
      </a>
    </div>
  );
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
