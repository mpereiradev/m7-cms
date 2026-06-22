import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { UploadMediaUseCase } from '../../application/use-cases/upload-media.use-case.js';
import { ListMediaUseCase } from '../../application/use-cases/list-media.use-case.js';
import { DeleteMediaUseCase } from '../../application/use-cases/delete-media.use-case.js';
import { GetSignedUrlUseCase } from '../../application/use-cases/get-signed-url.use-case.js';
import { MediaResponseDto } from '../../application/dtos/media-response.dto.js';
import { ImageThumbnailService } from '../services/image-thumbnail.service.js';

@Controller('api/v1/media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(
    private readonly uploadMediaUseCase: UploadMediaUseCase,
    private readonly listMediaUseCase: ListMediaUseCase,
    private readonly deleteMediaUseCase: DeleteMediaUseCase,
    private readonly getSignedUrlUseCase: GetSignedUrlUseCase,
    private readonly imageThumbnailService: ImageThumbnailService,
  ) {}

  @Post('upload')
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: MediaResponseDto }> {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    // Extract image dimensions if applicable
    let width: number | null = null;
    let height: number | null = null;

    if (file.mimetype.startsWith('image/')) {
      const meta = await this.imageThumbnailService.getImageMetadata(
        file.buffer,
      );
      width = meta.width;
      height = meta.height;
    }

    const entity = await this.uploadMediaUseCase.execute({
      tenantId: user.tenantId,
      file: {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      width,
      height,
    });

    return { data: MediaResponseDto.fromEntity(entity) };
  }

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR, Role.VIEWER)
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: MediaResponseDto[] }> {
    const items = await this.listMediaUseCase.execute(user.tenantId);
    return { data: items.map(MediaResponseDto.fromEntity) };
  }

  @Get(':id/signed-url')
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR, Role.VIEWER)
  async getSignedUrl(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: { signedUrl: string } }> {
    const result = await this.getSignedUrlUseCase.execute(id, user.tenantId);
    return { data: result };
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: { deleted: boolean } }> {
    await this.deleteMediaUseCase.execute(id, user.tenantId);
    return { data: { deleted: true } };
  }
}
