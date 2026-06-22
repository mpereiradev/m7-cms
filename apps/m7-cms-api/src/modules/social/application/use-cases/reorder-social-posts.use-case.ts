import { Inject, Injectable } from '@nestjs/common';
import type { SocialPostEntity } from '../../domain/entities/social-post.entity.js';
import {
  SOCIAL_REPOSITORY,
  type ISocialRepository,
} from '../ports/i-social-repository.port.js';

export interface ReorderSocialPostsInput {
  tenantId: string;
  ids: string[];
}

@Injectable()
export class ReorderSocialPostsUseCase {
  constructor(
    @Inject(SOCIAL_REPOSITORY)
    private readonly socialRepository: ISocialRepository,
  ) {}

  async execute(input: ReorderSocialPostsInput): Promise<SocialPostEntity[]> {
    return this.socialRepository.reorder(input.tenantId, input.ids);
  }
}
