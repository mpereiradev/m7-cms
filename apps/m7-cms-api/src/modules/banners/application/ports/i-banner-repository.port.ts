import type { BannerEntity } from '../../domain/entities/banner.entity.js';

export const BANNER_REPOSITORY = Symbol('BANNER_REPOSITORY');

export interface IBannerRepository {
  findById(tenantId: string, id: string): Promise<BannerEntity | null>;
  findAll(tenantId: string): Promise<BannerEntity[]>;
  findActive(tenantId: string): Promise<BannerEntity[]>;
  create(data: {
    tenantId: string;
    title?: string | null;
    mediaId?: string | null;
    ctaLabel?: string | null;
    linkUrl?: string | null;
    displayStart?: Date | null;
    displayEnd?: Date | null;
    order?: number;
  }): Promise<BannerEntity>;
  update(
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
  ): Promise<BannerEntity | null>;
  delete(tenantId: string, id: string): Promise<boolean>;
}
