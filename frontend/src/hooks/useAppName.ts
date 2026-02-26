import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetAppName() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['appName'],
    queryFn: async () => {
      if (!actor) return 'Nellore Printing Hub';
      const name = await actor.getAppName();
      return name || 'Nellore Printing Hub';
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSetAppName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setAppName(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appName'] });
    },
  });
}
