/**
 * Utility class for handling blob storage URLs
 * Provides methods to work with blob URLs stored in the backend
 */
export class ExternalBlob {
  private url: string;
  private progressCallback?: (percentage: number) => void;

  private constructor(url: string) {
    this.url = url;
  }

  /**
   * Create an ExternalBlob from a URL string
   */
  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url);
  }

  /**
   * Create an ExternalBlob from bytes (for uploads)
   * In a real implementation, this would upload to the backend
   * For now, we create a data URL
   */
  static fromBytes(bytes: Uint8Array): ExternalBlob {
    // Create a new Uint8Array to ensure we have a proper ArrayBuffer
    const buffer = new Uint8Array(bytes);
    const blob = new Blob([buffer]);
    const url = URL.createObjectURL(blob);
    return new ExternalBlob(url);
  }

  /**
   * Set upload progress callback
   */
  withUploadProgress(callback: (percentage: number) => void): ExternalBlob {
    this.progressCallback = callback;
    // Simulate upload progress
    if (this.progressCallback) {
      setTimeout(() => this.progressCallback?.(100), 100);
    }
    return this;
  }

  /**
   * Get the direct URL for displaying the blob
   */
  getDirectURL(): string {
    return this.url;
  }

  /**
   * Get bytes (async operation)
   */
  async getBytes(): Promise<Uint8Array> {
    const response = await fetch(this.url);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }
}
