import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useRegisterFirstAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      await actor.registerFirstAdmin();
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
