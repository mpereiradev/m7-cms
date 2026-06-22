import { Inject, Injectable } from '@nestjs/common';
import type { VideoEntity } from '../../domain/entities/video.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

export interface ReorderVideosInput {
  tenantId: string;
  ids: string[];
}

@Injectable()
export class ReorderVideosUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(input: ReorderVideosInput): Promise<VideoEntity[]> {
    return this.galleryRepository.reorderVideos(input.tenantId, input.ids);
  }
}
