import { registerJob } from '@evershop/evershop/lib/cronjob';
import { addProcessor } from '@evershop/evershop/lib/util/registry';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getConnectionState, getOrderComplianceByOrderId } from './lib/anafComplianceRepository.js';
import { getConnectionLabel } from './lib/tsAnafClient.js';
import { getAnafRetryCronSchedule } from './lib/settings.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
function injectAnafRegistrationMarkup(template) {
    if (template.includes('{{#if anafRegistrationCode}}')) {
        return template;
    }
    const marker = '<p\r\n                                       style="';
    const insertion = `
                    {{#if anafRegistrationCode}}
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 16px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              border: 1px solid #d9f99d;
                              background: #f7fee7;
                              border-radius: 8px;
                              padding: 16px;
                            "
                          >
                            <p style="font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">
                              ANAF registration code
                            </p>
                            <p style="font-size: 16px; margin: 0;">{{anafRegistrationCode}}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {{/if}}
`;
    const index = template.indexOf(marker);
    return index === -1 ? template : `${template.slice(0, index)}${insertion}${template.slice(index)}`;
}
export default (()=>{
    addProcessor('orderConfirmationEmailData', async (data)=>{
        const orderId = Number.parseInt(String(data?.order?.order_id), 10);
        if (!orderId) {
            return data;
        }
        const compliance = await getOrderComplianceByOrderId(orderId);
        if (!compliance?.registration_code) {
            return data;
        }
        return {
            ...data,
            anafRegistrationCode: compliance.registration_code
        };
    });
    addProcessor('orderConfirmationEmailArguments', (args)=>{
        if (!args?.data?.anafRegistrationCode) {
            return args;
        }
        return {
            ...args,
            template: injectAnafRegistrationMarkup(args.template)
        };
    });
    addProcessor('orderCollectionFilters', (filters)=>[
            ...filters,
            {
                key: 'anaf_status',
                operation: [
                    'eq'
                ],
                callback: (query, operation, value, currentFilters)=>{
                    query.leftJoin('order_anaf_compliance', 'order_anaf_compliance', 'order_anaf_compliance.order_id', '=', 'order.order_id');
                    query.andWhere('order_anaf_compliance.status', '=', value);
                    currentFilters.push({
                        key: 'anaf_status',
                        operation,
                        value
                    });
                }
            }
        ]);
    registerJob({
        name: 'printelAnafRetryWorker',
        resolve: path.join(__dirname, 'services/processAnafRetryQueue.js'),
        enabled: true,
        schedule: getAnafRetryCronSchedule()
    });
    addProcessor('emailTemplateData', async (data)=>{
        const connectionState = await getConnectionState();
        return {
            ...data,
            anafConnectionLabel: connectionState ? getConnectionLabel(connectionState.environment, connectionState.is_connected) : 'Disconnected'
        };
    });
});
