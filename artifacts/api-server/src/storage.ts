import { usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { db } from "@workspace/db";

export class Storage {
  async listProductsWithPrices(active = true) {
    const result = await db.execute(sql`
      WITH active_products AS (
        SELECT id, name, description, metadata, active, created
        FROM stripe.products
        WHERE active = ${active}
        ORDER BY created
      )
      SELECT
        p.id          AS product_id,
        p.name        AS product_name,
        p.description AS product_description,
        p.active      AS product_active,
        p.metadata    AS product_metadata,
        pr.id         AS price_id,
        pr.unit_amount,
        pr.currency,
        pr.recurring,
        pr.active     AS price_active
      FROM active_products p
      LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
      ORDER BY p.created, pr.unit_amount
    `);
    return result.rows;
  }

  async getProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE id = ${productId}`,
    );
    return result.rows[0] ?? null;
  }

  async getUser(id: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user;
  }
}

export const storage = new Storage();
