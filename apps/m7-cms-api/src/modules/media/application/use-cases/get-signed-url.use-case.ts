import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MEDIA_REPOSITORY,
  type IMediaRepository,
} from '../ports/i-media-repository.port.js';
import { STORAGE_PORT, type IStoragePort } from '../ports/i-storage.port.js';

@Injectable()
export class GetSignedUrlUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: IMediaRepository,
    @Inject(STORAGE_PORT)
    private readonly storage: IStoragePort,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    expiresInSeconds = 3600,
  ): Promise<{ signedUrl: string }> {
    const existing = await this.mediaRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException(`Media "${id}" not found.`);
    }

    const storagePath = this.extractStoragePath(existing.url);
    if (!storagePath) {
      throw new NotFoundException(
        'Could not resolve storage path for this media.',
      );
    }

    const signedUrl = await this.storage.getSignedUrl(
      tenantId,
      storagePath,
      expiresInSeconds,
    );

    return { signedUrl };
  }

  private extractStoragePath(url: string): string | null {
    const marker = /\/storage\/v1\/object\/(?:public|sign)\/media-[^/]+\/(.+)/;
    const match = url.match(marker);
    return match ? match[1] : null;
  }
}
