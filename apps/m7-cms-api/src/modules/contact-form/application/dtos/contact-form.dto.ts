import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class ContactFormDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subject?: string;

  @IsString()
  @MaxLength(5000)
  message!: string;
}
