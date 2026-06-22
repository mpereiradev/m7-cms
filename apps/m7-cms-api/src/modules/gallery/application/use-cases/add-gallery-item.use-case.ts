import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { GalleryItemEntity } from '../../domain/entities/gallery-item.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

export interface AddGalleryItemInput {
  tenantId: string;
  galleryId: string;
  mediaId: string;
  order?: number;
  caption?: Record<string, string> | null;
}

@Injectable()
export class AddGalleryItemUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(input: AddGalleryItemInput): Promise<GalleryItemEntity> {
    // Verify gallery exists and belongs to tenant
    const gallery = await this.galleryRepository.findGalleryById(
      input.tenantId,
      input.galleryId,
    );
    if (!gallery) {
      throw new NotFoundException(
        `Gallery with id "${input.galleryId}" not found.`,
      );
    }

    return this.galleryRepository.addGalleryItem({
      galleryId: input.galleryId,
      mediaId: input.mediaId,
      order: input.order ?? 0,
      caption: input.caption,
    });
  }
}
