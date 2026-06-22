import { IsUUID, IsOptional, IsInt, IsObject, Min } from 'class-validator';

export class AddGalleryItemDto {
  @IsUUID()
  mediaId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsObject()
  caption?: Record<string, string>;
}
