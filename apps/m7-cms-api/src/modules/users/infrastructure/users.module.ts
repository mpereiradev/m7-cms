import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

// Application — ports
import { USER_REPOSITORY } from '../application/ports/i-user-repository.port.js';
import { EMAIL_SERVICE } from '../application/use-cases/invite-user.use-case.js';

// Application — use-cases
import { ListTenantUsersUseCase } from '../application/use-cases/list-tenant-users.use-case.js';
import { ListAllUsersUseCase } from '../application/use-cases/list-all-users.use-case.js';
import { InviteUserUseCase } from '../application/use-cases/invite-user.use-case.js';
import { UpdateUserRoleUseCase } from '../application/use-cases/update-user-role.use-case.js';
import { RemoveUserUseCase } from '../application/use-cases/remove-user.use-case.js';
import { CreateUserDirectUseCase } from '../application/use-cases/create-user-direct.use-case.js';

// Infrastructure
import { DrizzleUserRepository } from './repositories/drizzle-user.repository.js';
import { EmailService } from './services/email.service.js';
import { UsersController } from './controllers/users.controller.js';
import { MeController } from './controllers/me.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [MeController, UsersController],
  providers: [
    // Port implementations
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: EmailService,
    },

    // Use-cases
    ListTenantUsersUseCase,
    ListAllUsersUseCase,
    InviteUserUseCase,
    UpdateUserRoleUseCase,
    RemoveUserUseCase,
    CreateUserDirectUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
