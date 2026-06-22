import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PostEntity } from '../../domain/entities/post.entity.js';
import {
  POST_REPOSITORY,
  type IPostRepository,
} from '../ports/i-post-repository.port.js';

@Injectable()
export class SchedulePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    publishAt: Date,
  ): Promise<PostEntity> {
    const post = await this.postRepository.update(tenantId, id, {
      status: 'published',
      publishedAt: publishAt,
    });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }
}
