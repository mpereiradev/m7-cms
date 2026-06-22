import { Inject, Injectable } from '@nestjs/common';
import type { TenantEntity } from '../../domain/entities/tenant.entity.js';
import {
  TENANT_REPOSITORY,
  type ITenantRepository,
} from '../ports/i-tenant-repository.port.js';

@Injectable()
export class ListTenantsUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(): Promise<TenantEntity[]> {
    return this.tenantRepository.findAll();
  }
}
