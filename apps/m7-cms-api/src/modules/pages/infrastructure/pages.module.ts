import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

// Application — ports
import { PAGE_REPOSITORY } from '../application/ports/i-page-repository.port.js';

// Application — use-cases
import { CreatePageUseCase } from '../application/use-cases/create-page.use-case.js';
import { UpdatePageUseCase } from '../application/use-cases/update-page.use-case.js';
import { PublishPageUseCase } from '../application/use-cases/publish-page.use-case.js';
import { DeletePageUseCase } from '../application/use-cases/delete-page.use-case.js';
import { GetPageUseCase } from '../application/use-cases/get-page.use-case.js';
import { ListPagesUseCase } from '../application/use-cases/list-pages.use-case.js';
import { AddSectionUseCase } from '../application/use-cases/add-section.use-case.js';
import { ReorderSectionsUseCase } from '../application/use-cases/reorder-sections.use-case.js';

// Infrastructure
import { DrizzlePageRepository } from './repositories/drizzle-page.repository.js';
import {
  PagesController,
  PagesPreviewController,
  PagesPublicController,
} from './controllers/pages.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [PagesController, PagesPreviewController, PagesPublicController],
  providers: [
    // Port implementations
    {
      provide: PAGE_REPOSITORY,
      useClass: DrizzlePageRepository,
    },

    // Use-cases
    CreatePageUseCase,
    UpdatePageUseCase,
    PublishPageUseCase,
    DeletePageUseCase,
    GetPageUseCase,
    ListPagesUseCase,
    AddSectionUseCase,
    ReorderSectionsUseCase,
  ],
  exports: [PAGE_REPOSITORY],
})
export class PagesModule {}
