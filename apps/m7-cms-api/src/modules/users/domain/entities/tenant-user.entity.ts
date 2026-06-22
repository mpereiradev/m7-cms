export class TenantUserEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly userId: string;
  readonly role: string;
  readonly email: string;
  readonly name: string;
  readonly photoUrl: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    userId: string;
    role: string;
    email: string;
    name: string;
    photoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.userId = props.userId;
    this.role = props.role;
    this.email = props.email;
    this.name = props.name;
    this.photoUrl = props.photoUrl;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
