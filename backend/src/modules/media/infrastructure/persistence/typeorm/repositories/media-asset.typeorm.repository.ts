import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAssetEntity } from '@/modules/media/domain/entities/media-asset.entity';
import { MediaAssetRepositoryPort } from '@/modules/media/domain/repositories/media-asset.repository.port';
import { MediaAssetMapper } from '@/modules/media/infrastructure/mappers/media-asset.mapper';
import { MediaAssetOrmEntity } from '../entities/media-asset.orm-entity';

@Injectable()
export class MediaAssetTypeOrmRepository extends MediaAssetRepositoryPort {
  constructor(
    @InjectRepository(MediaAssetOrmEntity)
    private readonly repository: Repository<MediaAssetOrmEntity>,
  ) {
    super();
  }

  async save(asset: MediaAssetEntity): Promise<MediaAssetEntity> {
    const saved = await this.repository.save(MediaAssetMapper.toOrm(asset));

    return MediaAssetMapper.toDomain(saved);
  }

  async findById(id: number): Promise<MediaAssetEntity | null> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
    });

    return entity ? MediaAssetMapper.toDomain(entity) : null;
  }

  async findByStorageKey(storageKey: string): Promise<MediaAssetEntity | null> {
    const entity = await this.repository.findOne({
      where: {
        storageKey,
      },
    });

    return entity ? MediaAssetMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
