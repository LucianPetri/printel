import { execute } from '@evershop/postgres-query-builder';

export default async function migrate(connection: any) {
  await execute(
    connection,
    `CREATE OR REPLACE FUNCTION printel_mark_anaf_manual_review(p_order_id INT, p_reason TEXT)
     RETURNS VOID
     LANGUAGE plpgsql
     AS $$
     BEGIN
       UPDATE order_anaf_compliance
       SET status = 'manual_review',
           manual_review_reason = COALESCE(manual_review_reason, p_reason),
           next_retry_at = NULL,
           updated_at = NOW()
       WHERE order_id = p_order_id
         AND status IN ('pending_approval', 'queued', 'submitting', 'attention_required', 'blocked_auth');
     END;
     $$;`
  );

  await execute(
    connection,
    `CREATE OR REPLACE FUNCTION printel_anaf_handle_order_changes()
     RETURNS trigger
     LANGUAGE plpgsql
     AS $$
     BEGIN
       IF (
         (NEW.status = 'canceled' AND OLD.status IS DISTINCT FROM NEW.status) OR
         OLD.currency IS DISTINCT FROM NEW.currency OR
         OLD.sub_total IS DISTINCT FROM NEW.sub_total OR
         OLD.tax_amount IS DISTINCT FROM NEW.tax_amount OR
         OLD.grand_total IS DISTINCT FROM NEW.grand_total OR
         OLD.billing_address_id IS DISTINCT FROM NEW.billing_address_id OR
         OLD.shipping_address_id IS DISTINCT FROM NEW.shipping_address_id
       ) THEN
         PERFORM printel_mark_anaf_manual_review(
           NEW.order_id,
           'Order financial totals, status, or linked addresses changed after the ANAF snapshot was created.'
         );
       END IF;

       RETURN NEW;
     END;
     $$;`
  );

  await execute(
    connection,
    `DROP TRIGGER IF EXISTS printel_anaf_order_change_trigger ON "order";
     CREATE TRIGGER printel_anaf_order_change_trigger
     AFTER UPDATE ON "order"
     FOR EACH ROW
     EXECUTE PROCEDURE printel_anaf_handle_order_changes();`
  );

  await execute(
    connection,
    `CREATE OR REPLACE FUNCTION printel_anaf_handle_order_item_changes()
     RETURNS trigger
     LANGUAGE plpgsql
     AS $$
     DECLARE
       affected_order_id INT;
     BEGIN
       affected_order_id := COALESCE(NEW.order_item_order_id, OLD.order_item_order_id);

       PERFORM printel_mark_anaf_manual_review(
         affected_order_id,
         'Order line items changed after the ANAF snapshot was created.'
       );

       RETURN COALESCE(NEW, OLD);
     END;
     $$;`
  );

  await execute(
    connection,
    `DROP TRIGGER IF EXISTS printel_anaf_order_item_change_trigger ON order_item;
     CREATE TRIGGER printel_anaf_order_item_change_trigger
     AFTER INSERT OR UPDATE OR DELETE ON order_item
     FOR EACH ROW
     EXECUTE PROCEDURE printel_anaf_handle_order_item_changes();`
  );

  await execute(
    connection,
    `CREATE OR REPLACE FUNCTION printel_anaf_handle_order_address_changes()
     RETURNS trigger
     LANGUAGE plpgsql
     AS $$
     BEGIN
       IF (
         OLD.full_name IS DISTINCT FROM NEW.full_name OR
         OLD.company_name IS DISTINCT FROM NEW.company_name OR
         OLD.address_1 IS DISTINCT FROM NEW.address_1 OR
         OLD.address_2 IS DISTINCT FROM NEW.address_2 OR
         OLD.city IS DISTINCT FROM NEW.city OR
         OLD.province IS DISTINCT FROM NEW.province OR
         OLD.postcode IS DISTINCT FROM NEW.postcode OR
         OLD.country IS DISTINCT FROM NEW.country OR
         OLD.telephone IS DISTINCT FROM NEW.telephone
       ) THEN
         UPDATE order_anaf_compliance compliance
         SET status = 'manual_review',
             manual_review_reason = COALESCE(
               compliance.manual_review_reason,
               'Billing or shipping address details changed after the ANAF snapshot was created.'
             ),
             next_retry_at = NULL,
             updated_at = NOW()
         FROM "order" o
         WHERE compliance.order_id = o.order_id
           AND compliance.status IN ('pending_approval', 'queued', 'submitting', 'attention_required', 'blocked_auth')
           AND (o.billing_address_id = NEW.order_address_id OR o.shipping_address_id = NEW.order_address_id);
       END IF;

       RETURN NEW;
     END;
     $$;`
  );

  await execute(
    connection,
    `DROP TRIGGER IF EXISTS printel_anaf_order_address_change_trigger ON order_address;
     CREATE TRIGGER printel_anaf_order_address_change_trigger
     AFTER UPDATE ON order_address
     FOR EACH ROW
     EXECUTE PROCEDURE printel_anaf_handle_order_address_changes();`
  );
}
