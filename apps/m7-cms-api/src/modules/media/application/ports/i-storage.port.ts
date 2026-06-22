export const STORAGE_PORT = Symbol('STORAGE_PORT');

export interface IStoragePort {
  /**
   * Upload a file to the tenant's bucket.
   * Creates the bucket if it does not exist.
   * @returns The public/storage URL of the uploaded file.
   */
  upload(
    tenantId: string,
    path: string,
    file: Buffer,
    mimeType: string,
  ): Promise<string>;

  /**
   * Delete a file from the tenant's bucket.
   */
  delete(tenantId: string, path: string): Promise<void>;

  /**
   * Generate a time-limited signed URL for private access.
   */
  getSignedUrl(
    tenantId: string,
    path: string,
    expiresInSeconds?: number,
  ): Promise<string>;
}
