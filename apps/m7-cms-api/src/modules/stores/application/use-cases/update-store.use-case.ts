import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { StoreEntity } from '../../domain/entities/store.entity.js';
import {
  STORE_REPOSITORY,
  type IStoreRepository,
  type UpdateStoreData,
} from '../ports/i-store-repository.port.js';

export interface UpdateStoreInput {
  slug?: string;
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

@Injectable()
export class UpdateStoreUseCase {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: IStoreRepository,
  ) {}

  async execute(
    tenantId: string,
    storeId: string,
    input: UpdateStoreInput,
  ): Promise<StoreEntity> {
    const data: UpdateStoreData = {};
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.translations !== undefined)
      data.translations = input.translations;

    const store = await this.storeRepository.update(tenantId, storeId, data);
    if (!store) {
      throw new NotFoundException(`Store "${storeId}" not found.`);
    }
    return store;
  }
}
