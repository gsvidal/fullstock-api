import * as productController from "../controllers/product.controller.ts";
import type { CategorySlug } from "../repositories/category.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";

export async function getProductsByCategory(
  slug: CategorySlug,
  filters: productController.Filters
): Promise<productRepository.Product[]> {
  return productRepository.getByCategorySlug(slug, filters);
}

export async function getProduct(
  slug: productRepository.ProductSlug,
): Promise<productRepository.Product | null> {
  return productRepository.findBySlug(slug);
}
