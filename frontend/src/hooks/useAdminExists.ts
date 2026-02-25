import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAdminExists() {
  const { actor, isFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['adminExists'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const count = await actor.getAdminUserCount();
        return Number(count) > 0;
      } catch (error: any) {
        console.error('Error checking admin existence:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0, // Always refetch to ensure fresh data
    retry: 1,
  });

  return {
    ...query,
    adminExists: query.data ?? false,
  };
}
