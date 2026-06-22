export class MediaEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly filename: string;
  readonly url: string;
  readonly mimeType: string;
  readonly size: number | null;
  readonly width: number | null;
  readonly height: number | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number | null;
    width: number | null;
    height: number | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.filename = props.filename;
    this.url = props.url;
    this.mimeType = props.mimeType;
    this.size = props.size;
    this.width = props.width;
    this.height = props.height;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }
}
