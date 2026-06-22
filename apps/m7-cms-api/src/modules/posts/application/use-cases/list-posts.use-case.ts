import { Inject, Injectable } from '@nestjs/common';
import type { PostEntity } from '../../domain/entities/post.entity.js';
import {
  POST_REPOSITORY,
  type IPostRepository,
  type ListPostsFilters,
} from '../ports/i-post-repository.port.js';

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    tenantId: string,
    filters?: ListPostsFilters,
  ): Promise<PostEntity[]> {
    return this.postRepository.findAll(tenantId, filters);
  }
}
