import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ValidatePreviewTokenUseCase } from '../../application/use-cases/validate-preview-token.use-case.js';

@Injectable()
export class PreviewTokenGuard implements CanActivate {
  constructor(
    private readonly validatePreviewTokenUseCase: ValidatePreviewTokenUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.query['preview_token'] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Preview token is required.');
    }

    const data = await this.validatePreviewTokenUseCase.execute(token);

    // Attach preview data to request for downstream use
    (request as any).previewData = data;

    return true;
  }
}
