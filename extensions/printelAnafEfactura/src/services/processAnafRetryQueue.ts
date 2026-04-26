import { error } from '@evershop/evershop/lib/log';
import { getQueuedComplianceItems } from '../lib/anafComplianceRepository.js';
import { reconcileAnafSubmission } from './reconcileAnafSubmission.js';

export default async function processAnafRetryQueue() {
  const queuedItems = await getQueuedComplianceItems(20);

  await Promise.all(
    queuedItems.map(async (item) => {
      try {
        await reconcileAnafSubmission(item.order_id, 'retry_cron');
      } catch (err) {
        error(err);
      }
    })
  );
}
