import { Injectable, Inject } from '@nestjs/common';
import {
  BANNER_REPOSITORY,
  type IBannerRepository,
} from '../ports/i-banner-repository.port.js';
import type { BannerEntity } from '../../domain/entities/banner.entity.js';

@Injectable()
export class ListBannersUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY) private readonly repo: IBannerRepository,
  ) {}

  async execute(tenantId: string): Promise<BannerEntity[]> {
    return this.repo.findAll(tenantId);
  }
}
