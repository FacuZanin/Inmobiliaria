// backend\src\modules\inquilinos\domain\entities\inquilino.entity.ts
import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';

import { Favorito } from './favorito.entity';
import { SolicitudVisita } from './solicitud-visita.entity';

@Entity('inquilinos')
export class Inquilino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  nombre?: string;

  @Column()
  userId: number;

  @Column({ nullable: true })
  telefonoAlternativo?: string;

  @Column({ nullable: true })
  ingresosMensuales?: number;

  @Column({ nullable: true })
  antiguedadLaboralMeses?: number;

  @Column({ default: false })
  tieneGarante?: boolean;

  @Column({ default: false })
  tieneMascota?: boolean;

  @Column({ nullable: true })
  operacionBuscada?: 'ALQUILER' | 'COMPRA';

  @Column({ nullable: true })
  presupuestoMaximo?: number;

  @Column('text', { array: true, nullable: true })
  zonasPreferidas?: string[];

  @OneToMany(() => Favorito, (f) => f.inquilino, {
    cascade: true,
    eager: true,
  })
  favoritos!: Favorito[];

  @OneToMany(() => SolicitudVisita, (s) => s.inquilino, {
    cascade: true,
    eager: true,
  })
  solicitudesVisita!: SolicitudVisita[];

  // =====================
  // Domain behavior
  // =====================

  agregarFavorito(propiedadId: number): void {
    const existe = this.favoritos.some((f) => f.propiedadId === propiedadId);

    if (existe) return;

    const favorito = new Favorito();
    favorito.propiedadId = propiedadId;
    favorito.inquilino = this;

    this.favoritos.push(favorito);
  }

  crearSolicitudVisita(dto: {
    propiedadId: number;
    mensaje: string;
    fechaDeseada: Date;
  }): void {
    const visita = new SolicitudVisita();

    visita.propiedadId = dto.propiedadId;
    visita.mensaje = dto.mensaje;
    visita.fechaDeseada = dto.fechaDeseada;
    visita.estado = 'PENDIENTE';
    visita.inquilino = this;

    this.solicitudesVisita.push(visita);
  }

  actualizarPerfil(dto: {
    telefonoAlternativo?: string;
    ingresosMensuales?: number;
    antiguedadLaboralMeses?: number;
    tieneGarante?: boolean;
    tieneMascota?: boolean;
    operacionBuscada?: 'ALQUILER' | 'COMPRA';
    presupuestoMaximo?: number;
    zonasPreferidas?: string[];
  }): void {
    if (dto.telefonoAlternativo !== undefined) {
      this.telefonoAlternativo = dto.telefonoAlternativo;
    }

    if (dto.ingresosMensuales !== undefined) {
      this.ingresosMensuales = dto.ingresosMensuales;
    }

    if (dto.antiguedadLaboralMeses !== undefined) {
      this.antiguedadLaboralMeses = dto.antiguedadLaboralMeses;
    }

    if (dto.tieneGarante !== undefined) {
      this.tieneGarante = dto.tieneGarante;
    }

    if (dto.tieneMascota !== undefined) {
      this.tieneMascota = dto.tieneMascota;
    }

    if (dto.operacionBuscada !== undefined) {
      this.operacionBuscada = dto.operacionBuscada;
    }

    if (dto.presupuestoMaximo !== undefined) {
      this.presupuestoMaximo = dto.presupuestoMaximo;
    }

    if (dto.zonasPreferidas !== undefined) {
      this.zonasPreferidas = dto.zonasPreferidas;
    }
  }
}
