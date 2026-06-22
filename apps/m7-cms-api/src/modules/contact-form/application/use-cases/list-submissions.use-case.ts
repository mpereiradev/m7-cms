import { Inject, Injectable } from '@nestjs/common';
import type { SubmissionEntity } from '../../domain/entities/submission.entity.js';
import {
  SUBMISSION_REPOSITORY,
  type ISubmissionRepository,
} from '../ports/i-submission-repository.port.js';

@Injectable()
export class ListSubmissionsUseCase {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: ISubmissionRepository,
  ) {}

  async execute(tenantId: string): Promise<SubmissionEntity[]> {
    return this.submissionRepository.findAllByTenant(tenantId);
  }
}
