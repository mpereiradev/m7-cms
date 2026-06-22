import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { GalleryItemEntity } from '../../domain/entities/gallery-item.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

export interface ReorderGalleryItemsInput {
  tenantId: string;
  galleryId: string;
  ids: string[];
}

@Injectable()
export class ReorderGalleryItemsUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(input: ReorderGalleryItemsInput): Promise<GalleryItemEntity[]> {
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

    return this.galleryRepository.reorderGalleryItems(
      input.galleryId,
      input.ids,
    );
  }
}
