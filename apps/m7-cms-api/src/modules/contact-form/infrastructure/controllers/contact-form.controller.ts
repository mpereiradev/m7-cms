import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Headers,
  UseGuards,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { SubmitContactFormUseCase } from '../../application/use-cases/submit-contact-form.use-case.js';
import { ListSubmissionsUseCase } from '../../application/use-cases/list-submissions.use-case.js';
import { MarkProcessedUseCase } from '../../application/use-cases/mark-processed.use-case.js';
import { ContactFormDto } from '../../application/dtos/contact-form.dto.js';
import { SubmissionResponseDto } from '../../application/dtos/submission-response.dto.js';

@Controller('api/v1/public/contact')
export class PublicContactFormController {
  constructor(
    private readonly submitContactFormUseCase: SubmitContactFormUseCase,
  ) {}

  @Post()
  async submit(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: ContactFormDto,
  ): Promise<{ data: SubmissionResponseDto }> {
    if (!tenantId) {
      throw new BadRequestException('X-Tenant-ID header is required.');
    }
    const submission = await this.submitContactFormUseCase.execute({
      tenantId,
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
    });
    return { data: SubmissionResponseDto.fromEntity(submission) };
  }
}

@Controller('api/v1/contact')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactFormController {
  constructor(
    private readonly listSubmissionsUseCase: ListSubmissionsUseCase,
    private readonly markProcessedUseCase: MarkProcessedUseCase,
  ) {}

  @Get('submissions')
  @Roles(Role.ADMIN, Role.EDITOR)
  async listSubmissions(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: SubmissionResponseDto[] }> {
    const submissions = await this.listSubmissionsUseCase.execute(
      user.tenantId,
    );
    return { data: submissions.map(SubmissionResponseDto.fromEntity) };
  }

  @Put('submissions/:id/processed')
  @Roles(Role.ADMIN, Role.EDITOR)
  async markProcessed(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: SubmissionResponseDto }> {
    const submission = await this.markProcessedUseCase.execute(
      user.tenantId,
      id,
    );
    return { data: SubmissionResponseDto.fromEntity(submission) };
  }
}
