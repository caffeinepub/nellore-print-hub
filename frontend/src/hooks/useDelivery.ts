import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useCalculateDeliveryFee() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (distance: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.calculateDeliveryFee(distance);
    },
  });
}
