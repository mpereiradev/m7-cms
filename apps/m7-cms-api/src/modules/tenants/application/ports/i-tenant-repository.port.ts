import type { TenantEntity } from '../../domain/entities/tenant.entity.js';

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface ITenantRepository {
  findById(id: string): Promise<TenantEntity | null>;
  findAll(): Promise<TenantEntity[]>;
  create(data: {
    slug: string;
    name: string;
    domain?: string | null;
    logoUrl?: string | null;
    languages?: string[];
    theme?: string | null;
  }): Promise<TenantEntity>;
  update(
    id: string,
    data: {
      slug?: string;
      name?: string;
      domain?: string | null;
      logoUrl?: string | null;
      languages?: string[];
      theme?: string | null;
    },
  ): Promise<TenantEntity | null>;
}
