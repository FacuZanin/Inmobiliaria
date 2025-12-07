import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  InquilinoDocumento,
  TipoDocumentoInquilino,
} from './entities/inquilino-documento.entity';
import { DocumentoEstado } from '../common/enums/documento-estado.enum';
import { Inquilino } from '../inquilinos/entities/inquilino.entity';
import { CreateInquilinoDocumentoDto } from './dto/create-inquilino-documento.dto';
import { UpdateInquilinoDocumentoDto } from './dto/update-inquilino-documento.dto';
import { UploadsService } from '../uploads/uploads.service';
import { User } from '../users/user.entity/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { DocumentoAudit, DocumentoAuditAction } from '../admin-documentos/entities/documento-audit.entity';

@Injectable()
export class InquilinoDocumentosService {
  constructor(
    @InjectRepository(InquilinoDocumento)
    private documentosRepo: Repository<InquilinoDocumento>,

    @InjectRepository(Inquilino)
    private inquilinoRepo: Repository<Inquilino>,

    @InjectRepository(DocumentoAudit)
    private auditRepo: Repository<DocumentoAudit>,

    private uploadsService: UploadsService,
  ) {}

async subirDocumento(
  dto: CreateInquilinoDocumentoDto,
  archivo: Express.Multer.File,
  user: User,
) {
  if (!archivo) throw new BadRequestException('Archivo requerido.');

  const inquilino = await this.inquilinoRepo.findOne({
    where: { user: { id: user.id } },
  });

  if (!inquilino)
    throw new ForbiddenException('Solo un inquilino puede subir documentos.');

  // 🔍 Verificar si ya existe un documento del mismo tipo
  const existente = await this.documentosRepo.findOne({
    where: {
      inquilino: { id: inquilino.id },
      tipoDocumento: dto.tipoDocumento,
    },
  });

  // 📌 Guardar archivo
  const archivoUrl = await this.uploadsService.saveFile(archivo);

  if (existente) {
    const oldUrl = existente.archivoUrl;

    // 🟡 Actualizar documento existente
    existente.archivoUrl = archivoUrl;
    existente.estado = DocumentoEstado.PENDIENTE;
    existente.comentarioRechazo = null;

    const saved = await this.documentosRepo.save(existente);

    // 🔥 Registrar auditoría de reemplazo
    await this.auditRepo.save({
      documentoId: saved.id,
      documentoTipo: 'INQUILINO',
      action: DocumentoAuditAction.REEMPLAZADO,
      performedById: user.id,
      comentario: `Documento reemplazado. Archivo anterior: ${oldUrl}`,
      datosExtras: { oldUrl, newUrl: archivoUrl },
    });

    return saved;
  }

  // 🟢 Crear un documento nuevo
  const doc = this.documentosRepo.create({
    inquilino,
    archivoUrl,
    tipoDocumento: dto.tipoDocumento,
  });

  const savedNew = await this.documentosRepo.save(doc);

  // 🔥 Auditoría de creación
  await this.auditRepo.save({
    documentoId: savedNew.id,
    documentoTipo: 'INQUILINO',
    action: DocumentoAuditAction.CREADO,
    performedById: user.id,
  });

  return savedNew;
}


  async cambiarEstado(id: number, dto: UpdateInquilinoDocumentoDto) {
    const doc = await this.documentosRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Documento no encontrado');

    doc.estado = dto.estado;
    doc.comentarioRechazo = dto.comentarioRechazo ?? null;

    return this.documentosRepo.save(doc);
  }

  async listarParaInquilino(user: User) {
    return this.documentosRepo.find({
      where: { inquilino: { user: { id: user.id } } },
    });
  }

  async documentosAprobados(inquilinoId: number) {
    return this.documentosRepo.find({
      where: {
        inquilino: { id: inquilinoId },
        estado: DocumentoEstado.APROBADO,
      },
    });
  }
}
