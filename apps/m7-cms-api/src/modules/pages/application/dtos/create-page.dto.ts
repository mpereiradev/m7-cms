import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PageTranslationDto {
  @IsString()
  @MaxLength(10)
  languageCode!: string;

  @IsString()
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;
}

export class CreatePageDto {
  @IsString()
  @MaxLength(255)
  slug!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageTranslationDto)
  translations!: PageTranslationDto[];
}

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageTranslationDto)
  translations?: PageTranslationDto[];
}
