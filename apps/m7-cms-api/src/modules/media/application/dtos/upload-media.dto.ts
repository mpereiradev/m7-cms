import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;
}
