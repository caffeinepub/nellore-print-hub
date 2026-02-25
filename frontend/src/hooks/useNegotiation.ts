import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useRespondToNegotiation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { quotationId: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.respondToNegotiation(data.quotationId, data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['myQuotations'] });
    },
  });
}
