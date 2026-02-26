import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Register the very first admin (no admins exist yet).
 * Requires the caller to be authenticated via Internet Identity (non-anonymous).
 */
export function useRegisterInitialAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const hashedPassword = await sha256(password);
      await actor.registerInitialAdmin(email, hashedPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExists'] });
      queryClient.invalidateQueries({ queryKey: ['adminUserCount'] });
    },
  });
}

/**
 * Invite a new admin user (requires existing admin session).
 */
export function useInviteAdminUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const hashedPassword = await sha256(password);
      await actor.inviteAdminUser(email, hashedPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInvitations'] });
    },
  });
}
