import { Injectable, Inject } from '@nestjs/common';

export interface PreviewTokenPayload {
  tenantId: string;
  pageId?: string;
}

export interface PreviewTokenResult {
  token: string;
  expiresAt: string;
}

export interface IPreviewTokenService {
  sign(payload: PreviewTokenPayload): Promise<PreviewTokenResult>;
}

export const PREVIEW_TOKEN_SERVICE = Symbol('PREVIEW_TOKEN_SERVICE');

@Injectable()
export class GeneratePreviewTokenUseCase {
  constructor(
    @Inject(PREVIEW_TOKEN_SERVICE)
    private readonly previewTokenService: IPreviewTokenService,
  ) {}

  async execute(payload: PreviewTokenPayload): Promise<PreviewTokenResult> {
    return this.previewTokenService.sign(payload);
  }
}
