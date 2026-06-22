import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PREVIEW_TOKEN_SERVICE } from './generate-preview-token.use-case.js';

export interface PreviewTokenData {
  type: string;
  tenantId: string;
  pageId?: string;
}

export interface IPreviewTokenVerifier {
  verify(token: string): Promise<PreviewTokenData>;
}

@Injectable()
export class ValidatePreviewTokenUseCase {
  constructor(
    @Inject(PREVIEW_TOKEN_SERVICE)
    private readonly previewTokenService: IPreviewTokenVerifier,
  ) {}

  async execute(token: string): Promise<PreviewTokenData> {
    try {
      return await this.previewTokenService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired preview token.');
    }
  }
}
