import { Injectable, Logger } from '@nestjs/common';
import type { CacheInvalidator } from '../contracts/cache-invalidator';
import type { QueryCache }       from '../contracts/query-cache';

// Implementación del CacheInvalidator que delega al QueryCache.
// Los CommandHandlers y EventHandlers del write-side inyectan este servicio
// para invalidar el cache cuando mutan un agregado.
//
// Ejemplo de uso desde un EventHandler:
//   @EventsHandler(ListingPriceChangedEvent)
//   class InvalidateListingCacheHandler {
//     constructor(private readonly invalidator: CacheInvalidationService) {}
//     async handle(event: ListingPriceChangedEvent) {
//       await this.invalidator.invalidateByTags([
//         `entity:listing:${event.listingId}`,
//         'listing',
//       ]);
//     }
//   }
@Injectable()
export class CacheInvalidationService implements CacheInvalidator {
  private readonly logger = new Logger(CacheInvalidationService.name);

  constructor(private readonly cache: QueryCache) {}

  async invalidateByTags(tags: readonly string[]): Promise<void> {
    this.logger.debug(`Invalidating cache by tags: [${tags.join(', ')}]`);
    await this.cache.invalidateByTags(tags);
  }

  async invalidateByKey(key: string): Promise<void> {
    this.logger.debug(`Invalidating cache key: ${key}`);
    await this.cache.invalidate(key);
  }

  async invalidateResource(resourceName: string): Promise<void> {
    this.logger.warn(
      `Full resource cache invalidation: ${resourceName}. ` +
      'This is an expensive operation — use only on deploys or schema changes.',
    );
    await this.cache.invalidateByTags([resourceName]);
  }
}