import { Inject, Injectable } from '@nestjs/common';
import type { PostEntity } from '../../domain/entities/post.entity.js';
import {
  POST_REPOSITORY,
  type IPostRepository,
} from '../ports/i-post-repository.port.js';

export interface CreatePostInput {
  tenantId: string;
  slug: string;
  status?: string;
  publishedAt?: Date | null;
  authorId: string | null;
  coverMediaId?: string | null;
  categoryIds?: string[];
  tagIds?: string[];
  translations: {
    languageCode: string;
    title: string;
    summary?: string | null;
    content?: unknown;
    seoTitle?: string | null;
    seoDescription?: string | null;
  }[];
}

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(input: CreatePostInput): Promise<PostEntity> {
    return this.postRepository.create(input);
  }
}
