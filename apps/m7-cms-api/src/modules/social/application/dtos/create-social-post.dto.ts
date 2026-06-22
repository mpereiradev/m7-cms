import {
  IsString,
  IsOptional,
  IsIn,
  IsUrl,
  IsInt,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSocialPostDto {
  @IsIn([
    'facebook',
    'instagram',
    'linkedin',
    'pinterest',
    'tiktok',
    'x',
    'youtube',
  ])
  platform!: string;

  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateSocialPostDto {
  @IsOptional()
  @IsIn([
    'facebook',
    'instagram',
    'linkedin',
    'pinterest',
    'tiktok',
    'x',
    'youtube',
  ])
  platform?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string | null;

  @IsOptional()
  @IsDateString()
  publishedAt?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
