import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsModule } from '@/modules/listings/listings.module';
import {
  MEDIA_ASSET_REPOSITORY,
  MEDIA_PROCESSING_QUEUE,
  MEDIA_STORAGE,
} from './application/tokens';
import { MediaFileValidatorService } from './application/services/media-file-validator.service';
import { DeleteListingMediaUseCase } from './application/use-cases/delete-listing-media.usecase';
import { DeleteMediaUseCase } from './application/use-cases/delete-media.usecase';
import { GetMediaUseCase } from './application/use-cases/get-media.usecase';
import { ReorderListingMediaUseCase } from './application/use-cases/reorder-listing-media.usecase';
import { SetPrimaryListingMediaUseCase } from './application/use-cases/set-primary-listing-media.usecase';
import { UploadListingMediaUseCase } from './application/use-cases/upload-listing-media.usecase';
import { UploadMediaUseCase } from './application/use-cases/upload-media.usecase';
import { BullMediaProcessingQueue } from './infrastructure/queues/bull-media-processing.queue';
import { MEDIA_PROCESSING_QUEUE_NAME } from './infrastructure/queues/media-queue.constants';
import { MediaProcessingProcessor } from './infrastructure/processing/media-processing.processor';
import { MediaAssetOrmEntity } from './infrastructure/persistence/typeorm/entities/media-asset.orm-entity';
import { MediaAssetTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/media-asset.typeorm.repository';
import { LocalMediaStorageService } from './infrastructure/storage/local/local-media-storage.service';
import { ListingMediaController } from './presentation/http/controllers/listing-media.controller';
import { MediaController } from './presentation/http/controllers/media.controller';

@Module({
  imports: [
    ListingsModule,
    TypeOrmModule.forFeature([MediaAssetOrmEntity]),
    BullModule.registerQueue({
      name: MEDIA_PROCESSING_QUEUE_NAME,
    }),
  ],
  controllers: [MediaController, ListingMediaController],
  providers: [
    MediaFileValidatorService,
    UploadMediaUseCase,
    GetMediaUseCase,
    DeleteMediaUseCase,
    UploadListingMediaUseCase,
    ReorderListingMediaUseCase,
    SetPrimaryListingMediaUseCase,
    DeleteListingMediaUseCase,
    MediaProcessingProcessor,
    {
      provide: MEDIA_ASSET_REPOSITORY,
      useClass: MediaAssetTypeOrmRepository,
    },
    {
      provide: MEDIA_STORAGE,
      useClass: LocalMediaStorageService,
    },
    {
      provide: MEDIA_PROCESSING_QUEUE,
      useClass: BullMediaProcessingQueue,
    },
  ],
  exports: [UploadMediaUseCase, MEDIA_STORAGE, MEDIA_ASSET_REPOSITORY],
})
export class MediaModule {}
