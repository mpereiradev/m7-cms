import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

import {
  POST_REPOSITORY,
  CATEGORY_REPOSITORY,
  TAG_REPOSITORY,
} from '../application/ports/i-post-repository.port.js';

import { CreatePostUseCase } from '../application/use-cases/create-post.use-case.js';
import { UpdatePostUseCase } from '../application/use-cases/update-post.use-case.js';
import { PublishPostUseCase } from '../application/use-cases/publish-post.use-case.js';
import { SchedulePostUseCase } from '../application/use-cases/schedule-post.use-case.js';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case.js';
import { GetPostUseCase } from '../application/use-cases/get-post.use-case.js';
import { ListPostsUseCase } from '../application/use-cases/list-posts.use-case.js';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case.js';
import { ListCategoriesUseCase } from '../application/use-cases/list-categories.use-case.js';
import { CreateTagUseCase } from '../application/use-cases/create-tag.use-case.js';
import { ListTagsUseCase } from '../application/use-cases/list-tags.use-case.js';

import { DrizzlePostRepository } from './repositories/drizzle-post.repository.js';
import { DrizzleCategoryRepository } from './repositories/drizzle-category.repository.js';
import { DrizzleTagRepository } from './repositories/drizzle-tag.repository.js';
import {
  PostsController,
  PublicPostsController,
} from './controllers/posts.controller.js';
import { CategoriesController } from './controllers/categories.controller.js';
import { TagsController } from './controllers/tags.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [
    PostsController,
    PublicPostsController,
    CategoriesController,
    TagsController,
  ],
  providers: [
    { provide: POST_REPOSITORY, useClass: DrizzlePostRepository },
    { provide: CATEGORY_REPOSITORY, useClass: DrizzleCategoryRepository },
    { provide: TAG_REPOSITORY, useClass: DrizzleTagRepository },

    CreatePostUseCase,
    UpdatePostUseCase,
    PublishPostUseCase,
    SchedulePostUseCase,
    DeletePostUseCase,
    GetPostUseCase,
    ListPostsUseCase,
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    CreateTagUseCase,
    ListTagsUseCase,
  ],
  exports: [POST_REPOSITORY, CATEGORY_REPOSITORY, TAG_REPOSITORY],
})
export class PostsModule {}
