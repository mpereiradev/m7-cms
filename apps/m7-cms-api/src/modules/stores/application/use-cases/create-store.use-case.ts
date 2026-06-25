import { Inject, Injectable } from '@nestjs/common';
import type { StoreEntity } from '../../domain/entities/store.entity.js';
import {
  STORE_REPOSITORY,
  type IStoreRepository,
  type CreateStoreData,
} from '../ports/i-store-repository.port.js';

export interface CreateStoreInput {
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

@Injectable()
export class CreateStoreUseCase {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: IStoreRepository,
  ) {}

  async execute(input: CreateStoreInput): Promise<StoreEntity> {
    const data: CreateStoreData = {
      tenantId: input.tenantId,
      slug: input.slug,
      mapUrl: input.mapUrl,
      translations: input.translations,
    };
    return this.storeRepository.create(data);
  }
}
