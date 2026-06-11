export interface CacheableQuery {
  readonly cache?: {
    readonly enabled: boolean;

    readonly ttl?: number;

    readonly tags?: readonly string[];
  };
}