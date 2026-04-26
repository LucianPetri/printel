import { Badge } from '@components/common/ui/Badge.js';
import { TableCell } from '@components/common/ui/Table.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

export default function AnafStatusCell({ row }: { row: any }) {
  const compliance = row?.anafCompliance;
  if (!compliance) {
    return <TableCell>—</TableCell>;
  }

  return (
    <TableCell>
      <Badge variant={compliance.status.badge}>{_(compliance.status.label)}</Badge>
    </TableCell>
  );
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
