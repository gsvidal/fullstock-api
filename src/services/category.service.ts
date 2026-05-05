import * as categoryRepository from "../repositories/category.repository.ts";
import type {
  Category,
  CategorySlug,
} from "../repositories/category.repository.ts";

export async function getCategories(): Promise<Category[]> {
  return categoryRepository.getAll();
}

export async function getCategory(
  slug: CategorySlug,
): Promise<Category | null> {
  return categoryRepository.findBySlug(slug);
}
