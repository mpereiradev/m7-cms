import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PostEntity } from '../../domain/entities/post.entity.js';
import {
  POST_REPOSITORY,
  type IPostRepository,
} from '../ports/i-post-repository.port.js';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(tenantId, id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }

  async executeBySlug(tenantId: string, slug: string): Promise<PostEntity> {
    const post = await this.postRepository.findBySlug(tenantId, slug);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }
}
