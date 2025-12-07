import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  PropietarioDocumento,
} from './entities/propietario-documento.entity';

import { DocumentoEstado } from '../common/enums/documento-estado.enum';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateEstadoDocumentoDto } from './dto/update-estado.dto';
import { UploadsService } from '../uploads/uploads.service';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/user.entity/user.entity';

@Injectable()
export class PropietarioDocumentosService {
  constructor(
    @InjectRepository(PropietarioDocumento)
    private documentosRepo: Repository<PropietarioDocumento>,
    private uploadsService: UploadsService,
  ) {}

  async subirDocumento(dto: CreateDocumentoDto, archivo: Express.Multer.File, user: User) {
    if (!archivo) throw new BadRequestException('Archivo requerido');

    if (user.role === UserRole.PROPIETARIO && user.id !== dto.propietarioId) {
      throw new ForbiddenException('No podés subir documentación de otro propietario.');
    }

    const archivoUrl = await this.uploadsService.saveFile(archivo);

    const doc = this.documentosRepo.create({
      propietario: { id: dto.propietarioId },
      propiedad: dto.propiedadId ? { id: dto.propiedadId } : null,
      tipoDocumento: dto.tipoDocumento,
      archivoUrl,
    });

    return this.documentosRepo.save(doc);
  }

  async cambiarEstado(id: number, dto: UpdateEstadoDocumentoDto) {
    const doc = await this.documentosRepo.findOne({ where: { id } });

    if (!doc) throw new NotFoundException('Documento no encontrado');

    doc.estado = dto.estado;
    doc.comentarioRechazo = dto.comentarioRechazo ?? null;

    return this.documentosRepo.save(doc);
  }

  async documentosAprobados(propietarioId: number) {
    return this.documentosRepo.find({
      where: {
        propietario: { id: propietarioId },
        estado: DocumentoEstado.APROBADO,
      },
    });
  }
}
