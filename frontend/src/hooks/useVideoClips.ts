import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { VideoClip } from '../backend';

export function useGetVideoClips() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoClip[]>({
    queryKey: ['videoClips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideoClips();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddVideoClip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceType,
      videoUrl,
      thumbnailUrl,
      description,
    }: {
      serviceType: string;
      videoUrl: string;
      thumbnailUrl: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVideoClip(serviceType, videoUrl, thumbnailUrl, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoClips'] });
    },
  });
}

export function useDeleteVideoClip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clipId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVideoClip(clipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoClips'] });
    },
  });
}
