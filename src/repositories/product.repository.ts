import camelCaseKeys from "camelcase-keys";
import * as productController from "../controllers/product.controller.ts";
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
  filters: productController.Filters,
): Promise<Product[]> {
  const params: (string | number)[] = [slug];
  const conditions: string[] = ["c.slug = $1"];

  const { minPrice, maxPrice } = filters;
 
  if (minPrice !== undefined && !isNaN(minPrice)) {
    params.push(minPrice);
    conditions.push(`p.price >= $${params.length}`);
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    params.push(maxPrice);
    conditions.push(`p.price <= $${params.length}`);
  }
  const result = await db.query<ProductRow>(
    `SELECT p.* FROM products p
   JOIN categories c ON p.category_id = c.id
   WHERE ${conditions.join(" AND ")}`,
    params,
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
