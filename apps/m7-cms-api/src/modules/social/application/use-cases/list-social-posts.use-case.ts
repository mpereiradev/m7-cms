import { Inject, Injectable } from '@nestjs/common';
import type { SocialPostEntity } from '../../domain/entities/social-post.entity.js';
import {
  SOCIAL_REPOSITORY,
  type ISocialRepository,
} from '../ports/i-social-repository.port.js';

@Injectable()
export class ListSocialPostsUseCase {
  constructor(
    @Inject(SOCIAL_REPOSITORY)
    private readonly socialRepository: ISocialRepository,
  ) {}

  async execute(tenantId: string): Promise<SocialPostEntity[]> {
    return this.socialRepository.findAll(tenantId);
  }
}
