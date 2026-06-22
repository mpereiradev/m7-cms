import type { SocialPostEntity } from '../../domain/entities/social-post.entity.js';

export const SOCIAL_REPOSITORY = Symbol('SOCIAL_REPOSITORY');

export interface ISocialRepository {
  findById(tenantId: string, id: string): Promise<SocialPostEntity | null>;
  findAll(tenantId: string): Promise<SocialPostEntity[]>;
  create(data: {
    tenantId: string;
    platform: string;
    url: string;
    title?: string | null;
    publishedAt?: Date | null;
    order?: number;
  }): Promise<SocialPostEntity>;
  update(
    tenantId: string,
    id: string,
    data: {
      platform?: string;
      url?: string;
      title?: string | null;
      publishedAt?: Date | null;
      order?: number;
    },
  ): Promise<SocialPostEntity | null>;
  delete(tenantId: string, id: string): Promise<boolean>;
  reorder(tenantId: string, ids: string[]): Promise<SocialPostEntity[]>;
}
