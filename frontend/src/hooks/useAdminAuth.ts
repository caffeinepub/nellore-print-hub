import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function useAdminAuth() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const hashedPassword = await sha256(password);
      const result = await actor.verifyAuthentication(email, hashedPassword);
      if (!result) throw new Error('Invalid email or password');
      return { email, success: true };
    },
  });
}
