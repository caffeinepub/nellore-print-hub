import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { QuotationRequest } from '../backend';

export function useGetCustomerQuotations(customerId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<QuotationRequest[]>({
    queryKey: ['customerQuotations', customerId],
    queryFn: async () => {
      if (!actor || !customerId) return [];
      return actor.getCustomerQuotations(customerId);
    },
    enabled: !!actor && !isFetching && !!customerId,
  });
}
