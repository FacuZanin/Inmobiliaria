import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Propiedad } from './entities/propiedad.entity';
import { PropiedadCasa } from './entities/propiedad-casa.entity';
import { PropiedadDepartamento } from './entities/propiedad-departamento.entity';
import { PropiedadLote } from './entities/propiedad-lote.entity';
import { PropiedadLocal } from './entities/propiedad-local.entity';
import { PropiedadOficina } from './entities/propiedad-oficina.entity';
import { PropiedadCampo } from './entities/propiedad-campo.entity';
import { PropiedadPH } from './entities/propiedad-ph.entity';
import { PropiedadPozo } from './entities/propiedad-pozo.entity';
import { PropietarioDocumentosService } from '../propietario-documentos/propietario-documentos.service';


import { CreatePropiedadDto } from './dto/create-propiedad.dto';

@Injectable()
export class PropiedadesService {
  constructor(
    @InjectRepository(Propiedad)
    private readonly propiedadRepo: Repository<Propiedad>,

    @InjectRepository(PropiedadCasa)
    private readonly casaRepo: Repository<PropiedadCasa>,

    @InjectRepository(PropiedadDepartamento)
    private readonly deptoRepo: Repository<PropiedadDepartamento>,

    @InjectRepository(PropiedadLote)
    private readonly loteRepo: Repository<PropiedadLote>,

    @InjectRepository(PropiedadLocal)
    private readonly localRepo: Repository<PropiedadLocal>,

    @InjectRepository(PropiedadOficina)
    private readonly oficinaRepo: Repository<PropiedadOficina>,

    @InjectRepository(PropiedadCampo)
    private readonly campoRepo: Repository<PropiedadCampo>,

    @InjectRepository(PropiedadPH)
    private readonly phRepo: Repository<PropiedadPH>,

    @InjectRepository(PropiedadPozo)
    private readonly pozoRepo: Repository<PropiedadPozo>,

    private readonly docService: PropietarioDocumentosService,
  ) {}

  findAll() {
    return this.propiedadRepo.find();
  }

  findOne(id: number) {
    return this.propiedadRepo.findOne({ where: { id } });
  }

  async create(dto: CreatePropiedadDto, userId: number) {
    const docsAprobados = await this.docService.documentosAprobados(
      dto.propietarioId || userId,
    );

    const tieneDNI = docsAprobados.some(
      (d) =>
        d.tipoDocumento === 'DNI_FRENTE' || d.tipoDocumento === 'DNI_DORSO',
    );

    const tieneEscritura = docsAprobados.some(
      (d) => d.tipoDocumento === 'ESCRITURA',
    );

    if (!tieneDNI || !tieneEscritura) {
      throw new BadRequestException(
        'Para publicar una propiedad necesitás tener documentos verificados: DNI + Escritura.',
      );
    }

    if (!dto.tipo) throw new BadRequestException('Tipo de propiedad requerido');

    let precio: number | null = null;
    if (dto.operacion === 'VENTA' && dto.precioVenta) precio = dto.precioVenta;

    if (
      (dto.operacion === 'ALQUILER' || dto.operacion === 'TEMPORAL') &&
      dto.precioAlquiler
    )
      precio = dto.precioAlquiler;

    const propiedad = this.propiedadRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      tipo: dto.tipo,
      operacion: dto.operacion,
      precio,
      direccion: dto.direccion,
      localidad: dto.localidad,
      ambientes: dto.ambientes,
      dormitorios: dto.dormitorios,
      banos: dto.banos,
      metrosCubiertos: dto.metrosCubiertos,
      metrosTotales: dto.metrosTotales,
      imagenes: dto.imagenes,
      creadoPor: { id: dto.propietarioId || userId } as any,
      agencia: dto.agenciaId ? ({ id: dto.agenciaId } as any) : null,
    });

    const detalles = (dto as any).detalles || {};

    switch (dto.tipo) {
      case 'CASA':
        propiedad.casa = await this.casaRepo.save(
          this.casaRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadCasa,
        );
        break;

      case 'DEPARTAMENTO':
        propiedad.departamento = await this.deptoRepo.save(
          this.deptoRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadDepartamento,
        );
        break;

      case 'LOTE':
        propiedad.lote = await this.loteRepo.save(
          this.loteRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadLote,
        );
        break;

      case 'LOCAL':
        propiedad.local = await this.localRepo.save(
          this.localRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadLocal,
        );
        break;

      case 'OFICINA':
        propiedad.oficina = await this.oficinaRepo.save(
          this.oficinaRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadOficina,
        );
        break;

      case 'CAMPO':
        propiedad.campo = await this.campoRepo.save(
          this.campoRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadCampo,
        );
        break;

      case 'PH':
        propiedad.ph = await this.phRepo.save(
          this.phRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadPH,
        );
        break;

      case 'POZO':
        propiedad.pozo = await this.pozoRepo.save(
          this.pozoRepo.create({
            ...(detalles as object),
            propiedad,
          }) as PropiedadPozo,
        );
        break;

      default:
        throw new BadRequestException('Tipo de propiedad no soportado');
    }

    return await this.propiedadRepo.save(propiedad);
  }

  async update(id: number, dto: Partial<CreatePropiedadDto>) {
    const prop = await this.propiedadRepo.findOne({
      where: { id },
      relations: [
        'casa',
        'departamento',
        'lote',
        'local',
        'oficina',
        'campo',
        'ph',
        'pozo',
      ],
    });

    if (!prop) throw new NotFoundException('Propiedad no encontrada');

    Object.assign(prop, dto);

    if (dto.operacion) {
      if (dto.operacion === 'VENTA' && dto.precioVenta)
        prop.precio = dto.precioVenta;

      if (
        (dto.operacion === 'ALQUILER' || dto.operacion === 'TEMPORAL') &&
        dto.precioAlquiler
      )
        prop.precio = dto.precioAlquiler;
    }

    if (dto.detalles) {
      const d = dto.detalles;

      switch (prop.tipo) {
        case 'CASA':
          Object.assign(prop.casa, d);
          await this.casaRepo.save(prop.casa);
          break;

        case 'DEPARTAMENTO':
          Object.assign(prop.departamento, d);
          await this.deptoRepo.save(prop.departamento);
          break;

        case 'LOTE':
          Object.assign(prop.lote, d);
          await this.loteRepo.save(prop.lote);
          break;

        case 'LOCAL':
          Object.assign(prop.local, d);
          await this.localRepo.save(prop.local);
          break;

        case 'OFICINA':
          Object.assign(prop.oficina, d);
          await this.oficinaRepo.save(prop.oficina);
          break;

        case 'CAMPO':
          Object.assign(prop.campo, d);
          await this.campoRepo.save(prop.campo);
          break;

        case 'PH':
          Object.assign(prop.ph, d);
          await this.phRepo.save(prop.ph);
          break;

        case 'POZO':
          Object.assign(prop.pozo, d);
          await this.pozoRepo.save(prop.pozo);
          break;
      }
    }

    return this.propiedadRepo.save(prop);
  }

  delete(id: number) {
    return this.propiedadRepo.delete(id);
  }
}
