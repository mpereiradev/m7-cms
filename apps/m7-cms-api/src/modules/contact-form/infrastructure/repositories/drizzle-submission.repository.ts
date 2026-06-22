import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { contactFormSubmissions } from '../../../../infrastructure/database/schema/index.js';
import type {
  ISubmissionRepository,
  CreateSubmissionData,
} from '../../application/ports/i-submission-repository.port.js';
import { SubmissionEntity } from '../../domain/entities/submission.entity.js';

@Injectable()
export class DrizzleSubmissionRepository implements ISubmissionRepository {
  private toEntity(
    row: typeof contactFormSubmissions.$inferSelect,
  ): SubmissionEntity {
    return new SubmissionEntity({
      id: row.id,
      tenantId: row.tenantId,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      processed: row.processed,
      submittedAt: row.submittedAt,
    });
  }

  async findAllByTenant(tenantId: string): Promise<SubmissionEntity[]> {
    const rows = await db
      .select()
      .from(contactFormSubmissions)
      .where(eq(contactFormSubmissions.tenantId, tenantId));

    return rows.map((row) => this.toEntity(row));
  }

  async findById(
    tenantId: string,
    id: string,
  ): Promise<SubmissionEntity | null> {
    const rows = await db
      .select()
      .from(contactFormSubmissions)
      .where(
        and(
          eq(contactFormSubmissions.tenantId, tenantId),
          eq(contactFormSubmissions.id, id),
        ),
      )
      .limit(1);

    if (rows.length === 0) return null;
    return this.toEntity(rows[0]);
  }

  async create(data: CreateSubmissionData): Promise<SubmissionEntity> {
    const [row] = await db
      .insert(contactFormSubmissions)
      .values({
        tenantId: data.tenantId,
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        message: data.message,
      })
      .returning();

    return this.toEntity(row);
  }

  async markProcessed(
    tenantId: string,
    id: string,
  ): Promise<SubmissionEntity | null> {
    const rows = await db
      .update(contactFormSubmissions)
      .set({ processed: true })
      .where(
        and(
          eq(contactFormSubmissions.tenantId, tenantId),
          eq(contactFormSubmissions.id, id),
        ),
      )
      .returning();

    if (rows.length === 0) return null;
    return this.toEntity(rows[0]);
  }
}
