import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { StoreEntity } from '../../domain/entities/store.entity.js';
import {
  STORE_REPOSITORY,
  type IStoreRepository,
} from '../ports/i-store-repository.port.js';

export interface SetStoreHoursInput {
  hours: {
    weekday: number;
    openTime: string;
    closeTime: string;
  }[];
}

@Injectable()
export class SetStoreHoursUseCase {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: IStoreRepository,
  ) {}

  async execute(
    tenantId: string,
    storeId: string,
    input: SetStoreHoursInput,
  ): Promise<StoreEntity> {
    const store = await this.storeRepository.setHours(tenantId, storeId, {
      hours: input.hours,
    });
    if (!store) {
      throw new NotFoundException(`Store "${storeId}" not found.`);
    }
    return store;
  }
}
