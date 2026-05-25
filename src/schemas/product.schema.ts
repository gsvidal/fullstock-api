import * as z from "zod";
 
export const getProductsQuerySchema = z.object({
  minPrice: z.coerce.number().positive().optional().catch(undefined),
  maxPrice: z.coerce.number().positive().optional().catch(undefined),
});
 
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;