import { Inject, Injectable } from '@nestjs/common';
import type { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../ports/i-user-repository.port.js';

@Injectable()
export class ListTenantUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(tenantId: string): Promise<TenantUserEntity[]> {
    return this.userRepository.findByTenantId(tenantId);
  }
}
