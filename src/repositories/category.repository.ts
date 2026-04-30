import camelcaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";

export interface CategoryRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  alt: string | null;
  description: string;
  create_at: Date;
  update_at: Date;
}

export type Category = ReturnType<typeof camelcaseKeys<CategoryRow>>;

export async function getAll(): Promise<Category[]> {
  const result = await db.query<CategoryRow>("SELECT * FROM categories");
  return camelcaseKeys(result.rows);
}
