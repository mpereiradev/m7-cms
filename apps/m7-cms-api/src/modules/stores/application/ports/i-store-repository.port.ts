import type { StoreEntity } from '../../domain/entities/store.entity.js';

export const STORE_REPOSITORY = Symbol('STORE_REPOSITORY');

export interface CreateStoreData {
  tenantId: string;
  slug: string;
  mapUrl?: string | null;
  translations: {
    languageCode: string;
    name: string;
    address?: string | null;
    description?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  }[];
}

export interface UpdateStoreData {
  slug?: string;
  mapUrl?: string | null;
  translations?: {
    languageCode: string;
    name: string;
    address?: string | null;
    description?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  }[];
}

export interface SetStoreHoursData {
  hours: {
    weekday: number;
    openTime: string;
    closeTime: string;
  }[];
}

export interface IStoreRepository {
  findById(tenantId: string, id: string): Promise<StoreEntity | null>;
  findAllByTenant(tenantId: string): Promise<StoreEntity[]>;
  create(data: CreateStoreData): Promise<StoreEntity>;
  update(
    tenantId: string,
    id: string,
    data: UpdateStoreData,
  ): Promise<StoreEntity | null>;
  delete(tenantId: string, id: string): Promise<boolean>;
  setHours(
    tenantId: string,
    storeId: string,
    data: SetStoreHoursData,
  ): Promise<StoreEntity | null>;
}
