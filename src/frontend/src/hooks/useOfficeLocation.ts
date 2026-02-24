import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { OfficeLocation } from '../backend';

export function useGetOfficeLocation() {
  const { actor, isFetching } = useActor();

  return useQuery<OfficeLocation | null>({
    queryKey: ['officeLocation'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOfficeLocation();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetOfficeLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: OfficeLocation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setOfficeLocation(location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officeLocation'] });
    },
  });
}
