import type { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findByTenantId(tenantId: string): Promise<TenantUserEntity[]>;

  findByTenantAndUserId(
    tenantId: string,
    userId: string,
  ): Promise<TenantUserEntity | null>;

  createUserAndAssociate(data: {
    tenantId: string;
    email: string;
    name: string;
    role: string;
  }): Promise<TenantUserEntity>;

  updateRole(
    tenantId: string,
    userId: string,
    role: string,
  ): Promise<TenantUserEntity | null>;

  remove(tenantId: string, userId: string): Promise<boolean>;
}
