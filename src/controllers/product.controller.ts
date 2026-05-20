import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import type { CategorySlug } from "../repositories/category.repository.ts";
import type { ProductSlug } from "../repositories/product.repository.ts";
import * as categoryService from "../services/category.service.ts";
import * as productService from "../services/product.service.ts";

export interface Filters {
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(
  req: Request<
    { slug: CategorySlug },
    unknown,
    unknown,
    { minPrice?: string; maxPrice?: string }
  >,
  res: Response,
) {
  const { minPrice, maxPrice } = req.query; // string | undefined

  const filters: Filters = {};

  function isNumericString(input: string | undefined) {
    return input !== undefined && input !== '' && !isNaN(Number(input));
  }

  if (isNumericString(minPrice)) filters.minPrice = Number(minPrice);
  if (isNumericString(maxPrice)) filters.maxPrice = Number(maxPrice);

  const { slug } = req.params;
  const category = await categoryService.getCategory(slug);
  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  const products = await productService.getProductsByCategory(slug, filters);

  res.json({ data: products });
}

export async function getProduct(
  req: Request<{ slug: ProductSlug }>,
  res: Response,
): Promise<void> {
  const { slug } = req.params;
  const product = await productService.getProduct(slug);
  if (!product) {
    throw new ApiError(404, "El producto no existe");
  }
  res.json({ data: product });
}
