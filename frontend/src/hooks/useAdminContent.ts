import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AdminContent, ContactInfo } from '../backend';

export function useGetAdminContent() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminContent | null>({
    queryKey: ['adminContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateAdminContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: AdminContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdminContent(
        content.contactInfo,
        content.services,
        content.businessHours,
        content.gallery,
        content.homepageContent,
        content.aboutPageContent
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContent'] });
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}
