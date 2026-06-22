import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  IsIn,
  IsObject,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVideoDto {
  @IsIn(['youtube', 'vimeo', 'local'])
  sourceType!: string;

  @IsUrl()
  url!: string;

  @IsString()
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsUUID()
  thumbnailMediaId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
