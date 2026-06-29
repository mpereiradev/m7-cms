import { Inject, Injectable } from '@nestjs/common';
import type { GalleryEntity } from '../../domain/entities/gallery.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

export interface CreateGalleryInput {
  tenantId: string;
  slug?: string;
  title?: string;
  type?: string;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class CreateGalleryUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(input: CreateGalleryInput): Promise<GalleryEntity> {
    const slug =
      input.slug ||
      (input.title ? toSlug(input.title) : `gallery-${Date.now()}`);
    return this.galleryRepository.createGallery({
      tenantId: input.tenantId,
      slug,
      title: input.title,
      type: input.type,
    });
  }
}
