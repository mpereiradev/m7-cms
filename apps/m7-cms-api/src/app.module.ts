import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/infrastructure/auth.module.js';
import { TenantsModule } from './modules/tenants/infrastructure/tenants.module.js';
import { UsersModule } from './modules/users/infrastructure/users.module.js';

@Module({
  imports: [AuthModule, TenantsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
