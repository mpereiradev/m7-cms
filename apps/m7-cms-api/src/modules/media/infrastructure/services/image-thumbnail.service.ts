import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';

export interface ThumbnailResult {
  buffer: Buffer;
  width: number;
  height: number;
}

export interface ImageMetadata {
  width: number | null;
  height: number | null;
}

@Injectable()
export class ImageThumbnailService {
  private readonly logger = new Logger(ImageThumbnailService.name);

  /**
   * Generate a thumbnail for an image, resizing to at most `maxWidth` pixels wide.
   * Returns null if the buffer is not a valid image.
   */
  async generateThumbnail(
    buffer: Buffer,
    maxWidth = 400,
  ): Promise<ThumbnailResult | null> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        return null;
      }

      // Only resize if the image is wider than maxWidth
      const resizeWidth = metadata.width > maxWidth ? maxWidth : metadata.width;

      const resized = await image
        .resize({ width: resizeWidth, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer({ resolveWithObject: true });

      return {
        buffer: resized.data,
        width: resized.info.width,
        height: resized.info.height,
      };
    } catch (err) {
      this.logger.warn('Thumbnail generation failed', err);
      return null;
    }
  }

  /**
   * Extract width/height metadata from an image buffer.
   */
  async getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width ?? null,
        height: metadata.height ?? null,
      };
    } catch {
      return { width: null, height: null };
    }
  }
}
