export class GalleryItemEntity {
  readonly id: string;
  readonly galleryId: string;
  readonly mediaId: string;
  readonly order: number;
  readonly caption: Record<string, string> | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    galleryId: string;
    mediaId: string;
    order: number;
    caption: Record<string, string> | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.galleryId = props.galleryId;
    this.mediaId = props.mediaId;
    this.order = props.order;
    this.caption = props.caption;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
