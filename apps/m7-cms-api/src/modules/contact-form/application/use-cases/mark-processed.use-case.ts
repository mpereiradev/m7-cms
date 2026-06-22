import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { SubmissionEntity } from '../../domain/entities/submission.entity.js';
import {
  SUBMISSION_REPOSITORY,
  type ISubmissionRepository,
} from '../ports/i-submission-repository.port.js';

@Injectable()
export class MarkProcessedUseCase {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: ISubmissionRepository,
  ) {}

  async execute(
    tenantId: string,
    submissionId: string,
  ): Promise<SubmissionEntity> {
    const submission = await this.submissionRepository.markProcessed(
      tenantId,
      submissionId,
    );
    if (!submission) {
      throw new NotFoundException(`Submission "${submissionId}" not found.`);
    }
    return submission;
  }
}
