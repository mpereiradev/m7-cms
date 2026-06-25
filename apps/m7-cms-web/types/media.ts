export type MediaItem = {
  id: string;
  tenantId: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaUploadResponse = {
  id: string;
  url: string;
  filename: string;
  thumbnailUrl: string | null;
};

export type MediaListParams = {
  page?: number;
  perPage?: number;
  search?: string;
  mimeType?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total?: number;
  page?: number;
  perPage?: number;
};

export type Gallery = {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  description: string | null;
  type: "image" | "video";
  itemCount: number;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GalleryItem = {
  id: string;
  galleryId: string;
  mediaId: string | null;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  order: number;
  createdAt: string;
};

export type GalleryDetail = Gallery & {
  items: GalleryItem[];
};

export type CreateGalleryInput = {
  title: string;
  slug?: string;
  description?: string;
  type: "image" | "video";
};

export type AddGalleryItemInput = {
  mediaId?: string;
  url?: string;
  caption?: string;
};

export type VideoItem = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  url: string;
  provider: "youtube" | "vimeo" | "local" | "other";
  thumbnailUrl: string | null;
  order: number;
  galleryId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateVideoInput = {
  title: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  galleryId: string;
};

export type MediaPickerResult = {
  id: string;
  url: string;
  filename: string;
};
