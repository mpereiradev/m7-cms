export class StoreTranslationValue {
  readonly id: string;
  readonly storeId: string;
  readonly languageCode: string;
  readonly name: string;
  readonly address: string | null;
  readonly description: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly whatsapp: string | null;

  constructor(props: {
    id: string;
    storeId: string;
    languageCode: string;
    name: string;
    address: string | null;
    description: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
  }) {
    this.id = props.id;
    this.storeId = props.storeId;
    this.languageCode = props.languageCode;
    this.name = props.name;
    this.address = props.address;
    this.description = props.description;
    this.email = props.email;
    this.phone = props.phone;
    this.whatsapp = props.whatsapp;
  }
}

export class StoreHourValue {
  readonly id: string;
  readonly storeId: string;
  readonly weekday: number;
  readonly openTime: string;
  readonly closeTime: string;

  constructor(props: {
    id: string;
    storeId: string;
    weekday: number;
    openTime: string;
    closeTime: string;
  }) {
    this.id = props.id;
    this.storeId = props.storeId;
    this.weekday = props.weekday;
    this.openTime = props.openTime;
    this.closeTime = props.closeTime;
  }
}

export class StoreEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly slug: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly translations: StoreTranslationValue[];
  readonly hours: StoreHourValue[];

  constructor(props: {
    id: string;
    tenantId: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    translations?: StoreTranslationValue[];
    hours?: StoreHourValue[];
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.slug = props.slug;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.translations = props.translations ?? [];
    this.hours = props.hours ?? [];
  }
}
