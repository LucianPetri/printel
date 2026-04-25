import { NavigationItemGroup } from '@components/admin/NavigationItemGroup.js';
import { Settings } from 'lucide-react';
import React from 'react';

interface SettingsMenuProps {
  storeSetting: string;
}

export default function SettingsMenu({ storeSetting }: SettingsMenuProps) {
  return (
    <NavigationItemGroup
      id="printelSettingsMenuGroup"
      name="Setari"
      Icon={() => <Settings width={15} height={15} />}
      url={storeSetting}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 70
};

export const query = `
  query Query {
    storeSetting: url(routeId:"storeSetting")
  }
`;
