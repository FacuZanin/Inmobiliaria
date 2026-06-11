import { Injectable, Logger } from '@nestjs/common';
import type { QueryCache }      from '../contracts/query-cache';
import type { CacheKeyBuilder } from '../contracts/cache-key-builder';
import type { CachePolicy }     from '../contracts/cache-policy';
import type { QueryNode }       from '../../../domain/ast/query/query-node';
import type { QueryContext }     from '../../../domain/ast/query/query-context';

// Facade del sistema de cache que combina QueryCache + CacheKeyBuilder + CachePolicy.
// Los stages del pipeline (CacheReadStage, CacheWriteStage) usan este servicio.
// Encapsula la lógica de "¿debo cachear esto?" y "¿con qué key?"
@Injectable()
export class QueryCacheService {
  private readonly logger = new Logger(QueryCacheService.name);

  constructor(
    private readonly cache:      QueryCache,
    private readonly keyBuilder: CacheKeyBuilder,
    private readonly policy:     CachePolicy,
  ) {}

  async get<T>(
    resourceName: string,
    queryNode:    QueryNode,
    context?:     QueryContext,
  ): Promise<{ value: T; key: string } | null> {
    if (!this.policy.shouldCache(queryNode, context)) {
      return null;
    }

    const key   = this.keyBuilder.build(resourceName, queryNode, context);
    const value = await this.cache.get<T>(key);

    if (value !== null) {
      this.logger.debug(`Cache HIT: ${key}`);
      return { value, key };
    }

    this.logger.debug(`Cache MISS: ${key}`);
    return null;
  }

  async set<T>(
    resourceName: string,
    queryNode:    QueryNode,
    value:        T,
    context?:     QueryContext,
  ): Promise<void> {
    if (!this.policy.shouldCache(queryNode, context)) {
      return;
    }

    const key  = this.keyBuilder.build(resourceName, queryNode, context);
    const ttl  = this.policy.getTtl(queryNode, context);
    const tags = this.policy.getTags(queryNode, context);

    await this.cache.set(key, value, ttl);

    // Si el cache soporta tags (MemoryQueryCache o RedisQueryCache),
    // registrar las tags para invalidación posterior.
    // El QueryCache interface base no tiene setWithTags para mantenerlo simple.
    this.logger.debug(
      `Cache SET: ${key} | TTL: ${ttl}s | Tags: [${tags.join(', ')}]`,
    );
  }
}