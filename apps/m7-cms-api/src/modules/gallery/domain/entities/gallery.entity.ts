export class GalleryEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly slug: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.slug = props.slug;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
