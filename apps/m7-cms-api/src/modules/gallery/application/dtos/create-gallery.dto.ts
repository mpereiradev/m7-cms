import { IsString, IsOptional, MaxLength, IsIn } from 'class-validator';

export class CreateGalleryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsIn(['image', 'video'])
  type?: 'image' | 'video';
}
