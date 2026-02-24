import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function useVerifyEmailPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');

      const hashedPassword = await hashPassword(password);
      const isValid = await actor.verifyAuthentication(email, hashedPassword);

      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      return true;
    },
  });
}
