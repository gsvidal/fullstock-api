import * as z from "zod";

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
