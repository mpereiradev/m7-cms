import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

import { BANNER_REPOSITORY } from '../application/ports/i-banner-repository.port.js';

import { CreateBannerUseCase } from '../application/use-cases/create-banner.use-case.js';
import { UpdateBannerUseCase } from '../application/use-cases/update-banner.use-case.js';
import { DeleteBannerUseCase } from '../application/use-cases/delete-banner.use-case.js';
import { ListBannersUseCase } from '../application/use-cases/list-banners.use-case.js';
import { ListActiveBannersUseCase } from '../application/use-cases/list-active-banners.use-case.js';

import { DrizzleBannerRepository } from './repositories/drizzle-banner.repository.js';
import {
  BannersController,
  PublicBannersController,
} from './controllers/banners.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [BannersController, PublicBannersController],
  providers: [
    { provide: BANNER_REPOSITORY, useClass: DrizzleBannerRepository },

    CreateBannerUseCase,
    UpdateBannerUseCase,
    DeleteBannerUseCase,
    ListBannersUseCase,
    ListActiveBannersUseCase,
  ],
  exports: [BANNER_REPOSITORY],
})
export class BannersModule {}
