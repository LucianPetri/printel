import { execute } from '@evershop/postgres-query-builder';

export default async function migrate(connection: any) {
  await execute(
    connection,
    `ALTER TABLE "category"
      ADD COLUMN IF NOT EXISTS "print_on_demand_enabled" BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS "print_on_demand_min" INT DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS "print_on_demand_max" INT DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS "print_on_demand_unit" VARCHAR(16) DEFAULT NULL`
  );

  await execute(
    connection,
    `CREATE OR REPLACE FUNCTION reduce_product_stock_when_order_placed()
      RETURNS TRIGGER
      LANGUAGE PLPGSQL
      AS
    $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM product p
        INNER JOIN product_inventory pi
          ON pi.product_inventory_product_id = p.product_id
        INNER JOIN category c
          ON c.category_id = p.category_id
        WHERE p.product_id = NEW.product_id
          AND pi.manage_stock = TRUE
          AND COALESCE(pi.qty, 0) < 1
          AND c.print_on_demand_enabled = TRUE
          AND c.print_on_demand_min IS NOT NULL
          AND c.print_on_demand_max IS NOT NULL
          AND c.print_on_demand_min > 0
          AND c.print_on_demand_max > 0
          AND c.print_on_demand_min <= c.print_on_demand_max
          AND c.print_on_demand_unit IN ('days', 'weeks')
      ) THEN
        RETURN NEW;
      END IF;

      UPDATE product_inventory
      SET qty = CASE
        WHEN qty - NEW.qty < 0 THEN 0
        ELSE qty - NEW.qty
      END
      WHERE product_inventory_product_id = NEW.product_id
        AND manage_stock = TRUE;

      RETURN NEW;
    END
    $$;`
  );

  await execute(
    connection,
    `DROP TRIGGER IF EXISTS "TRIGGER_AFTER_INSERT_ORDER_ITEM" ON "order_item"`
  );

  await execute(
    connection,
    `CREATE TRIGGER "TRIGGER_AFTER_INSERT_ORDER_ITEM"
      AFTER INSERT ON "order_item"
      FOR EACH ROW
      EXECUTE PROCEDURE reduce_product_stock_when_order_placed();`
  );
}
