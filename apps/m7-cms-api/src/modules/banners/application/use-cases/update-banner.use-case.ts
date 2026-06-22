import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  BANNER_REPOSITORY,
  type IBannerRepository,
} from '../ports/i-banner-repository.port.js';
import type { BannerEntity } from '../../domain/entities/banner.entity.js';

@Injectable()
export class UpdateBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY) private readonly repo: IBannerRepository,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    data: {
      title?: string | null;
      mediaId?: string | null;
      ctaLabel?: string | null;
      linkUrl?: string | null;
      displayStart?: Date | null;
      displayEnd?: Date | null;
      order?: number;
    },
  ): Promise<BannerEntity> {
    const banner = await this.repo.update(tenantId, id, data);
    if (!banner) throw new NotFoundException('Banner not found.');
    return banner;
  }
}
