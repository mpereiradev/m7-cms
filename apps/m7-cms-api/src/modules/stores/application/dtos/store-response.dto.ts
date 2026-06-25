import type { StoreEntity } from '../../domain/entities/store.entity.js';

export class StoreHourResponseDto {
  id!: string;
  weekday!: number;
  openTime!: string;
  closeTime!: string;
}

export class StoreTranslationResponseDto {
  id!: string;
  languageCode!: string;
  name!: string;
  address!: string | null;
  description!: string | null;
  email!: string | null;
  phone!: string | null;
  whatsapp!: string | null;
}

export class StoreResponseDto {
  id!: string;
  tenantId!: string;
  slug!: string;
  mapUrl!: string | null;
  translations!: StoreTranslationResponseDto[];
  hours!: StoreHourResponseDto[];
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: StoreEntity): StoreResponseDto {
    const dto = new StoreResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.slug = entity.slug;
    dto.mapUrl = entity.mapUrl;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();

    dto.translations = entity.translations.map((t) => {
      const td = new StoreTranslationResponseDto();
      td.id = t.id;
      td.languageCode = t.languageCode;
      td.name = t.name;
      td.address = t.address;
      td.description = t.description;
      td.email = t.email;
      td.phone = t.phone;
      td.whatsapp = t.whatsapp;
      return td;
    });

    dto.hours = entity.hours.map((h) => {
      const hd = new StoreHourResponseDto();
      hd.id = h.id;
      hd.weekday = h.weekday;
      hd.openTime = h.openTime;
      hd.closeTime = h.closeTime;
      return hd;
    });

    return dto;
  }
}
