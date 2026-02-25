import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useUploadQuotationFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quotationId, file }: { quotationId: string; file: File }) => {
      if (!actor) throw new Error('Actor not available');
      
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);
      
      return actor.uploadQuotationFile(quotationId, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['myQuotations'] });
    },
  });
}

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
