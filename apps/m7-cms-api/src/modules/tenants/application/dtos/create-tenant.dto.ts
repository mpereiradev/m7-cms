import { IsString, IsOptional, IsArray, MaxLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MaxLength(255)
  slug!: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  domain?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  theme?: string;
}
