import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';
import { DashboardController } from './controllers/dashboard.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
