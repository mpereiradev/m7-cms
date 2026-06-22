import { Inject, Injectable } from '@nestjs/common';
import type { SocialPostEntity } from '../../domain/entities/social-post.entity.js';
import {
  SOCIAL_REPOSITORY,
  type ISocialRepository,
} from '../ports/i-social-repository.port.js';

export interface CreateSocialPostInput {
  tenantId: string;
  platform: string;
  url: string;
  title?: string | null;
  publishedAt?: Date | null;
  order?: number;
}

@Injectable()
export class CreateSocialPostUseCase {
  constructor(
    @Inject(SOCIAL_REPOSITORY)
    private readonly socialRepository: ISocialRepository,
  ) {}

  async execute(input: CreateSocialPostInput): Promise<SocialPostEntity> {
    return this.socialRepository.create(input);
  }
}
