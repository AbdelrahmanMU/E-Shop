import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  getOrderMiniStats,
  listOrders,
  type AdminOrdersFilter,
  type AdminOrdersResult,
  type AdminOrderMiniStats,
} from './api';

export function useAdminOrders(filter: AdminOrdersFilter): UseQueryResult<AdminOrdersResult> {
  return useQuery({
    queryKey: ['admin', 'orders', filter],
    queryFn: () => listOrders(filter),
  });
}

export function useAdminOrderMiniStats(): UseQueryResult<AdminOrderMiniStats> {
  return useQuery({
    queryKey: ['admin', 'order-mini-stats'],
    queryFn: getOrderMiniStats,
  });
}
