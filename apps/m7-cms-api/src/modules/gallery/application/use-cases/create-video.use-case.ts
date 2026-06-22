import { Inject, Injectable } from '@nestjs/common';
import type { VideoEntity } from '../../domain/entities/video.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

export interface CreateVideoInput {
  tenantId: string;
  sourceType: string;
  url: string;
  title: string;
  description?: Record<string, string> | null;
  thumbnailMediaId?: string | null;
  order?: number;
}

@Injectable()
export class CreateVideoUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(input: CreateVideoInput): Promise<VideoEntity> {
    return this.galleryRepository.createVideo(input);
  }
}
