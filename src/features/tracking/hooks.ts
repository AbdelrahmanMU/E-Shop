import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { OrderId } from '@/types/domain';
import { getTrackingState, type TrackingState } from './api';

const POLL_MS = 15_000;

export function useTrackingState(orderId: OrderId | undefined): UseQueryResult<TrackingState | null> {
  return useQuery({
    queryKey: ['tracking', orderId],
    queryFn: () => (orderId ? getTrackingState(orderId) : Promise.resolve(null)),
    enabled: !!orderId,
    refetchInterval: POLL_MS,
  });
}
