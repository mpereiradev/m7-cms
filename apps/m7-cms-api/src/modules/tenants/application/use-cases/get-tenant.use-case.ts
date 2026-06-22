import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TenantEntity } from '../../domain/entities/tenant.entity.js';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
} from '../ports/i-tenant-repository.port.js';

@Injectable()
export class GetTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with id "${id}" not found.`);
    }
    return tenant;
  }
}
