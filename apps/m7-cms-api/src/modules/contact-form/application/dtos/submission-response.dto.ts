import type { SubmissionEntity } from '../../domain/entities/submission.entity.js';

export class SubmissionResponseDto {
  id!: string;
  tenantId!: string;
  name!: string;
  email!: string;
  subject!: string | null;
  message!: string;
  processed!: boolean;
  submittedAt!: string;

  static fromEntity(entity: SubmissionEntity): SubmissionResponseDto {
    const dto = new SubmissionResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.subject = entity.subject;
    dto.message = entity.message;
    dto.processed = entity.processed;
    dto.submittedAt = entity.submittedAt.toISOString();
    return dto;
  }
}
