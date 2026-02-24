import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AdminInvitationEntry } from '@/backend';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function useGetAdminInvitations() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminInvitationEntry[]>({
    queryKey: ['adminInvitations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminInvitations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInviteAdminUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');

      const hashedPassword = await hashPassword(password);
      await actor.inviteAdminUser(email, hashedPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInvitations'] });
    },
  });
}
