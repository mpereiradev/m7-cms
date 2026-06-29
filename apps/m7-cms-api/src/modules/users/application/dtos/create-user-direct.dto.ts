import {
  IsString,
  IsEmail,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDirectDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsString()
  @MinLength(8, { message: 'Senha deve ter no minimo 8 caracteres.' })
  password!: string;

  @IsString()
  tenantId!: string;

  @IsEnum(['admin', 'editor', 'author', 'viewer'], {
    message: 'Role invalido. Use: admin, editor, author ou viewer.',
  })
  role!: string;
}
