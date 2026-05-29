import type { DomainEvent } from '@/shared/domain/events/domain-event';

import type { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import type { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import type { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';
import type { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

export type PropertyPublishedPayload = {
  propertyId: number;
  title: string;
  type: PropiedadTipo;
  operation: OperacionTipo;
  commercialStatus: PropertyStatus;
  moderationStatus: PublicacionStatus;
  ownerId: number | null;
  agencyId: number | null;
};

export class PropertyPublishedEvent
  implements DomainEvent<PropertyPublishedPayload>
{
  readonly name = 'property.published';
  readonly aggregateId: string;
  readonly occurredAt = new Date();

  constructor(readonly payload: PropertyPublishedPayload) {
    this.aggregateId = String(payload.propertyId);
  }
}
