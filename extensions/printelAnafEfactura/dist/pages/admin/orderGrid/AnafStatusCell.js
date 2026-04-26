import { Badge } from '@components/common/ui/Badge.js';
import { TableCell } from '@components/common/ui/Table.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
export default function AnafStatusCell({ row }) {
    const compliance = row === null || row === void 0 ? void 0 : row.anafCompliance;
    if (!compliance) {
        return React.createElement(TableCell, null, "\u2014");
    }
    return (React.createElement(TableCell, null,
        React.createElement(Badge, { variant: compliance.status.badge }, _(compliance.status.label))));
}
export const layout = {
    areaId: 'orderGridRow',
    sortOrder: 27
};
export const query = `
  query Query($filters: [FilterInput]) {
    orders(filters: $filters) {
      items {
        uuid
        anafCompliance {
          status {
            code
            label
            badge
          }
        }
      }
    }
  }
`;
export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}
`;
//# sourceMappingURL=AnafStatusCell.js.map