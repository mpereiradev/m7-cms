export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  AUTHOR = 'author',
  VIEWER = 'viewer',
}

export class UserContext {
  readonly userId: string;
  readonly tenantId: string;
  readonly role: Role;
  readonly email: string;

  constructor(props: {
    userId: string;
    tenantId: string;
    role: Role;
    email: string;
  }) {
    this.userId = props.userId;
    this.tenantId = props.tenantId;
    this.role = props.role;
    this.email = props.email;
  }

  hasRole(role: Role): boolean {
    return this.role === role;
  }

  hasAnyRole(...roles: Role[]): boolean {
    return roles.includes(this.role);
  }
}
