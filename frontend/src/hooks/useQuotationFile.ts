import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useGetQuotationFile(quotationId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ExternalBlob | null>({
    queryKey: ['quotationFile', quotationId],
    queryFn: async () => {
      if (!actor || !quotationId) return null;
      const quotations = await actor.getAllQuotations();
      const quotation = quotations.find(q => q.id === quotationId);
      return quotation?.quotationFileBlob ?? null;
    },
    enabled: !!actor && !isFetching && !!quotationId,
  });
}
