import { Injectable } from '@nestjs/common';

import { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

@Injectable()
export class ListingMediaProcessor {
  async markReady(media: ListingMediaEntity): Promise<ListingMediaEntity> {
    media.markAsReady();

    return media;
  }

  async markFailed(
    media: ListingMediaEntity,
    error?: string,
  ): Promise<ListingMediaEntity> {
    media.markAsFailed(error);

    return media;
  }
}
