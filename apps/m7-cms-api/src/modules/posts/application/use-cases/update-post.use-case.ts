import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PostEntity } from '../../domain/entities/post.entity.js';
import {
  POST_REPOSITORY,
  type IPostRepository,
} from '../ports/i-post-repository.port.js';

export interface UpdatePostInput {
  slug?: string;
  categoryIds?: string[];
  tagIds?: string[];
  translations?: {
    languageCode: string;
    title: string;
    summary?: string | null;
    content?: unknown;
  }[];
}

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    input: UpdatePostInput,
  ): Promise<PostEntity> {
    const post = await this.postRepository.update(tenantId, id, input);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }
}
