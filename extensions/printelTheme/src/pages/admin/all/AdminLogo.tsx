import React from 'react';

const adminLogoSrc = '/assets/branding/logo_only.svg';

interface AdminLogoProps {
  dashboardUrl: string;
}

export default function AdminLogo({ dashboardUrl }: AdminLogoProps) {
  return (
    <div className="printel-admin-logo logo flex items-center">
      <a
        href={dashboardUrl}
        aria-label="Printel admin"
        style={{ backgroundImage: `url(${adminLogoSrc})` }}
      />
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