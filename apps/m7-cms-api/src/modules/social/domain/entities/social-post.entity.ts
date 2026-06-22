export class SocialPostEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly platform: string;
  readonly url: string;
  readonly title: string | null;
  readonly publishedAt: Date | null;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    platform: string;
    url: string;
    title: string | null;
    publishedAt: Date | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.platform = props.platform;
    this.url = props.url;
    this.title = props.title;
    this.publishedAt = props.publishedAt;
    this.order = props.order;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
