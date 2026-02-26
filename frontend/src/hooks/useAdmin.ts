import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isReady = !!actor && !actorFetching && !!identity && !isInitializing;

  const query = useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
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
    enabled: isReady,
    retry: 2,
    staleTime: 0, // Always refetch to ensure fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isLoading: !isReady || query.isLoading || query.isFetching,
    isFetched: isReady && query.isFetched,
  };
}
