import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { tenantUsers } from '../../../../infrastructure/database/schema/index.js';
import type { IAuthPort, TenantUserRecord } from '../../application/ports/i-auth.port.js';
import { Role } from '../../domain/entities/user-context.entity.js';

@Injectable()
export class AuthDrizzleRepository implements IAuthPort {
  async findTenantUser(
    userId: string,
    tenantId: string,
  ): Promise<TenantUserRecord | null> {
    const rows = await db
      .select({ role: tenantUsers.role })
      .from(tenantUsers)
      .where(
        and(
          eq(tenantUsers.userId, userId),
          eq(tenantUsers.tenantId, tenantId),
        ),
      )
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return { role: rows[0].role as Role };
  }
}
