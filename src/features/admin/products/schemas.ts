import { z } from 'zod';
import { PRODUCT_BADGES } from '@/features/catalog/schemas';

/**
 * Shape accepted by the create/edit product form.
 * Prices are in EGP-major (the form input); the api.ts conversion to
 * piastres happens at the write boundary.
 */
export const ProductFormSchema = z.object({
  nameAr:    z.string().trim().min(1, 'admin.products.error_required'),
  nameEn:    z.string().trim().min(1, 'admin.products.error_required'),
  subtitle:  z.string().trim().min(1, 'admin.products.error_required'),
  categoryId: z.string().min(1, 'admin.products.error_required'),
  priceEgp:    z.coerce.number({ invalid_type_error: 'admin.products.error_required' })
                .positive('admin.products.error_min_price'),
  oldPriceEgp: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z.coerce.number().nonnegative('admin.products.error_negative').optional(),
  ),
  weight:    z.string().trim().min(1, 'admin.products.error_required'),
  stock:     z.coerce.number().int().nonnegative('admin.products.error_negative'),
  glyph:     z.string().trim().max(8).optional().or(z.literal('')),
  badge:     z.enum(PRODUCT_BADGES).optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export type StockFilter = 'all' | 'active' | 'low' | 'out';
