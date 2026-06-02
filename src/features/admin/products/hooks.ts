import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { useProductStore } from '@/lib/mock/product-store';
import type { Product } from '@/types/domain';
import {
  createProduct,
  deleteProduct,
  getLowStockAlert,
  getProductsStats,
  listAdminProducts,
  updateProduct,
  type AdminProductsFilter,
  type AdminProductsResult,
  type AdminProductsStats,
  type LowStockAlert,
} from './api';
import type { ProductFormValues } from './schemas';

const STORE_KEY = ['admin', 'products-store-version'] as const;

/**
 * The product store mutates synchronously when CRUD calls fire — but
 * TanStack Query caches don't know that. After each mutation we invalidate
 * the relevant queries so the table + stats + low-stock alert + customer
 * catalogue all refetch. Customer-side cache lives under ['products', ...]
 * and ['featured', ...], so we drop those too.
 */
function useProductMutationSideEffects() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['admin', 'products-list'] });
    qc.invalidateQueries({ queryKey: ['admin', 'products-stats'] });
    qc.invalidateQueries({ queryKey: ['admin', 'low-stock'] });
    // Customer catalogue
    qc.invalidateQueries({ queryKey: ['products'] });
    qc.invalidateQueries({ queryKey: ['featured'] });
    qc.invalidateQueries({ queryKey: ['product'] });
  };
}

export function useAdminProducts(filter: AdminProductsFilter): UseQueryResult<AdminProductsResult> {
  // `byId` is read so the query re-evaluates when the store mutates.
  const storeVersion = useProductStore((s) => Object.keys(s.byId).length);
  return useQuery({
    queryKey: ['admin', 'products-list', filter, storeVersion, STORE_KEY],
    queryFn: () => listAdminProducts(filter),
  });
}

export function useProductsStats(): UseQueryResult<AdminProductsStats> {
  const storeVersion = useProductStore((s) => Object.keys(s.byId).length);
  return useQuery({
    queryKey: ['admin', 'products-stats', storeVersion],
    queryFn: getProductsStats,
  });
}

export function useLowStockAlert(): UseQueryResult<LowStockAlert> {
  const storeVersion = useProductStore((s) => Object.keys(s.byId).length);
  return useQuery({
    queryKey: ['admin', 'low-stock', storeVersion],
    queryFn: getLowStockAlert,
  });
}

export function useCreateProduct(): UseMutationResult<Product, Error, ProductFormValues> {
  const refresh = useProductMutationSideEffects();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: refresh,
  });
}

export function useUpdateProduct(): UseMutationResult<Product, Error, { id: string; values: ProductFormValues }> {
  const refresh = useProductMutationSideEffects();
  return useMutation({
    mutationFn: ({ id, values }) => updateProduct(id, values),
    onSuccess: refresh,
  });
}

export function useDeleteProduct(): UseMutationResult<void, Error, string> {
  const refresh = useProductMutationSideEffects();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: refresh,
  });
}
