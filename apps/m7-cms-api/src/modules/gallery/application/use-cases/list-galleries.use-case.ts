import { Inject, Injectable } from '@nestjs/common';
import type { GalleryEntity } from '../../domain/entities/gallery.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

@Injectable()
export class ListGalleriesUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(tenantId: string): Promise<GalleryEntity[]> {
    return this.galleryRepository.findAllGalleries(tenantId);
  }
}
