import { z } from 'zod';

export const PRODUCT_BADGES = ['bestseller', 'handmade', 'limited', 'organic', 'new'] as const;

export const CatalogFilterSchema = z.object({
  categoryId: z.string().min(1).optional(),
  badge: z.enum(PRODUCT_BADGES).optional(),
  query: z.string().trim().min(1).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).default('newest'),
});

export type CatalogFilter = z.infer<typeof CatalogFilterSchema>;
