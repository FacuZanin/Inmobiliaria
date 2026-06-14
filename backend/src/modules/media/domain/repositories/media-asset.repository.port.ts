import { MediaAssetEntity } from '../entities/media-asset.entity';

export abstract class MediaAssetRepositoryPort {
  abstract save(asset: MediaAssetEntity): Promise<MediaAssetEntity>;
  abstract findById(id: number): Promise<MediaAssetEntity | null>;
  abstract findByStorageKey(storageKey: string): Promise<MediaAssetEntity | null>;
  abstract delete(id: number): Promise<void>;
}
