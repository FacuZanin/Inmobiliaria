import { Inject } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LISTING_REPOSITORY } from '@/modules/listings/application/tokens';
import type { ListingRepositoryPort } from '@/modules/listings/domain/repositories/listing.repository.port';
import { MediaAssetRepositoryPort } from '@/modules/media/domain/repositories/media-asset.repository.port';
import { MediaOwnerType } from '@/modules/media/domain/enums/media-owner-type.enum';
import { MEDIA_ASSET_REPOSITORY } from '@/modules/media/application/tokens';
import { ProcessMediaJob } from '@/modules/media/application/ports/media-processing-queue.port';
import { MEDIA_PROCESSING_QUEUE_NAME } from '../queues/media-queue.constants';

@Processor(MEDIA_PROCESSING_QUEUE_NAME)
export class MediaProcessingProcessor extends WorkerHost {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly mediaRepository: MediaAssetRepositoryPort,

    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {
    super();
  }

  async process(job: Job<ProcessMediaJob>): Promise<void> {
    const asset = await this.mediaRepository.findById(job.data.mediaId);

    if (!asset) {
      return;
    }

    asset.markProcessing();
    await this.mediaRepository.save(asset);

    try {
      asset.markReady({
        processedAt: new Date().toISOString(),
      });

      const saved = await this.mediaRepository.save(asset);

      if (saved.ownerType === MediaOwnerType.LISTING) {
        const listing = await this.listingRepository.findById(saved.ownerId);

        if (listing?.markMediaReadyByStorageKey(saved.storageKey)) {
          await this.listingRepository.update(saved.ownerId, listing);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Media processing failed';

      asset.markFailed(message);
      await this.mediaRepository.save(asset);

      if (asset.ownerType === MediaOwnerType.LISTING) {
        const listing = await this.listingRepository.findById(asset.ownerId);

        if (listing?.markMediaFailedByStorageKey(asset.storageKey, message)) {
          await this.listingRepository.update(asset.ownerId, listing);
        }
      }

      throw error;
    }
  }
}
