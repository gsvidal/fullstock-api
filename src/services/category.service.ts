import * as categoryRepository from "../repositories/category.repository.ts";
import type {
  Category,
  Slug,
} from "../repositories/category.repository.ts";

export async function getCategories(): Promise<Category[]> {
  return categoryRepository.getAll();
}

export async function getCategory(slug: Slug): Promise<Category | null>{
  return categoryRepository.findBySlug(slug);
}