import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useGetQuotationFile(quotationId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ExternalBlob | null>({
    queryKey: ['quotationFile', quotationId],
    queryFn: async () => {
      if (!actor || !quotationId) return null;
      // quotationFileBlob was removed from QuotationRequest; use getReplyFile instead
      return actor.getReplyFile(quotationId);
    },
    enabled: !!actor && !isFetching && !!quotationId,
  });
}
