import { Injectable, Inject } from '@nestjs/common';
import {
  BANNER_REPOSITORY,
  type IBannerRepository,
} from '../ports/i-banner-repository.port.js';
import type { BannerEntity } from '../../domain/entities/banner.entity.js';

@Injectable()
export class CreateBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY) private readonly repo: IBannerRepository,
  ) {}

  async execute(data: {
    tenantId: string;
    title?: string | null;
    mediaId?: string | null;
    ctaLabel?: string | null;
    linkUrl?: string | null;
    displayStart?: Date | null;
    displayEnd?: Date | null;
    order?: number;
  }): Promise<BannerEntity> {
    return this.repo.create(data);
  }
}
