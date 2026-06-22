import type { SubmissionEntity } from '../../domain/entities/submission.entity.js';

export const SUBMISSION_REPOSITORY = Symbol('SUBMISSION_REPOSITORY');

export interface CreateSubmissionData {
  tenantId: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

export interface ISubmissionRepository {
  findAllByTenant(tenantId: string): Promise<SubmissionEntity[]>;
  findById(tenantId: string, id: string): Promise<SubmissionEntity | null>;
  create(data: CreateSubmissionData): Promise<SubmissionEntity>;
  markProcessed(tenantId: string, id: string): Promise<SubmissionEntity | null>;
}
