import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { SocialPostEntity } from '../../domain/entities/social-post.entity.js';
import {
  SOCIAL_REPOSITORY,
  type ISocialRepository,
} from '../ports/i-social-repository.port.js';

export interface UpdateSocialPostInput {
  platform?: string;
  url?: string;
  title?: string | null;
  publishedAt?: Date | null;
  order?: number;
}

@Injectable()
export class UpdateSocialPostUseCase {
  constructor(
    @Inject(SOCIAL_REPOSITORY)
    private readonly socialRepository: ISocialRepository,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    input: UpdateSocialPostInput,
  ): Promise<SocialPostEntity> {
    const updated = await this.socialRepository.update(tenantId, id, input);
    if (!updated) {
      throw new NotFoundException(`Social post with id "${id}" not found.`);
    }
    return updated;
  }
}
