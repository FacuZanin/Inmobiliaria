// backend/src/core/domain/policies/domain-policy.base.ts
import type { Result } from '../../shared-kernel/result/result';

// Base para Domain Policies: encapsulan decisiones de negocio
// que involucran múltiples agregados o servicios externos.
// Ejemplo inmobiliario: ListingPublicationPolicy (verifica suscripción activa,
// fotos mínimas, perfil completo, cuota de listings no superada).
export abstract class DomainPolicy<TContext, TResult = void> {
  abstract evaluate(context: TContext): Promise<Result<TResult>>;
}
