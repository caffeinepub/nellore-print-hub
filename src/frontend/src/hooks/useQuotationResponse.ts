import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { QuotationStatus } from '../backend';

export function useQuotationResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      quotationId: string;
      status: QuotationStatus;
      message?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.handleQuotationResponse(
        data.quotationId,
        data.status,
        data.message || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['myQuotations'] });
    },
  });
}
