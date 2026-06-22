import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SOCIAL_REPOSITORY,
  type ISocialRepository,
} from '../ports/i-social-repository.port.js';

@Injectable()
export class DeleteSocialPostUseCase {
  constructor(
    @Inject(SOCIAL_REPOSITORY)
    private readonly socialRepository: ISocialRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<void> {
    const deleted = await this.socialRepository.delete(tenantId, id);
    if (!deleted) {
      throw new NotFoundException(`Social post with id "${id}" not found.`);
    }
  }
}
