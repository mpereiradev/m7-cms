import { Inject, Injectable } from '@nestjs/common';
import type { StoreEntity } from '../../domain/entities/store.entity.js';
import {
  STORE_REPOSITORY,
  type IStoreRepository,
} from '../ports/i-store-repository.port.js';

@Injectable()
export class ListStoresUseCase {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: IStoreRepository,
  ) {}

  async execute(tenantId: string): Promise<StoreEntity[]> {
    return this.storeRepository.findAllByTenant(tenantId);
  }
}
