// backend\src\modules\documents\domain\specifications\document-owner-valid.specification.ts
import { DocumentOwnerType } from '../enums/document-owner-type.enum';
import { DocumentType } from '../enums/document-type.enum';

export class DocumentOwnerValidSpecification {
  static isSatisfiedBy(
    ownerType: DocumentOwnerType,
    documentType: DocumentType,
  ): boolean {
    const tenantDocuments = [
      DocumentType.DNI_FRONT,
      DocumentType.DNI_BACK,
      DocumentType.PAYROLL,
      DocumentType.GUARANTEE,
    ];

    const ownerDocuments = [
      DocumentType.PROPERTY_DEED,
      DocumentType.PROPERTY_TAX,
    ];

    if (ownerType === DocumentOwnerType.TENANT) {
      return tenantDocuments.includes(documentType);
    }

    if (ownerType === DocumentOwnerType.USER) {
      return ownerDocuments.includes(documentType);
    }

    return false;
  }
}
