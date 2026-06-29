import { Inject, Injectable } from '@nestjs/common';
import type { TenantEntity } from '../../domain/entities/tenant.entity.js';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
} from '../ports/i-tenant-repository.port.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../users/application/ports/i-user-repository.port.js';

export interface CreateTenantInput {
  slug: string;
  name: string;
  domain?: string | null;
  logoUrl?: string | null;
  languages?: string[];
  theme?: string | null;
}

@Injectable()
export class CreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateTenantInput): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.create(input);

    const superAdminIds = await this.userRepository.findSuperAdminUserIds();
    await this.userRepository.linkUsersToTenant(
      tenant.id,
      superAdminIds,
      'super_admin',
    );

    return tenant;
  }
}
