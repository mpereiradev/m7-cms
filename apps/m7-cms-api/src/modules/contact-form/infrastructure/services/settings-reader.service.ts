import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { settings } from '../../../../infrastructure/database/schema/index.js';
import type { ISettingsReader } from '../../application/use-cases/submit-contact-form.use-case.js';

@Injectable()
export class SettingsReaderService implements ISettingsReader {
  async getValue(tenantId: string, key: string): Promise<unknown | null> {
    const rows = await db
      .select()
      .from(settings)
      .where(and(eq(settings.tenantId, tenantId), eq(settings.key, key)))
      .limit(1);

    if (rows.length === 0) return null;
    return rows[0].value;
  }
}
