import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ServiceImage } from '../backend';

export function useGetServiceImages() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceImage[]>({
    queryKey: ['serviceImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServiceImages();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddServiceImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceType,
      imageUrl,
      description,
    }: {
      serviceType: string;
      imageUrl: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addServiceImage(serviceType, imageUrl, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceImages'] });
    },
  });
}

export function useDeleteServiceImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteServiceImage(imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceImages'] });
    },
  });
}
