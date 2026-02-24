import { ExternalBlob as BackendExternalBlob } from '../backend';

export class ExternalBlob {
  private blob: BackendExternalBlob;

  constructor(blob: BackendExternalBlob) {
    this.blob = blob;
  }

  async getBytes(): Promise<Uint8Array> {
    return this.blob.getBytes();
  }

  getDirectURL(): string {
    return this.blob.getDirectURL();
  }

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(BackendExternalBlob.fromURL(url));
  }

  static fromBytes(blob: Uint8Array): ExternalBlob {
    // Create a new Uint8Array to ensure proper TypeScript type compatibility
    const bytes = new Uint8Array(blob);
    return new ExternalBlob(BackendExternalBlob.fromBytes(bytes));
  }

  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    return new ExternalBlob(this.blob.withUploadProgress(onProgress));
  }

  toBackendBlob(): BackendExternalBlob {
    return this.blob;
  }
}
