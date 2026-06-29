import type { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';
import type { UserGlobalEntity } from '../../domain/entities/user-global.entity.js';

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

  createUserWithId(data: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: string;
  }): Promise<TenantUserEntity>;

  updateRole(
    tenantId: string,
    userId: string,
    role: string,
  ): Promise<TenantUserEntity | null>;

  remove(tenantId: string, userId: string): Promise<boolean>;

  findSuperAdminUserIds(): Promise<string[]>;

  linkUsersToTenant(
    tenantId: string,
    userIds: string[],
    role: string,
  ): Promise<void>;

  findAllUsersWithTenants(): Promise<UserGlobalEntity[]>;
}
