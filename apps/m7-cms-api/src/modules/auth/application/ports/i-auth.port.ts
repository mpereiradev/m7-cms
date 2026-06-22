import { Role } from '../../domain/entities/user-context.entity.js';

export interface TenantUserRecord {
  role: Role;
}

export interface IAuthPort {
  /**
   * Find the tenant-user association for a given user and tenant.
   * Returns the role if found, or null if the user has no access to the tenant.
   */
  findTenantUser(
    userId: string,
    tenantId: string,
  ): Promise<TenantUserRecord | null>;
}

export const AUTH_PORT = Symbol('AUTH_PORT');
