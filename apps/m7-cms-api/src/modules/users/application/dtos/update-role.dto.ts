import { IsEnum } from 'class-validator';

export enum AllowedRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  AUTHOR = 'author',
  VIEWER = 'viewer',
}

export class UpdateRoleDto {
  @IsEnum(AllowedRole, {
    message: 'Role must be one of: admin, editor, author, viewer',
  })
  role!: AllowedRole;
}
