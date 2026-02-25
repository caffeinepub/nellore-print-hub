import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useQuotationStatistics() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    pending: bigint;
    accepted: bigint;
    rejected: bigint;
    negotiating: bigint;
  }>({
    queryKey: ['quotationStatistics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getQuotationStatistics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}
