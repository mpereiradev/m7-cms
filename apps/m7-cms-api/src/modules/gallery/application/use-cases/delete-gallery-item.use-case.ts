import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

export interface DeleteGalleryItemInput {
  tenantId: string;
  galleryId: string;
  itemId: string;
}

@Injectable()
export class DeleteGalleryItemUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(input: DeleteGalleryItemInput): Promise<void> {
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

    const deleted = await this.galleryRepository.deleteGalleryItem(
      input.galleryId,
      input.itemId,
    );
    if (!deleted) {
      throw new NotFoundException(
        `Gallery item with id "${input.itemId}" not found.`,
      );
    }
  }
}
