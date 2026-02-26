import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAdminExists() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['adminExists'],
    queryFn: async () => {
      if (!actor) return false;
      const count = await actor.getAdminUserCount();
      return Number(count) > 0;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  return {
    ...query,
    adminExists: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}
