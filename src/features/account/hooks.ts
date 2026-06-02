import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCustomerProfile, type CustomerProfile } from './api';

export function useCustomerProfile(): UseQueryResult<CustomerProfile> {
  return useQuery({
    queryKey: ['customer-profile'],
    queryFn: () => getCustomerProfile(),
  });
}
