import { Inject, Injectable } from '@nestjs/common';
import type { TagEntity } from '../../domain/entities/post.entity.js';
import {
  TAG_REPOSITORY,
  type ITagRepository,
} from '../ports/i-post-repository.port.js';

@Injectable()
export class ListTagsUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(tenantId: string): Promise<TagEntity[]> {
    return this.tagRepository.findAll(tenantId);
  }
}
