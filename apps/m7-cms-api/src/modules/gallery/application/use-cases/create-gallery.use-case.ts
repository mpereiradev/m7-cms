import { Inject, Injectable } from '@nestjs/common';
import type { GalleryEntity } from '../../domain/entities/gallery.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

export interface CreateGalleryInput {
  tenantId: string;
  slug: string;
}

@Injectable()
export class CreateGalleryUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(input: CreateGalleryInput): Promise<GalleryEntity> {
    return this.galleryRepository.createGallery(input);
  }
}
