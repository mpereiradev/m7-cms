import type { GalleryEntity } from '../../domain/entities/gallery.entity.js';
import type { GalleryItemEntity } from '../../domain/entities/gallery-item.entity.js';
import type { VideoEntity } from '../../domain/entities/video.entity.js';

export const GALLERY_REPOSITORY = Symbol('GALLERY_REPOSITORY');

export interface IGalleryRepository {
  // Galleries
  findGalleryById(tenantId: string, id: string): Promise<GalleryEntity | null>;
  findAllGalleries(tenantId: string): Promise<GalleryEntity[]>;
  createGallery(data: {
    tenantId: string;
    slug: string;
    title?: string;
    type?: string;
  }): Promise<GalleryEntity>;
  deleteGallery(tenantId: string, id: string): Promise<boolean>;

  // Gallery Items
  findGalleryItemById(
    galleryId: string,
    id: string,
  ): Promise<GalleryItemEntity | null>;
  findGalleryItems(galleryId: string): Promise<GalleryItemEntity[]>;
  addGalleryItem(data: {
    galleryId: string;
    mediaId: string;
    order: number;
    caption?: Record<string, string> | null;
  }): Promise<GalleryItemEntity>;
  deleteGalleryItem(galleryId: string, id: string): Promise<boolean>;
  reorderGalleryItems(
    galleryId: string,
    ids: string[],
  ): Promise<GalleryItemEntity[]>;

  // Videos
  findVideoById(tenantId: string, id: string): Promise<VideoEntity | null>;
  findAllVideos(tenantId: string): Promise<VideoEntity[]>;
  createVideo(data: {
    tenantId: string;
    sourceType: string;
    url: string;
    title: string;
    description?: Record<string, string> | null;
    thumbnailMediaId?: string | null;
    order?: number;
  }): Promise<VideoEntity>;
  deleteVideo(tenantId: string, id: string): Promise<boolean>;
  reorderVideos(tenantId: string, ids: string[]): Promise<VideoEntity[]>;
}
