import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function useRegisterFirstAdmin() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      if (!identity) {
        throw new Error('Not authenticated with Internet Identity');
      }
      const principal = identity.getPrincipal();
      await actor.addInternetIdentityAdmin(principal);
    },
    onSuccess: async () => {
      // Invalidate and refetch all admin-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['adminExists'] }),
        queryClient.invalidateQueries({ queryKey: ['isAdmin'] }),
        queryClient.invalidateQueries({ queryKey: ['adminUserCount'] }),
      ]);

      // Wait for queries to refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['adminExists'] }),
        queryClient.refetchQueries({ queryKey: ['isAdmin'] }),
      ]);

      toast.success('Successfully registered as first admin!');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register as admin');
    },
  });
}

// Seeds the first admin's email/password credentials when no admin exists yet.
// inviteAdminUser has no auth check when adminCount == 0.
export function useSeedFirstAdminPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      const hashedPassword = await hashPassword(password);
      await actor.inviteAdminUser(email, hashedPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInvitations'] });
    },
    onError: (error: any) => {
      console.error('Seed admin password error:', error);
    },
  });
}
