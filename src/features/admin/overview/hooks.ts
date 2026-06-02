import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  getKpis,
  getPeakHours,
  getRevenueByDay,
  listCities,
  listRecentOrders,
  listTopProducts,
  type AdminKpis,
  type CityRow,
  type PeakHoursResult,
  type RecentOrder,
  type RevenuePoint,
  type TopProductRow,
} from './api';

export function useAdminKpis(): UseQueryResult<AdminKpis> {
  return useQuery({ queryKey: ['admin', 'kpis'], queryFn: getKpis });
}

export function useRevenueByDay(): UseQueryResult<{ points: RevenuePoint[]; totalEgp: number }> {
  return useQuery({ queryKey: ['admin', 'revenue-by-day'], queryFn: getRevenueByDay });
}

export function useRecentOrders(limit = 6): UseQueryResult<RecentOrder[]> {
  return useQuery({
    queryKey: ['admin', 'recent-orders', limit],
    queryFn: () => listRecentOrders(limit),
  });
}

export function useTopProducts(): UseQueryResult<TopProductRow[]> {
  return useQuery({ queryKey: ['admin', 'top-products'], queryFn: listTopProducts });
}

export function usePeakHours(): UseQueryResult<PeakHoursResult> {
  return useQuery({ queryKey: ['admin', 'peak-hours'], queryFn: getPeakHours });
}

export function useCitiesBreakdown(): UseQueryResult<CityRow[]> {
  return useQuery({ queryKey: ['admin', 'cities'], queryFn: listCities });
}
