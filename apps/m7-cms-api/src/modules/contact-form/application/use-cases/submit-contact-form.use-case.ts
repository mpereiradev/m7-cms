import { Inject, Injectable } from '@nestjs/common';
import type { SubmissionEntity } from '../../domain/entities/submission.entity.js';
import {
  SUBMISSION_REPOSITORY,
  type ISubmissionRepository,
} from '../ports/i-submission-repository.port.js';
import {
  WEBHOOK_SERVICE,
  type IWebhookService,
} from '../ports/i-webhook.port.js';

export const EMAIL_NOTIFICATION_SERVICE = Symbol('EMAIL_NOTIFICATION_SERVICE');

export interface IEmailNotificationService {
  sendContactNotification(
    toEmail: string,
    submission: {
      name: string;
      email: string;
      subject: string | null;
      message: string;
    },
  ): Promise<void>;
}

export const SETTINGS_READER = Symbol('SETTINGS_READER');

export interface ISettingsReader {
  getValue(tenantId: string, key: string): Promise<unknown | null>;
}

export interface SubmitContactFormInput {
  tenantId: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

@Injectable()
export class SubmitContactFormUseCase {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: ISubmissionRepository,
    @Inject(EMAIL_NOTIFICATION_SERVICE)
    private readonly emailNotificationService: IEmailNotificationService,
    @Inject(WEBHOOK_SERVICE)
    private readonly webhookService: IWebhookService,
    @Inject(SETTINGS_READER)
    private readonly settingsReader: ISettingsReader,
  ) {}

  async execute(input: SubmitContactFormInput): Promise<SubmissionEntity> {
    // Insert submission
    const submission = await this.submissionRepository.create({
      tenantId: input.tenantId,
      name: input.name,
      email: input.email,
      subject: input.subject ?? null,
      message: input.message,
    });

    // Send email notification (best-effort)
    try {
      const notificationEmail = (await this.settingsReader.getValue(
        input.tenantId,
        'contact.notification_email',
      )) as string | null;

      if (notificationEmail) {
        await this.emailNotificationService.sendContactNotification(
          notificationEmail,
          {
            name: input.name,
            email: input.email,
            subject: input.subject ?? null,
            message: input.message,
          },
        );
      }
    } catch {
      console.error(
        `Failed to send contact notification for tenant ${input.tenantId}`,
      );
    }

    // Fire webhook (best-effort)
    try {
      const webhookUrl = (await this.settingsReader.getValue(
        input.tenantId,
        'contact.webhook_url',
      )) as string | null;

      if (webhookUrl) {
        await this.webhookService.fire(webhookUrl, {
          event: 'contact_form.submitted',
          tenantId: input.tenantId,
          data: {
            id: submission.id,
            name: input.name,
            email: input.email,
            subject: input.subject ?? null,
            message: input.message,
            submittedAt: submission.submittedAt.toISOString(),
          },
        });
      }
    } catch {
      console.error(`Failed to fire webhook for tenant ${input.tenantId}`);
    }

    return submission;
  }
}
