export type TenantAssociation = {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  role: string;
};

export class UserGlobalEntity {
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly photoUrl: string | null;
  readonly tenants: TenantAssociation[];

  constructor(props: {
    userId: string;
    email: string;
    name: string;
    photoUrl: string | null;
    tenants: TenantAssociation[];
  }) {
    this.userId = props.userId;
    this.email = props.email;
    this.name = props.name;
    this.photoUrl = props.photoUrl;
    this.tenants = props.tenants;
  }
}
