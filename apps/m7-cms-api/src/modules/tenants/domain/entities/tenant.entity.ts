export class TenantEntity {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly domain: string | null;
  readonly logoUrl: string | null;
  readonly languages: string[];
  readonly theme: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    slug: string;
    name: string;
    domain: string | null;
    logoUrl: string | null;
    languages: string[];
    theme: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.slug = props.slug;
    this.name = props.name;
    this.domain = props.domain;
    this.logoUrl = props.logoUrl;
    this.languages = props.languages;
    this.theme = props.theme;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
