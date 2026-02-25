import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useGetCompanyLogo() {
  const { actor, isFetching } = useActor();

  return useQuery<ExternalBlob | null>({
    queryKey: ['companyLogo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetCompanyLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setLogo(logo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyLogo'] });
    },
  });
}
