import { Injectable, ConflictException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import {
  tenantUsers,
  users,
} from '../../../../infrastructure/database/schema/index.js';
import type { IUserRepository } from '../../application/ports/i-user-repository.port.js';
import { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';

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
        and(
          eq(tenantUsers.tenantId, tenantId),
          eq(tenantUsers.userId, userId),
        ),
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
        and(
          eq(tenantUsers.tenantId, tenantId),
          eq(tenantUsers.userId, userId),
        ),
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

  async remove(tenantId: string, userId: string): Promise<boolean> {
    const deleted = await db
      .delete(tenantUsers)
      .where(
        and(
          eq(tenantUsers.tenantId, tenantId),
          eq(tenantUsers.userId, userId),
        ),
      )
      .returning();

    return deleted.length > 0;
  }
}
