import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      if (!identity) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error: any) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity && !isInitializing,
    retry: 1,
    staleTime: 0, // Always refetch to ensure fresh data
  });

  return {
    ...query,
    isLoading: actorFetching || isInitializing || query.isLoading,
    isFetched: !!actor && !!identity && query.isFetched,
  };
}
