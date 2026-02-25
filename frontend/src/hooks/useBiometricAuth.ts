import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  checkWebAuthnSupport,
  startAuthentication,
  startRegistration,
} from '@/utils/webauthn';

export function useBiometricLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');

      const supported = await checkWebAuthnSupport();
      if (!supported) {
        throw new Error('Biometric authentication is not supported on this device');
      }

      try {
        // Attempt WebAuthn authentication
        const credential = await startAuthentication(email);

        if (!credential) {
          throw new Error('Biometric authentication failed');
        }

        // In a real implementation, you would verify the credential with the backend
        // For now, we'll just register the biometric if not already registered
        await actor.registerBiometric(email);

        return true;
      } catch (error: any) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Biometric authentication was cancelled');
        }
        throw error;
      }
    },
  });
}

export function useRegisterBiometric() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');

      const supported = await checkWebAuthnSupport();
      if (!supported) {
        throw new Error('Biometric authentication is not supported on this device');
      }

      try {
        // Start WebAuthn registration
        const credential = await startRegistration(email);

        if (!credential) {
          throw new Error('Biometric registration failed');
        }

        // Register with backend
        await actor.registerBiometric(email);

        return true;
      } catch (error: any) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Biometric registration was cancelled');
        }
        throw error;
      }
    },
  });
}
