import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

// Application — ports
import { GALLERY_REPOSITORY } from '../application/ports/i-gallery-repository.port.js';

// Application — use-cases
import { CreateGalleryUseCase } from '../application/use-cases/create-gallery.use-case.js';
import { ListGalleriesUseCase } from '../application/use-cases/list-galleries.use-case.js';
import { AddGalleryItemUseCase } from '../application/use-cases/add-gallery-item.use-case.js';
import { ReorderGalleryItemsUseCase } from '../application/use-cases/reorder-gallery-items.use-case.js';
import { DeleteGalleryItemUseCase } from '../application/use-cases/delete-gallery-item.use-case.js';
import { CreateVideoUseCase } from '../application/use-cases/create-video.use-case.js';
import { ListVideosUseCase } from '../application/use-cases/list-videos.use-case.js';
import { ReorderVideosUseCase } from '../application/use-cases/reorder-videos.use-case.js';

// Infrastructure
import { DrizzleGalleryRepository } from './repositories/drizzle-gallery.repository.js';
import { GalleriesController } from './controllers/galleries.controller.js';
import { VideosController } from './controllers/videos.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [GalleriesController, VideosController],
  providers: [
    // Port implementations
    {
      provide: GALLERY_REPOSITORY,
      useClass: DrizzleGalleryRepository,
    },

    // Use-cases
    CreateGalleryUseCase,
    ListGalleriesUseCase,
    AddGalleryItemUseCase,
    ReorderGalleryItemsUseCase,
    DeleteGalleryItemUseCase,
    CreateVideoUseCase,
    ListVideosUseCase,
    ReorderVideosUseCase,
  ],
  exports: [GALLERY_REPOSITORY],
})
export class GalleryModule {}
