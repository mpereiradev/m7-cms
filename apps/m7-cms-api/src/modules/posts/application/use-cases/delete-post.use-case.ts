import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  POST_REPOSITORY,
  type IPostRepository,
} from '../ports/i-post-repository.port.js';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<void> {
    const deleted = await this.postRepository.delete(tenantId, id);
    if (!deleted) {
      throw new NotFoundException('Post not found.');
    }
  }
}
