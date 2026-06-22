import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { eq } from 'drizzle-orm';
import { JwtOnlyGuard } from '../../../auth/infrastructure/auth.module.js';
import { db } from '../../../../infrastructure/database/db.js';
import {
  tenantUsers,
  tenants,
  users,
} from '../../../../infrastructure/database/schema/index.js';

@Controller('api/v1/users/me')
@UseGuards(JwtOnlyGuard)
export class MeController {
  @Get()
  async getMe(@Req() req: Request) {
    const jwtPayload = (req as any).user;
    const userId = jwtPayload.sub;

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const tenantRows = await db
      .select({
        tenantId: tenants.id,
        tenantName: tenants.name,
        tenantSlug: tenants.slug,
        role: tenantUsers.role,
      })
      .from(tenantUsers)
      .innerJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
      .where(eq(tenantUsers.userId, userId));

    const user = userRows[0];
    const tenantList = tenantRows.map((row) => ({
      id: row.tenantId,
      name: row.tenantName,
      slug: row.tenantSlug,
      role: row.role,
    }));

    return {
      id: user?.id ?? userId,
      email: user?.email ?? jwtPayload.email,
      fullName: user?.name ?? null,
      avatarUrl: user?.photoUrl ?? null,
      role: tenantList[0]?.role ?? 'viewer',
      tenantId: tenantList.length === 1 ? tenantList[0].id : null,
      tenants: tenantList,
    };
  }

  @Get('tenants')
  async getMyTenants(@Req() req: Request) {
    const jwtPayload = (req as any).user;
    const userId = jwtPayload.sub;

    const rows = await db
      .select({
        tenantId: tenants.id,
        tenantName: tenants.name,
        tenantSlug: tenants.slug,
        tenantDomain: tenants.domain,
        role: tenantUsers.role,
      })
      .from(tenantUsers)
      .innerJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
      .where(eq(tenantUsers.userId, userId));

    return {
      data: rows.map((row) => ({
        id: row.tenantId,
        name: row.tenantName,
        slug: row.tenantSlug,
        domain: row.tenantDomain,
        role: row.role,
      })),
    };
  }
}
