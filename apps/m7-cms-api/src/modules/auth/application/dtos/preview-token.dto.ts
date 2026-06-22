import { IsOptional, IsUUID } from 'class-validator';

export class CreatePreviewTokenDto {
  @IsOptional()
  @IsUUID()
  pageId?: string;
}

export class PreviewTokenResponseDto {
  token: string;
  expiresAt: string;
}
