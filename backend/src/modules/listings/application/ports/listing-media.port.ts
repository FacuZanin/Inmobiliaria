import { ListingMediaEntity } from '@modules/listings/domain/entities/listing-media.entity';

export interface ListingMediaPort {
  process(media: ListingMediaEntity): Promise<ListingMediaEntity>;
  remove(media: ListingMediaEntity): Promise<void>;
}
