import { Inject, Injectable } from '@nestjs/common';
import type { TagEntity } from '../../domain/entities/post.entity.js';
import {
  TAG_REPOSITORY,
  type ITagRepository,
} from '../ports/i-post-repository.port.js';

export interface CreateTagInput {
  tenantId: string;
  slug: string;
}

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(input: CreateTagInput): Promise<TagEntity> {
    return this.tagRepository.create(input);
  }
}
