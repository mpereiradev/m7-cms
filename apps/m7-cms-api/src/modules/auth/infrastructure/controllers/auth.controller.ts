import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from '../decorators/roles.decorator.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { Role, UserContext } from '../../domain/entities/user-context.entity.js';
import { GeneratePreviewTokenUseCase } from '../../application/use-cases/generate-preview-token.use-case.js';
import { CreatePreviewTokenDto, PreviewTokenResponseDto } from '../../application/dtos/preview-token.dto.js';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly generatePreviewTokenUseCase: GeneratePreviewTokenUseCase,
  ) {}

  @Post('preview-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createPreviewToken(
    @CurrentUser() user: UserContext,
    @Body() dto: CreatePreviewTokenDto,
  ): Promise<PreviewTokenResponseDto> {
    const result = await this.generatePreviewTokenUseCase.execute({
      tenantId: user.tenantId,
      pageId: dto.pageId,
    });

    return result;
  }
}
