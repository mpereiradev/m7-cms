import { IsEmail, IsString, MaxLength } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(255)
  name!: string;
}
