import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

import { SUBMISSION_REPOSITORY } from '../application/ports/i-submission-repository.port.js';
import { WEBHOOK_SERVICE } from '../application/ports/i-webhook.port.js';
import {
  EMAIL_NOTIFICATION_SERVICE,
  SETTINGS_READER,
} from '../application/use-cases/submit-contact-form.use-case.js';

import { SubmitContactFormUseCase } from '../application/use-cases/submit-contact-form.use-case.js';
import { ListSubmissionsUseCase } from '../application/use-cases/list-submissions.use-case.js';
import { MarkProcessedUseCase } from '../application/use-cases/mark-processed.use-case.js';

import { DrizzleSubmissionRepository } from './repositories/drizzle-submission.repository.js';
import { EmailNotificationService } from './services/email-notification.service.js';
import { SettingsReaderService } from './services/settings-reader.service.js';
import { WebhookService } from './services/webhook.service.js';
import { ContactFormController } from './controllers/contact-form.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [ContactFormController],
  providers: [
    { provide: SUBMISSION_REPOSITORY, useClass: DrizzleSubmissionRepository },
    { provide: WEBHOOK_SERVICE, useClass: WebhookService },
    { provide: EMAIL_NOTIFICATION_SERVICE, useClass: EmailNotificationService },
    { provide: SETTINGS_READER, useClass: SettingsReaderService },

    SubmitContactFormUseCase,
    ListSubmissionsUseCase,
    MarkProcessedUseCase,
  ],
  exports: [SUBMISSION_REPOSITORY],
})
export class ContactFormModule {}
