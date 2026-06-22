import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TenantEntity } from '../../domain/entities/tenant.entity.js';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
} from '../ports/i-tenant-repository.port.js';

export interface UpdateTenantInput {
  slug?: string;
  name?: string;
  domain?: string | null;
  logoUrl?: string | null;
  languages?: string[];
  theme?: string | null;
}

@Injectable()
export class UpdateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string, input: UpdateTenantInput): Promise<TenantEntity> {
    const updated = await this.tenantRepository.update(id, input);
    if (!updated) {
      throw new NotFoundException(`Tenant with id "${id}" not found.`);
    }
    return updated;
  }
}
