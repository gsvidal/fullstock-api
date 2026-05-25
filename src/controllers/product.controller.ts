import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import { slugParamSchema } from "../schemas/params.schema.ts";
import { type GetProductsQuery, getProductsQuerySchema } from "../schemas/product.schema.ts";
import * as categoryService from "../services/category.service.ts";
import * as productService from "../services/product.service.ts";

export async function getProducts(
  req: Request,
  res: Response,
) {
  const { slug } = slugParamSchema.parse(req.params);
  const { minPrice, maxPrice } = getProductsQuerySchema.parse(req.query);

  const filters: GetProductsQuery = {};

  filters.minPrice = minPrice; 
  filters.maxPrice = maxPrice; 

  const category = await categoryService.getCategory(slug);
  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  const products = await productService.getProductsByCategory(slug, filters);

  res.json({ data: products });
}

export async function getProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const { slug } = slugParamSchema.parse(req.params);
  const product = await productService.getProduct(slug);
  if (!product) {
    throw new ApiError(404, "El producto no existe");
  }
  res.json({ data: product });
}
