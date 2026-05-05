import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";
import type { CategorySlug } from "./category.repository.ts";

export interface ProductRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  price: number;
  description: string;
  features: string[];
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

export type Product = ReturnType<typeof camelCaseKeys<ProductRow>>;

export type ProductSlug = ProductRow["slug"];

export async function getByCategorySlug(
  slug: CategorySlug,
): Promise<Product[]> {
  const result = await db.query<ProductRow>(
    `
    SELECT p.* 
    FROM products p 
    INNER JOIN categories c on p.category_id = c.id
    WHERE c.slug = $1;`,
    [slug],
  );

  return camelCaseKeys(result.rows);
}

export async function findBySlug(slug: ProductSlug): Promise<Product | null> {
  const result = await db.query<ProductRow>(
    `
    SELECT * FROM products WHERE slug = $1
    `,
    [slug],
  );
  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}
