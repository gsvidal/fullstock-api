import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";

interface CartItemRow {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export type CartItem = ReturnType<typeof camelCaseKeys<CartItemRow>>;

export async function create(
  cartId: number,
  productId: number,
  quantity: number,
): Promise<CartItem> {
  const result = await db.query<CartItemRow>(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [cartId, productId, quantity],
  );

  const row = result.rows[0];

  if (row === undefined) throw new Error("INSERT did not return a row");

  return camelCaseKeys(row);
}

export async function findByCartAndProduct(
  cartId: number,
  productId: number,
): Promise<CartItem | null> {
  const result = await db.query<CartItemRow>(
    `
    SELECT * FROM cart_items
    WHERE cart_id = $1 AND product_id = $2;`,
    [cartId, productId],
  );

  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}
