import { Inject, Injectable } from '@nestjs/common';
import type { TenantEntity } from '../../domain/entities/tenant.entity.js';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
} from '../ports/i-tenant-repository.port.js';

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
  ) {}

  async execute(input: CreateTenantInput): Promise<TenantEntity> {
    return this.tenantRepository.create(input);
  }
}
