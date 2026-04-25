import { NavigationItemGroup } from '@components/admin/NavigationItemGroup.js';
import { Settings } from 'lucide-react';
import React from 'react';
export default function SettingsMenu({ storeSetting }) {
    return (React.createElement(NavigationItemGroup, { id: "printelSettingsMenuGroup", name: "Setari", Icon: () => React.createElement(Settings, { width: 15, height: 15 }), url: storeSetting }));
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
//# sourceMappingURL=SettingsMenu.js.map