// backend\src\modules\publicaciones\application\services\documentos.service.ts
import { Injectable }
  from '@nestjs/common';

@Injectable()
export class DocumentosService {
  async attachDocuments({
    propertyId,
    dto,
    uploads,
  }: {
    propertyId: number;
    dto: any;
    uploads: any[];
  }) {
    // ---------------------------------------------------
    // PLACEHOLDER ENTERPRISE
    // ---------------------------------------------------

    // Acá después vas a conectar:
    //
    // - Escrituras
    // - DNI
    // - Validaciones legales
    // - OCR
    // - Storage externo
    // - AWS S3
    // - Cloudinary
    // - Firebase
    // - Firma digital
    //
    // Por ahora solo devolvemos metadata

    return {
      success: true,

      propertyId,

      documentsAttached:
        uploads.length,
    };
  }
}