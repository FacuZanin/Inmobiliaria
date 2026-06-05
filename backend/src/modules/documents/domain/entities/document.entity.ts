// backend\src\modules\documents\domain\entities\document.entity.ts

import { DocumentOwnerEntity } from './document-owner.entity';
import { DocumentVerificationEntity } from './document-verification.entity';

import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';

import { InvalidDocumentStatusException } from '../exceptions/invalid-document-status.exception';
import { InvalidDocumentFileException } from '../exceptions/invalid-document-file.exception';
import { UnsupportedDocumentTypeException } from '../exceptions/unsupported-document-type.exception';

import { DocumentApprovedEvent } from '../events/document-approved.event';
import { DocumentRejectedEvent } from '../events/document-rejected.event';
import { DocumentUploadedEvent } from '../events/document-uploaded.event';
import { DocumentReplacedEvent } from '../events/document-replaced.event';
import { DocumentStatusChangedEvent } from '../events/document-status-changed.event';

import { DocumentReviewableSpecification } from '../specifications/document-reviewable.specification';
import { DocumentReplaceableSpecification } from '../specifications/document-replaceable.specification';

import { AggregateRoot } from '@/core/domain/aggregates/aggregate-root';

export class DocumentEntity extends AggregateRoot {
  private _fileUrl: string;

  private _verification: DocumentVerificationEntity;

  private constructor(
    public readonly id: number | null,

    public readonly owner: DocumentOwnerEntity,

    public readonly type: DocumentType,

    fileUrl: string,

    verification: DocumentVerificationEntity,

    public readonly createdAt: Date,
  ) {
    super();

    this.ensureValidType(type);
    this.ensureValidFileUrl(fileUrl);

    this._fileUrl = fileUrl;
    this._verification = verification;
  }

  static create(params: {
    owner: DocumentOwnerEntity;
    type: DocumentType;
    fileUrl: string;
  }): DocumentEntity {
    const document = new DocumentEntity(
      null,
      params.owner,
      params.type,
      params.fileUrl,
      new DocumentVerificationEntity(DocumentStatus.PENDING),
      new Date(),
    );

    document.addDomainEvent(
      new DocumentUploadedEvent(params.owner.ownerId, params.type),
    );

    return document;
  }

  static hydrate(params: {
    id: number;
    owner: DocumentOwnerEntity;
    type: DocumentType;
    fileUrl: string;
    verification: DocumentVerificationEntity;
    createdAt: Date;
  }): DocumentEntity {
    return new DocumentEntity(
      params.id,
      params.owner,
      params.type,
      params.fileUrl,
      params.verification,
      params.createdAt,
    );
  }

  get fileUrl(): string {
    return this._fileUrl;
  }

  get verification(): DocumentVerificationEntity {
    return this._verification;
  }

  get status(): DocumentStatus {
    return this._verification.status;
  }

  approve(adminId: number): void {
    this.ensureReviewable();

    this._verification = this._verification.approve(adminId);

    this.addDomainEvent(new DocumentApprovedEvent(this.id, adminId));

    this.addDomainEvent(
      new DocumentStatusChangedEvent(this.id, DocumentStatus.APPROVED),
    );
  }

  reject(adminId: number, reason: string): void {
    this.ensureReviewable();

    this._verification = this._verification.reject(adminId, reason);

    this.addDomainEvent(new DocumentRejectedEvent(this.id, adminId, reason));

    this.addDomainEvent(
      new DocumentStatusChangedEvent(this.id, DocumentStatus.REJECTED),
    );
  }

  markUnderReview(): void {
    if (this.status !== DocumentStatus.PENDING) {
      throw new InvalidDocumentStatusException(
        'Only pending documents can be reviewed.',
      );
    }

    this._verification = this._verification.markUnderReview();

    this.addDomainEvent(
      new DocumentStatusChangedEvent(this.id, DocumentStatus.UNDER_REVIEW),
    );
  }

  replaceFile(newFileUrl: string): void {
    this.ensureReplaceable();

    this.ensureValidFileUrl(newFileUrl);

    const oldFileUrl = this._fileUrl;

    this._fileUrl = newFileUrl;

    this._verification = new DocumentVerificationEntity(DocumentStatus.PENDING);

    this.addDomainEvent(
      new DocumentReplacedEvent(this.id, oldFileUrl, newFileUrl),
    );

    this.addDomainEvent(
      new DocumentStatusChangedEvent(this.id, DocumentStatus.PENDING),
    );
  }

  private ensureReviewable(): void {
    if (!DocumentReviewableSpecification.isSatisfiedBy(this.status)) {
      throw new InvalidDocumentStatusException(
        `Document cannot be reviewed from status ${this.status}`,
      );
    }
  }

  private ensureReplaceable(): void {
    if (!DocumentReplaceableSpecification.isSatisfiedBy(this.status)) {
      throw new InvalidDocumentStatusException(
        `Document cannot be replaced from status ${this.status}`,
      );
    }
  }

  private ensureValidType(type: DocumentType): void {
    if (!Object.values(DocumentType).includes(type)) {
      throw new UnsupportedDocumentTypeException(type);
    }
  }

  private ensureValidFileUrl(fileUrl: string): void {
    if (!fileUrl?.trim()) {
      throw new InvalidDocumentFileException(
        'Document file url cannot be empty.',
      );
    }
  }
}
