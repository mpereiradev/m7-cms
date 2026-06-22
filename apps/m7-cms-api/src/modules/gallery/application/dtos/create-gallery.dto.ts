import { IsString, MaxLength } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @MaxLength(255)
  slug!: string;
}
