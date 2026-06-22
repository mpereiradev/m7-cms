import type { MediaEntity } from '../../domain/entities/media.entity.js';

export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export interface IMediaRepository {
  findById(id: string, tenantId: string): Promise<MediaEntity | null>;
  findAllByTenant(tenantId: string): Promise<MediaEntity[]>;
  create(data: {
    tenantId: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number | null;
    width: number | null;
    height: number | null;
  }): Promise<MediaEntity>;
  delete(id: string, tenantId: string): Promise<boolean>;
}
