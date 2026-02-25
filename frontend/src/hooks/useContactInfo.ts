import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ContactInfo } from '../backend';

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; phone: string; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(data.email, data.phone, data.location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}
