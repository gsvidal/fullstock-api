import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import { slugParamSchema } from "../schemas/params.schema.ts";
import * as categoryService from "../services/category.service.ts";

export async function getCategories(_req: Request, res: Response) {
  const categories = await categoryService.getCategories();
  res.json({ data: categories });
}

export async function getCategory(req: Request, res: Response) {
  const { slug } = slugParamSchema.parse(req.params);
  const category = await categoryService.getCategory(slug);

  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  res.json({ data: category });
}
