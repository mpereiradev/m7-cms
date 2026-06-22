import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { IStoragePort } from '../../application/ports/i-storage.port.js';

@Injectable()
export class SupabaseStorageService implements IStoragePort {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    );
  }

  private bucketName(tenantId: string): string {
    return `media-${tenantId}`;
  }

  /**
   * Ensures the tenant bucket exists, creating it if necessary.
   */
  private async ensureBucket(tenantId: string): Promise<void> {
    const bucket = this.bucketName(tenantId);
    const { error } = await this.supabase.storage.getBucket(bucket);

    if (error) {
      // Bucket does not exist — create it
      const { error: createError } = await this.supabase.storage.createBucket(
        bucket,
        { public: true },
      );
      if (createError && !createError.message.includes('already exists')) {
        this.logger.error(`Failed to create bucket "${bucket}"`, createError);
        throw new InternalServerErrorException(
          `Could not create storage bucket.`,
        );
      }
    }
  }

  async upload(
    tenantId: string,
    path: string,
    file: Buffer,
    mimeType: string,
  ): Promise<string> {
    await this.ensureBucket(tenantId);

    const bucket = this.bucketName(tenantId);
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Upload failed for ${bucket}/${path}`, error);
      throw new InternalServerErrorException('File upload failed.');
    }

    // Build public URL
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async delete(tenantId: string, path: string): Promise<void> {
    const bucket = this.bucketName(tenantId);
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) {
      this.logger.warn(`Delete failed for ${bucket}/${path}`, error);
      // Non-critical — log but do not throw
    }
  }

  async getSignedUrl(
    tenantId: string,
    path: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    const bucket = this.bucketName(tenantId);
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error || !data?.signedUrl) {
      this.logger.error(`Signed URL failed for ${bucket}/${path}`, error);
      throw new InternalServerErrorException('Could not generate signed URL.');
    }

    return data.signedUrl;
  }
}
