import React from 'react';
interface SettingsMenuProps {
    storeSetting: string;
}
export default function SettingsMenu({ storeSetting }: SettingsMenuProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    storeSetting: url(routeId:\"storeSetting\")\n  }\n";
export {};
