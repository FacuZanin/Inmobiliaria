// backend\src\core\querying\infrastructure\cache\memory\memory-query.cache.ts

import { QueryCache } from '../../../application/caching/contracts/query-cache';

/**
 * Implementación en memoria del QueryCache.
 *
 * USO:
 * 1. Testing: permite testear la lógica de caching sin Redis
 * 2. Desarrollo local: cache L1 sin dependencias externas
 * 3. Environments sin Redis: degradación graceful
 *
 * LIMITACIONES:
 * - No es distribuido: cada instancia tiene su propio cache
 * - No persiste entre restarts
 * - El TTL se verifica en get() (lazy expiration), no hay sweeper activo
 *
 * IMPLEMENTACIÓN DE TAGS:
 * Mantenemos un índice de tag → Set<key> para O(1) de invalidación por tag.
 * La alternativa (iterar todas las keys buscando la tag) es O(n) — inaceptable.
 *
 * NO USAR en producción con múltiples instancias — usar RedisQueryCache.
 */
export class MemoryQueryCache implements QueryCache {
  private readonly store = new Map<
    string,
    { value: unknown; expiresAt: number | null }
  >();

  /** Índice inverso: tag → Set de keys que tienen esa tag. */
  private readonly tagIndex = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Lazy expiration
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    const expiresAt = ttl > 0 ? Date.now() + ttl * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Versión con soporte de tags (necesario para invalidación).
   * El QueryCache interface no incluye tags en set() para mantener
   * la interfaz simple — el CacheWriteStage usa este método directamente.
   */
  async setWithTags<T>(
    key: string,
    value: T,
    ttl: number,
    tags: readonly string[],
  ): Promise<void> {
    await this.set(key, value, ttl);

    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  async invalidate(key: string): Promise<void> {
    this.store.delete(key);
  }

  async invalidateByTags(tags: readonly string[]): Promise<void> {
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag);

      if (!keys) continue;

      for (const key of keys) {
        this.store.delete(key);
      }

      this.tagIndex.delete(tag);
    }
  }

  async has(key: string): Promise<boolean> {
    const result = await this.get(key);
    return result !== null;
  }

  /** Limpia todo el cache — útil en tests de integración. */
  clear(): void {
    this.store.clear();
    this.tagIndex.clear();
  }

  /** Retorna el tamaño actual del cache — útil para debugging. */
  get size(): number {
    return this.store.size;
  }
}