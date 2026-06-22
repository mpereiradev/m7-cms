import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

import { SOCIAL_REPOSITORY } from '../application/ports/i-social-repository.port.js';

import { CreateSocialPostUseCase } from '../application/use-cases/create-social-post.use-case.js';
import { ListSocialPostsUseCase } from '../application/use-cases/list-social-posts.use-case.js';
import { UpdateSocialPostUseCase } from '../application/use-cases/update-social-post.use-case.js';
import { DeleteSocialPostUseCase } from '../application/use-cases/delete-social-post.use-case.js';
import { ReorderSocialPostsUseCase } from '../application/use-cases/reorder-social-posts.use-case.js';

import { DrizzleSocialRepository } from './repositories/drizzle-social.repository.js';
import { SocialController } from './controllers/social.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [SocialController],
  providers: [
    { provide: SOCIAL_REPOSITORY, useClass: DrizzleSocialRepository },

    CreateSocialPostUseCase,
    ListSocialPostsUseCase,
    UpdateSocialPostUseCase,
    DeleteSocialPostUseCase,
    ReorderSocialPostsUseCase,
  ],
  exports: [SOCIAL_REPOSITORY],
})
export class SocialModule {}
