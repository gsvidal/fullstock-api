import type { CategorySlug } from "../repositories/category.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";
import type { GetProductsQuery } from "../schemas/product.schema.ts";

export async function getProductsByCategory(
  slug: CategorySlug,
  filters: GetProductsQuery,
): Promise<productRepository.Product[]> {
  return productRepository.getByCategorySlug(slug, filters);
}

export async function getProduct(
  slug: productRepository.ProductSlug,
): Promise<productRepository.Product | null> {
  return productRepository.findBySlug(slug);
}
