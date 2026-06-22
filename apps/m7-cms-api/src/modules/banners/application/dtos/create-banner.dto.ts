import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsInt,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateBannerDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsUUID()
  mediaId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ctaLabel?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsDateString()
  displayStart?: string;

  @IsOptional()
  @IsDateString()
  displayEnd?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateBannerDto extends CreateBannerDto {}
