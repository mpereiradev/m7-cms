import { Inject, Injectable } from '@nestjs/common';
import type { VideoEntity } from '../../domain/entities/video.entity.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../ports/i-gallery-repository.port.js';

@Injectable()
export class ListVideosUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  async execute(tenantId: string): Promise<VideoEntity[]> {
    return this.galleryRepository.findAllVideos(tenantId);
  }
}
