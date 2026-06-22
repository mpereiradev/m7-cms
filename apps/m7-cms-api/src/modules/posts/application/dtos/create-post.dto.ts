import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PostTranslationDto {
  @IsString()
  @MaxLength(10)
  languageCode!: string;

  @IsString()
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  content?: unknown;
}

export class CreatePostDto {
  @IsString()
  @MaxLength(255)
  slug!: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostTranslationDto)
  translations!: PostTranslationDto[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostTranslationDto)
  translations?: PostTranslationDto[];
}
