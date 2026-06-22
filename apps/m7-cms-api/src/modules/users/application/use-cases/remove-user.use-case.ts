import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../ports/i-user-repository.port.js';

@Injectable()
export class RemoveUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(tenantId: string, userId: string): Promise<void> {
    const removed = await this.userRepository.remove(tenantId, userId);
    if (!removed) {
      throw new NotFoundException(
        `User "${userId}" not found in tenant "${tenantId}".`,
      );
    }
  }
}
