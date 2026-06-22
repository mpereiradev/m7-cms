import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../ports/i-user-repository.port.js';

@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    tenantId: string,
    userId: string,
    role: string,
  ): Promise<TenantUserEntity> {
    const updated = await this.userRepository.updateRole(tenantId, userId, role);
    if (!updated) {
      throw new NotFoundException(
        `User "${userId}" not found in tenant "${tenantId}".`,
      );
    }
    return updated;
  }
}
