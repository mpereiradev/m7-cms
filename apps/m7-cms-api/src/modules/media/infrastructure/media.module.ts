import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

// Application — ports
import { MEDIA_REPOSITORY } from '../application/ports/i-media-repository.port.js';
import { STORAGE_PORT } from '../application/ports/i-storage.port.js';

// Application — use-cases
import { UploadMediaUseCase } from '../application/use-cases/upload-media.use-case.js';
import { ListMediaUseCase } from '../application/use-cases/list-media.use-case.js';
import { DeleteMediaUseCase } from '../application/use-cases/delete-media.use-case.js';
import { GetSignedUrlUseCase } from '../application/use-cases/get-signed-url.use-case.js';

// Infrastructure
import { DrizzleMediaRepository } from './repositories/drizzle-media.repository.js';
import { SupabaseStorageService } from './services/supabase-storage.service.js';
import { ImageThumbnailService } from './services/image-thumbnail.service.js';
import { MediaController } from './controllers/media.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [
    // Port implementations
    {
      provide: MEDIA_REPOSITORY,
      useClass: DrizzleMediaRepository,
    },
    {
      provide: STORAGE_PORT,
      useClass: SupabaseStorageService,
    },

    // Infrastructure services
    ImageThumbnailService,

    // Use-cases
    UploadMediaUseCase,
    ListMediaUseCase,
    DeleteMediaUseCase,
    GetSignedUrlUseCase,
  ],
  exports: [MEDIA_REPOSITORY, STORAGE_PORT, ImageThumbnailService],
})
export class MediaModule {}
