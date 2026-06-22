export class VideoEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly sourceType: string;
  readonly url: string;
  readonly title: string;
  readonly description: Record<string, string> | null;
  readonly thumbnailMediaId: string | null;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    sourceType: string;
    url: string;
    title: string;
    description: Record<string, string> | null;
    thumbnailMediaId: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.sourceType = props.sourceType;
    this.url = props.url;
    this.title = props.title;
    this.description = props.description;
    this.thumbnailMediaId = props.thumbnailMediaId;
    this.order = props.order;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
