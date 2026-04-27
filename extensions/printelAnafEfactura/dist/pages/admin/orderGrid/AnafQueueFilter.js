import { SelectField } from '@components/common/form/SelectField.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
export default function AnafQueueFilter({ orders }) {
    const currentValue = orders?.currentFilters?.find((filter)=>filter.key === 'anaf_status')?.value ?? '';
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-w-[220px]"
    }, /*#__PURE__*/ React.createElement(SelectField, {
        name: "anaf_status",
        label: _('ANAF status'),
        defaultValue: currentValue,
        options: [
            {
                value: '',
                label: _('All ANAF states')
            },
            {
                value: 'pending_approval',
                label: _('Pending approval')
            },
            {
                value: 'queued',
                label: _('Queued for retry')
            },
            {
                value: 'submitting',
                label: _('Submitting to ANAF')
            },
            {
                value: 'registered',
                label: _('Registered')
            },
            {
                value: 'attention_required',
                label: _('Attention required')
            },
            {
                value: 'manual_review',
                label: _('Manual review')
            },
            {
                value: 'blocked_auth',
                label: _('Blocked authentication')
            }
        ],
        onChange: (value)=>{
            const url = new URL(document.location.href);
            if (!value) {
                url.searchParams.delete('anaf_status');
            } else {
                url.searchParams.set('anaf_status', String(value));
            }
            window.location.href = url.toString();
        }
    }));
}
export const layout = {
    areaId: 'orderGridFilter',
    sortOrder: 20
};
export const query = `
  query Query($filters: [FilterInput]) {
    orders(filters: $filters) {
      currentFilters {
        key
        value
      }
    }
  }
`;
export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}
`;
