/**
 * WebAuthn utility functions for biometric authentication
 */

export async function checkWebAuthnSupport(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return false;
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}

export async function startRegistration(email: string): Promise<Credential | null> {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn is not supported');
  }

  // Generate a challenge (in production, this should come from the server)
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: 'Nellore Print Hub',
      id: window.location.hostname,
    },
    user: {
      id: new TextEncoder().encode(email),
      name: email,
      displayName: email,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' }, // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      requireResidentKey: false,
    },
    timeout: 60000,
    attestation: 'none',
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });
    return credential;
  } catch (error) {
    console.error('WebAuthn registration error:', error);
    throw error;
  }
}

export async function startAuthentication(email: string): Promise<Credential | null> {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn is not supported');
  }

  // Generate a challenge (in production, this should come from the server)
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge,
    timeout: 60000,
    userVerification: 'required',
    rpId: window.location.hostname,
  };

  try {
    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });
    return credential;
  } catch (error) {
    console.error('WebAuthn authentication error:', error);
    throw error;
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
