import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { MediaEntity } from '../../domain/entities/media.entity.js';
import {
  MEDIA_REPOSITORY,
  type IMediaRepository,
} from '../ports/i-media-repository.port.js';
import { STORAGE_PORT, type IStoragePort } from '../ports/i-storage.port.js';

const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'application/pdf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export interface UploadMediaInput {
  tenantId: string;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
  width?: number | null;
  height?: number | null;
}

@Injectable()
export class UploadMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: IMediaRepository,
    @Inject(STORAGE_PORT)
    private readonly storage: IStoragePort,
  ) {}

  async execute(input: UploadMediaInput): Promise<MediaEntity> {
    const { tenantId, file } = input;

    // Validate MIME type
    const isAllowed = ALLOWED_MIME_PREFIXES.some((prefix) =>
      file.mimetype.startsWith(prefix),
    );
    if (!isAllowed) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed. Accepted: image/*, video/*, application/pdf.`,
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds the maximum of 50 MB.`);
    }

    // Build storage path: {year}/{month}/{uuid}.{ext}
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ext = this.extractExtension(file.originalname);
    const fileId = uuidv4();
    const storagePath = `${year}/${month}/${fileId}${ext}`;

    // Upload to storage
    const url = await this.storage.upload(
      tenantId,
      storagePath,
      file.buffer,
      file.mimetype,
    );

    // Persist metadata in DB
    return this.mediaRepository.create({
      tenantId,
      filename: file.originalname,
      url,
      mimeType: file.mimetype,
      size: file.size,
      width: input.width ?? null,
      height: input.height ?? null,
    });
  }

  private extractExtension(filename: string): string {
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex === -1) return '';
    return filename.substring(dotIndex);
  }
}
