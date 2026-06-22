import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  BANNER_REPOSITORY,
  type IBannerRepository,
} from '../ports/i-banner-repository.port.js';

@Injectable()
export class DeleteBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY) private readonly repo: IBannerRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<void> {
    const deleted = await this.repo.delete(tenantId, id);
    if (!deleted) throw new NotFoundException('Banner not found.');
  }
}
