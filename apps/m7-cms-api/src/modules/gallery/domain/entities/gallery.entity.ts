export class GalleryEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly slug: string;
  readonly title: string | null;
  readonly type: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    slug: string;
    title?: string | null;
    type?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.slug = props.slug;
    this.title = props.title ?? null;
    this.type = props.type ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
