import { Inject, Injectable } from '@nestjs/common';
import type { MediaEntity } from '../../domain/entities/media.entity.js';
import {
  MEDIA_REPOSITORY,
  type IMediaRepository,
} from '../ports/i-media-repository.port.js';

@Injectable()
export class ListMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: IMediaRepository,
  ) {}

  async execute(tenantId: string): Promise<MediaEntity[]> {
    return this.mediaRepository.findAllByTenant(tenantId);
  }
}
