// backend/src/core/shared-kernel/types/branded.type.ts
declare const __brand: unique symbol;
export type Brand<T, B> = T & { readonly [__brand]: B };

export type ListingId = Brand<string, 'ListingId'>;
export type UserId = Brand<string, 'UserId'>;
export type PropertyId = Brand<string, 'PropertyId'>;
export type TenantId = Brand<string, 'TenantId'>;
export type SubscriptionId = Brand<string, 'SubscriptionId'>;
