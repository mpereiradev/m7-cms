import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

// Application — ports
import { STORE_REPOSITORY } from '../application/ports/i-store-repository.port.js';

// Application — use-cases
import { CreateStoreUseCase } from '../application/use-cases/create-store.use-case.js';
import { UpdateStoreUseCase } from '../application/use-cases/update-store.use-case.js';
import { DeleteStoreUseCase } from '../application/use-cases/delete-store.use-case.js';
import { ListStoresUseCase } from '../application/use-cases/list-stores.use-case.js';
import { SetStoreHoursUseCase } from '../application/use-cases/set-store-hours.use-case.js';

// Infrastructure
import { DrizzleStoreRepository } from './repositories/drizzle-store.repository.js';
import {
  StoresController,
  PublicStoresController,
} from './controllers/stores.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [StoresController, PublicStoresController],
  providers: [
    // Port implementations
    {
      provide: STORE_REPOSITORY,
      useClass: DrizzleStoreRepository,
    },

    // Use-cases
    CreateStoreUseCase,
    UpdateStoreUseCase,
    DeleteStoreUseCase,
    ListStoresUseCase,
    SetStoreHoursUseCase,
  ],
  exports: [STORE_REPOSITORY],
})
export class StoresModule {}
