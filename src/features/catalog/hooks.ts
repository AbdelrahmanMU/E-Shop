import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useMerchant } from '@/hooks/useMerchant';
import type { Category, Product } from '@/types/domain';
import {
  getCategory,
  getProduct,
  listCategories,
  listFeatured,
  listProducts,
} from './api';
import type { CatalogFilter } from './schemas';

export function useCategories(): UseQueryResult<Category[]> {
  const { merchant } = useMerchant();
  return useQuery({
    queryKey: ['categories', merchant.id],
    queryFn: () => listCategories(merchant.id),
  });
}

export function useCategory(categoryId: string | undefined): UseQueryResult<Category | null> {
  const { merchant } = useMerchant();
  return useQuery({
    queryKey: ['category', merchant.id, categoryId],
    queryFn: () => (categoryId ? getCategory(merchant.id, categoryId) : Promise.resolve(null)),
    enabled: !!categoryId,
  });
}

export function useProducts(filter: CatalogFilter): UseQueryResult<Product[]> {
  const { merchant } = useMerchant();
  return useQuery({
    queryKey: ['products', merchant.id, filter],
    queryFn: () => listProducts(merchant.id, filter),
  });
}

export function useProduct(productId: string | undefined): UseQueryResult<Product | null> {
  const { merchant } = useMerchant();
  return useQuery({
    queryKey: ['product', merchant.id, productId],
    queryFn: () => (productId ? getProduct(merchant.id, productId) : Promise.resolve(null)),
    enabled: !!productId,
  });
}

export function useFeaturedProducts(limit = 4): UseQueryResult<Product[]> {
  const { merchant } = useMerchant();
  return useQuery({
    queryKey: ['featured', merchant.id, limit],
    queryFn: () => listFeatured(merchant.id, limit),
  });
}
