import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';
import { UsersModule } from '../../users/infrastructure/users.module.js';

// Application — ports
import { TENANT_REPOSITORY } from '../application/ports/i-tenant-repository.port.js';

// Application — use-cases
import { CreateTenantUseCase } from '../application/use-cases/create-tenant.use-case.js';
import { GetTenantUseCase } from '../application/use-cases/get-tenant.use-case.js';
import { UpdateTenantUseCase } from '../application/use-cases/update-tenant.use-case.js';
import { ListTenantsUseCase } from '../application/use-cases/list-tenants.use-case.js';

// Infrastructure
import { DrizzleTenantRepository } from './repositories/drizzle-tenant.repository.js';
import { TenantsController } from './controllers/tenants.controller.js';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [TenantsController],
  providers: [
    // Port implementations
    {
      provide: TENANT_REPOSITORY,
      useClass: DrizzleTenantRepository,
    },

    // Use-cases
    CreateTenantUseCase,
    GetTenantUseCase,
    UpdateTenantUseCase,
    ListTenantsUseCase,
  ],
  exports: [TENANT_REPOSITORY],
})
export class TenantsModule {}
