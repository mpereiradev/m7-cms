import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  STORE_REPOSITORY,
  type IStoreRepository,
} from '../ports/i-store-repository.port.js';

@Injectable()
export class DeleteStoreUseCase {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: IStoreRepository,
  ) {}

  async execute(tenantId: string, storeId: string): Promise<void> {
    const deleted = await this.storeRepository.delete(tenantId, storeId);
    if (!deleted) {
      throw new NotFoundException(`Store "${storeId}" not found.`);
    }
  }
}
