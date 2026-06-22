import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MEDIA_REPOSITORY,
  type IMediaRepository,
} from '../ports/i-media-repository.port.js';
import { STORAGE_PORT, type IStoragePort } from '../ports/i-storage.port.js';

@Injectable()
export class DeleteMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: IMediaRepository,
    @Inject(STORAGE_PORT)
    private readonly storage: IStoragePort,
  ) {}

  async execute(id: string, tenantId: string): Promise<void> {
    // Fetch the record so we can get the storage path
    const existing = await this.mediaRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException(`Media "${id}" not found.`);
    }

    // Extract the storage path from the URL
    const storagePath = this.extractStoragePath(existing.url);

    // Delete from storage (best-effort)
    if (storagePath) {
      await this.storage.delete(tenantId, storagePath);
    }

    // Delete metadata from DB
    const deleted = await this.mediaRepository.delete(id, tenantId);
    if (!deleted) {
      throw new NotFoundException(`Media "${id}" not found.`);
    }
  }

  /**
   * Attempts to extract the storage path ({year}/{month}/{uuid}.ext)
   * from a Supabase Storage URL.
   */
  private extractStoragePath(url: string): string | null {
    // Supabase public URL pattern:
    // https://<project>.supabase.co/storage/v1/object/public/media-<tenantId>/<path>
    const marker = /\/storage\/v1\/object\/(?:public|sign)\/media-[^/]+\/(.+)/;
    const match = url.match(marker);
    return match ? match[1] : null;
  }
}
