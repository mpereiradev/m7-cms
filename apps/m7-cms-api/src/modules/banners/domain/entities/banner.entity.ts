export class BannerEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly title: string | null;
  readonly mediaId: string | null;
  readonly ctaLabel: string | null;
  readonly linkUrl: string | null;
  readonly displayStart: Date | null;
  readonly displayEnd: Date | null;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    title: string | null;
    mediaId: string | null;
    ctaLabel: string | null;
    linkUrl: string | null;
    displayStart: Date | null;
    displayEnd: Date | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.title = props.title;
    this.mediaId = props.mediaId;
    this.ctaLabel = props.ctaLabel;
    this.linkUrl = props.linkUrl;
    this.displayStart = props.displayStart;
    this.displayEnd = props.displayEnd;
    this.order = props.order;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isActive(): boolean {
    const now = new Date();
    if (this.displayStart && now < this.displayStart) return false;
    if (this.displayEnd && now > this.displayEnd) return false;
    return true;
  }
}
