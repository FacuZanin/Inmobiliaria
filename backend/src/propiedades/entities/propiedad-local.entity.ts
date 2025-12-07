import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Propiedad } from './propiedad.entity';

@Entity('propiedad_locales')
export class PropiedadLocal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  vidrieraMetros: number;

  @Column({ default: false })
  deposito: boolean;

  @Column({ nullable: true })
  baños: number;

  @Column({ default: false })
  aptoGastronomico: boolean;

  @Column({ default: false })
  luzTrifasica: boolean;

@OneToOne(() => Propiedad, (p) => p.local, {
  onDelete: 'CASCADE',
  eager: false,
})
@JoinColumn()
propiedad: Propiedad;

}
