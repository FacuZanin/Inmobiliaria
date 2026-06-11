// backend\src\core\querying\infrastructure\cache\redis\redis-query.cache.ts

import { Logger } from '@nestjs/common';
import { QueryCache } from '../../../application/caching/contracts/query-cache';

/**
 * Interfaz mínima de Redis que necesitamos.
 * Permite inyectar ioredis, @nestjs/cache-manager, o cualquier cliente Redis.
 * No acoplamos al cliente específico — el módulo que configura esto decide.
 */
export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, px: 'PX', ttlMs: number): Promise<unknown>;
  set(key: string, value: string): Promise<unknown>;
  del(...keys: string[]): Promise<number>;
  exists(key: string): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  pipeline(): RedisPipeline;
}

export interface RedisPipeline {
  del(key: string): this;
  exec(): Promise<unknown>;
}

/**
 * Implementación Redis del QueryCache con soporte de tag-based invalidation.
 *
 * IMPLEMENTACIÓN DE TAGS EN REDIS:
 * Para cada tag, mantenemos un Redis Set: tag_key → {cache_key_1, cache_key_2, ...}
 * La invalidación por tag es: SMEMBERS tag_key → DEL cada cache_key → DEL tag_key
 *
 * COMPLEJIDAD:
 * - get: O(1)
 * - set + tags: O(T) donde T = número de tags
 * - invalidateByTags: O(T * K) donde K = keys por tag (típicamente pequeño)
 *
 * SERIALIZACIÓN:
 * Usamos JSON.stringify/parse. Para payloads muy grandes (>100KB),
 * considerar MessagePack o protobuf. En una proptech, los listings
 * raramente superan 10KB por página.
 *
 * MANEJO DE ERRORES:
 * Las operaciones de cache SON NOT en el camino crítico — si Redis falla,
 * el sistema debe degradar gracefully y servir desde la DB.
 * Por eso, los errores se loggean pero no se propagan al caller.
 * (El CacheReadStage retorna cache miss en caso de error.)
 *
 * PREFIX DE TAGS EN REDIS:
 * Usamos 'qtag:' para separar tag-sets de los valores de cache.
 * Esto facilita el monitoreo con `redis-cli KEYS qtag:*`.
 */
export class RedisQueryCache implements QueryCache {
  private static readonly TAG_PREFIX = 'qtag:';
  private readonly logger = new Logger(RedisQueryCache.name);

  constructor(
    private readonly redis: RedisClient,
    private readonly keyPrefix: string = 'qry',
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(this.prefixed(key));

      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as T;
    } catch (error) {
      this.logger.warn(`Cache get error for key "${key}": ${String(error)}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.setWithTags(key, value, ttl, []);
  }

  async setWithTags<T>(
    key: string,
    value: T,
    ttl: number,
    tags: readonly string[],
  ): Promise<void> {
    try {
      const prefixedKey = this.prefixed(key);
      const serialized = JSON.stringify(value);

      if (ttl > 0) {
        await this.redis.set(prefixedKey, serialized, 'PX', ttl * 1000);
      } else {
        await this.redis.set(prefixedKey, serialized);
      }

      // Registrar la key en cada tag-set para invalidación posterior
      for (const tag of tags) {
        const tagKey = this.tagKey(tag);
        await this.redis.sadd(tagKey, prefixedKey);
      }
    } catch (error) {
      this.logger.warn(`Cache set error for key "${key}": ${String(error)}`);
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await this.redis.del(this.prefixed(key));
    } catch (error) {
      this.logger.warn(`Cache invalidate error for key "${key}": ${String(error)}`);
    }
  }

  async invalidateByTags(tags: readonly string[]): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();

      for (const tag of tags) {
        const tagKey = this.tagKey(tag);
        const members = await this.redis.smembers(tagKey);

        for (const key of members) {
          pipeline.del(key);
        }

        pipeline.del(tagKey);
      }

      await pipeline.exec();
    } catch (error) {
      this.logger.warn(`Cache invalidateByTags error: ${String(error)}`);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(this.prefixed(key));
      return exists === 1;
    } catch {
      return false;
    }
  }

  private prefixed(key: string): string {
    return `${this.keyPrefix}:${key}`;
  }

  private tagKey(tag: string): string {
    return `${RedisQueryCache.TAG_PREFIX}${tag}`;
  }
}