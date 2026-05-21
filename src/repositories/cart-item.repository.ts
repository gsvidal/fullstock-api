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

interface CartItemWithProductRow extends CartItemRow {
  title: string;
  slug: string;
  price: number;
  img_src: string;
}

export type CartItem = ReturnType<typeof camelCaseKeys<CartItemRow>>;

export type CartItemWithProduct = ReturnType<
  typeof camelCaseKeys<CartItemWithProductRow>
>;

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

export async function findById(id: number): Promise<CartItem | null> {
  // Completa el cuerpo de la función.
  const result = await db.query<CartItemRow>(
    `SELECT * FROM cart_items
    WHERE id = $1`,
    [id],
  );
  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}

export async function updateQuantity(
  id: number,
  quantity: number,
): Promise<CartItem> {
  // Completa el cuerpo de la función.
  const result = await db.query<CartItemRow>(
    `UPDATE cart_items 
  SET quantity = $1, updated_at = NOW() 
  WHERE id = $2
  RETURNING *`,
    [quantity, id],
  );
  if (result.rows[0] === undefined)
    throw new Error("Actualización no devolvio una fila");

  return camelCaseKeys(result.rows[0]);
}

export async function remove(id: number): Promise<void> {
  await db.query<CartItemRow>(
    `DELETE FROM cart_items
    WHERE id = $1`,
    [id],
  );
}

export async function getItemsWithProductByCartId(
  cartId: number,
): Promise<CartItemWithProduct[]> {
  const result = await db.query<CartItemWithProductRow>(
    `SELECT ci.*, p.title, p.slug, p.price, p.img_src
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at ASC`,
    [cartId],
  );

  return camelCaseKeys(result.rows);
}
