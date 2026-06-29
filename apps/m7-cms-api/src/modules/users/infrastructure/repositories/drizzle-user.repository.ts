import { Injectable, ConflictException } from '@nestjs/common';
import { eq, and, inArray } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import {
  tenantUsers,
  tenants,
  users,
} from '../../../../infrastructure/database/schema/index.js';
import type { IUserRepository } from '../../application/ports/i-user-repository.port.js';
import { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';
import { UserGlobalEntity } from '../../domain/entities/user-global.entity.js';

@Injectable()
export class DrizzleUserRepository implements IUserRepository {
  private toEntity(
    tu: typeof tenantUsers.$inferSelect,
    user: typeof users.$inferSelect,
  ): TenantUserEntity {
    return new TenantUserEntity({
      id: tu.id,
      tenantId: tu.tenantId,
      userId: tu.userId,
      role: tu.role,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      createdAt: tu.createdAt,
      updatedAt: tu.updatedAt,
    });
  }

  async findByTenantId(tenantId: string): Promise<TenantUserEntity[]> {
    const rows = await db
      .select({
        tu: tenantUsers,
        user: users,
      })
      .from(tenantUsers)
      .innerJoin(users, eq(tenantUsers.userId, users.id))
      .where(eq(tenantUsers.tenantId, tenantId));

    return rows.map((row) => this.toEntity(row.tu, row.user));
  }

  async findByTenantAndUserId(
    tenantId: string,
    userId: string,
  ): Promise<TenantUserEntity | null> {
    const rows = await db
      .select({
        tu: tenantUsers,
        user: users,
      })
      .from(tenantUsers)
      .innerJoin(users, eq(tenantUsers.userId, users.id))
      .where(
        and(eq(tenantUsers.tenantId, tenantId), eq(tenantUsers.userId, userId)),
      )
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return this.toEntity(rows[0].tu, rows[0].user);
  }

  async createUserAndAssociate(data: {
    tenantId: string;
    email: string;
    name: string;
    role: string;
  }): Promise<TenantUserEntity> {
    // Check if user already exists by email
    let userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    let user: typeof users.$inferSelect;

    if (userRows.length > 0) {
      user = userRows[0];
    } else {
      // Create user record
      const insertedUsers = await db
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
        })
        .returning();
      user = insertedUsers[0];
    }

    // Check if tenant-user association already exists
    const existingAssoc = await db
      .select()
      .from(tenantUsers)
      .where(
        and(
          eq(tenantUsers.tenantId, data.tenantId),
          eq(tenantUsers.userId, user.id),
        ),
      )
      .limit(1);

    if (existingAssoc.length > 0) {
      throw new ConflictException(
        `User "${data.email}" is already a member of this tenant.`,
      );
    }

    // Create tenant_users association
    const tuRows = await db
      .insert(tenantUsers)
      .values({
        tenantId: data.tenantId,
        userId: user.id,
        role: data.role as any,
      })
      .returning();

    return this.toEntity(tuRows[0], user);
  }

  async updateRole(
    tenantId: string,
    userId: string,
    role: string,
  ): Promise<TenantUserEntity | null> {
    const tuRows = await db
      .update(tenantUsers)
      .set({ role: role as any, updatedAt: new Date() })
      .where(
        and(eq(tenantUsers.tenantId, tenantId), eq(tenantUsers.userId, userId)),
      )
      .returning();

    if (tuRows.length === 0) {
      return null;
    }

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRows.length === 0) {
      return null;
    }

    return this.toEntity(tuRows[0], userRows[0]);
  }

  async createUserWithId(data: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: string;
  }): Promise<TenantUserEntity> {
    // Upsert user record using the Supabase Auth UUID
    let userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, data.id))
      .limit(1);

    let user: typeof users.$inferSelect;

    if (userRows.length > 0) {
      user = userRows[0];
    } else {
      const inserted = await db
        .insert(users)
        .values({ id: data.id, email: data.email, name: data.name })
        .returning();
      user = inserted[0];
    }

    // Check for duplicate association
    const existing = await db
      .select()
      .from(tenantUsers)
      .where(
        and(
          eq(tenantUsers.tenantId, data.tenantId),
          eq(tenantUsers.userId, user.id),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException(
        `Usuario "${data.email}" ja pertence a este tenant.`,
      );
    }

    const tuRows = await db
      .insert(tenantUsers)
      .values({
        tenantId: data.tenantId,
        userId: user.id,
        role: data.role as any,
      })
      .returning();

    return this.toEntity(tuRows[0], user);
  }

  async remove(tenantId: string, userId: string): Promise<boolean> {
    const deleted = await db
      .delete(tenantUsers)
      .where(
        and(eq(tenantUsers.tenantId, tenantId), eq(tenantUsers.userId, userId)),
      )
      .returning();

    return deleted.length > 0;
  }

  async findSuperAdminUserIds(): Promise<string[]> {
    const rows = await db
      .select({ userId: tenantUsers.userId })
      .from(tenantUsers)
      .where(eq(tenantUsers.role, 'super_admin'));

    const unique = [...new Set(rows.map((r) => r.userId))];
    return unique;
  }

  async findAllUsersWithTenants(): Promise<UserGlobalEntity[]> {
    const rows = await db
      .select({
        userId: users.id,
        email: users.email,
        name: users.name,
        photoUrl: users.photoUrl,
        tenantId: tenantUsers.tenantId,
        tenantName: tenants.name,
        tenantSlug: tenants.slug,
        role: tenantUsers.role,
      })
      .from(users)
      .leftJoin(tenantUsers, eq(tenantUsers.userId, users.id))
      .leftJoin(tenants, eq(tenants.id, tenantUsers.tenantId))
      .orderBy(users.name);

    const map = new Map<
      string,
      {
        userId: string;
        email: string;
        name: string;
        photoUrl: string | null;
        tenants: {
          tenantId: string;
          tenantName: string;
          tenantSlug: string;
          role: string;
        }[];
      }
    >();

    for (const row of rows) {
      if (!map.has(row.userId)) {
        map.set(row.userId, {
          userId: row.userId,
          email: row.email,
          name: row.name,
          photoUrl: row.photoUrl,
          tenants: [],
        });
      }
      if (row.tenantId && row.tenantName && row.tenantSlug && row.role) {
        map.get(row.userId)!.tenants.push({
          tenantId: row.tenantId,
          tenantName: row.tenantName,
          tenantSlug: row.tenantSlug,
          role: row.role,
        });
      }
    }

    return Array.from(map.values()).map((u) => new UserGlobalEntity(u));
  }

  async linkUsersToTenant(
    tenantId: string,
    userIds: string[],
    role: string,
  ): Promise<void> {
    if (userIds.length === 0) return;

    // Find which users are already linked to avoid duplicates
    const existing = await db
      .select({ userId: tenantUsers.userId })
      .from(tenantUsers)
      .where(
        and(
          eq(tenantUsers.tenantId, tenantId),
          inArray(tenantUsers.userId, userIds),
        ),
      );

    const alreadyLinked = new Set(existing.map((r) => r.userId));
    const toInsert = userIds.filter((id) => !alreadyLinked.has(id));

    if (toInsert.length === 0) return;

    await db.insert(tenantUsers).values(
      toInsert.map((userId) => ({
        tenantId,
        userId,
        role: role as any,
      })),
    );
  }
}
