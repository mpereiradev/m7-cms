import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StoreTranslationDto {
  @IsString()
  @MaxLength(10)
  languageCode!: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  whatsapp?: string;
}

export class CreateStoreDto {
  @IsString()
  @MaxLength(255)
  slug!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreTranslationDto)
  translations!: StoreTranslationDto[];
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreTranslationDto)
  translations?: StoreTranslationDto[];
}
