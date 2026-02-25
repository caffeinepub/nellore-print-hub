import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DeliveryConfig } from '../backend';

export function useDeliveryConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<DeliveryConfig>({
    queryKey: ['deliveryConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDeliveryConfig();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCalculateDeliveryFee() {
  const { actor } = useActor();

  return useMutation<bigint, Error, bigint>({
    mutationFn: async (distance: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.calculateDeliveryFee(distance);
    },
  });
}

export function useSetDeliveryConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { perKmRate: bigint; minimumFee: bigint }>({
    mutationFn: async ({ perKmRate, minimumFee }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDeliveryConfig(perKmRate, minimumFee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryConfig'] });
    },
  });
}
