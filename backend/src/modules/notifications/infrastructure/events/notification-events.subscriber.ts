import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DOMAIN_EVENT_PUBLISHER } from '@/core/application/ports/domain-event-publisher.token';
import type { DomainEvent } from '@/core/domain/events/domain-event.base';
import type { IDomainEventPublisher } from '@/core/domain/events/domain-event-publisher.interface';
import { DOCUMENT_REPOSITORY } from '@/modules/documents/application/tokens/document.tokens';
import type { DocumentRepositoryPort } from '@/modules/documents/domain/repositories/document.repository.port';
import { NotificationType } from '@/modules/notifications/domain/enums/notification-type.enum';
import { CreateNotificationUseCase } from '@/modules/notifications/application/use-cases/create-notification.usecase';

type RegisterablePublisher = IDomainEventPublisher & {
  register?: (
    eventName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ) => void;
};

type VisitPayload = {
  visitId: number | null;
  listingId: number;
  requesterId: number;
  ownerId: number;
  agencyId: number | null;
};

@Injectable()
export class NotificationEventsSubscriber implements OnModuleInit {
  constructor(
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly publisher: RegisterablePublisher,

    @Inject(DOCUMENT_REPOSITORY)
    private readonly documents: DocumentRepositoryPort,

    private readonly createNotification: CreateNotificationUseCase,
  ) {}

  onModuleInit() {
    if (!this.publisher.register) {
      return;
    }

    this.publisher.register('documents.document.approved', (event) =>
      this.handleDocumentApproved(event),
    );

    this.publisher.register('documents.document.rejected', (event) =>
      this.handleDocumentRejected(event as DomainEvent<{ reason?: string }>),
    );

    this.publisher.register('visit.requested', (event) =>
      this.handleVisitRequested(event as DomainEvent<VisitPayload>),
    );

    this.publisher.register('visit.accepted', (event) =>
      this.handleVisitAccepted(event as DomainEvent<VisitPayload>),
    );

    this.publisher.register('visit.rejected', (event) =>
      this.handleVisitRejected(event as DomainEvent<VisitPayload>),
    );

    this.publisher.register('visit.cancelled', (event) =>
      this.handleVisitCancelled(event as DomainEvent<VisitPayload>),
    );

    this.publisher.register('visit.rescheduled', (event) =>
      this.handleVisitRescheduled(event as DomainEvent<VisitPayload>),
    );

    this.publisher.register('visit.done', (event) =>
      this.handleVisitDone(event as DomainEvent<VisitPayload>),
    );

    this.publisher.register('listing.moderated', (event) =>
      this.handleListingModerated(event as DomainEvent<{
        listingId: number;
        ownerId: number;
        status: string;
        reason?: string | null;
      }>),
    );

    this.publisher.register('agency.request.approved', (event) =>
      this.handleAgencyRequestApproved(event as DomainEvent<{
        userId: number;
        agencyId: number | null;
        userType: string;
      }>),
    );
  }

  private async handleDocumentApproved(event: DomainEvent) {
    const document = await this.findDocumentFromEvent(event);

    if (!document) return;

    await this.createNotification.execute({
      recipientId: document.owner.ownerId,
      type: NotificationType.DOCUMENT_APPROVED,
      title: 'Documento aprobado',
      body: 'Tu documento fue aprobado.',
      data: {
        documentId: document.id,
        documentType: document.type,
      },
    });
  }

  private async handleDocumentRejected(event: DomainEvent<{ reason?: string }>) {
    const document = await this.findDocumentFromEvent(event);

    if (!document) return;

    await this.createNotification.execute({
      recipientId: document.owner.ownerId,
      type: NotificationType.DOCUMENT_REJECTED,
      title: 'Documento rechazado',
      body: event.payload?.reason
        ? `Tu documento fue rechazado: ${event.payload.reason}`
        : 'Tu documento fue rechazado.',
      data: {
        documentId: document.id,
        documentType: document.type,
        reason: event.payload?.reason ?? null,
      },
    });
  }

  private async handleVisitRequested(event: DomainEvent<VisitPayload>) {
    const payload = event.payload;
    if (!payload) return;

    await this.createNotification.execute({
      recipientId: payload.ownerId,
      type: NotificationType.VISIT_REQUESTED,
      title: 'Nueva solicitud de visita',
      body: 'Recibiste una nueva solicitud de visita.',
      data: payload,
    });
  }

  private async handleVisitAccepted(event: DomainEvent<VisitPayload>) {
    const payload = event.payload;
    if (!payload) return;

    await this.createNotification.execute({
      recipientId: payload.requesterId,
      type: NotificationType.VISIT_ACCEPTED,
      title: 'Visita aceptada',
      body: 'Tu solicitud de visita fue aceptada.',
      data: payload,
    });
  }

  private async handleVisitRejected(event: DomainEvent<VisitPayload>) {
    const payload = event.payload;
    if (!payload) return;

    await this.createNotification.execute({
      recipientId: payload.requesterId,
      type: NotificationType.VISIT_REJECTED,
      title: 'Visita rechazada',
      body: 'Tu solicitud de visita fue rechazada.',
      data: payload,
    });
  }

  private async handleVisitCancelled(event: DomainEvent<VisitPayload>) {
    await this.notifyVisitParticipants(
      event.payload,
      NotificationType.VISIT_CANCELLED,
      'Visita cancelada',
      'Una visita fue cancelada.',
    );
  }

  private async handleVisitRescheduled(event: DomainEvent<VisitPayload>) {
    await this.notifyVisitParticipants(
      event.payload,
      NotificationType.VISIT_RESCHEDULED,
      'Visita reprogramada',
      'Una visita fue reprogramada y queda pendiente de confirmacion.',
    );
  }

  private async handleVisitDone(event: DomainEvent<VisitPayload>) {
    const payload = event.payload;
    if (!payload) return;

    await this.createNotification.execute({
      recipientId: payload.requesterId,
      type: NotificationType.VISIT_DONE,
      title: 'Visita realizada',
      body: 'La visita fue marcada como realizada.',
      data: payload,
    });
  }

  private async handleListingModerated(
    event: DomainEvent<{
      listingId: number;
      ownerId: number;
      status: string;
      reason?: string | null;
    }>,
  ) {
    const payload = event.payload;
    if (!payload) return;

    await this.createNotification.execute({
      recipientId: payload.ownerId,
      type: NotificationType.LISTING_MODERATED,
      title: 'Publicacion moderada',
      body: `Tu publicacion fue moderada con estado ${payload.status}.`,
      data: payload,
    });
  }

  private async handleAgencyRequestApproved(
    event: DomainEvent<{
      userId: number;
      agencyId: number | null;
      userType: string;
    }>,
  ) {
    const payload = event.payload;
    if (!payload) return;

    await this.createNotification.execute({
      recipientId: payload.userId,
      type: NotificationType.AGENCY_REQUEST_APPROVED,
      title: 'Solicitud aprobada',
      body: 'Tu solicitud profesional fue aprobada.',
      data: payload,
    });
  }

  private async notifyVisitParticipants(
    payload: VisitPayload | undefined,
    type: NotificationType,
    title: string,
    body: string,
  ) {
    if (!payload) return;

    const recipients = new Set([payload.requesterId, payload.ownerId]);

    for (const recipientId of recipients) {
      await this.createNotification.execute({
        recipientId,
        type,
        title,
        body,
        data: payload,
      });
    }
  }

  private async findDocumentFromEvent(event: DomainEvent) {
    const documentId = Number(event.aggregateId);

    if (!documentId) {
      return null;
    }

    return this.documents.findById(documentId);
  }
}
