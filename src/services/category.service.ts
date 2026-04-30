import * as categoryRepository from "../repositories/category.repository.ts";
import type { Category } from "../repositories/category.repository.ts";
 
export async function getCategories(): Promise<Category[]> {
  return categoryRepository.getAll();
}