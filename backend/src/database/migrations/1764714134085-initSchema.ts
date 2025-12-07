import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1764714134085 implements MigrationInterface {
    name = 'InitSchema1764714134085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'AGENCIA', 'EMPLEADO', 'PROPIETARIO', 'INQUILINO')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "apellido" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "agenciaId" integer, "telefono" character varying, "avatarUrl" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agencias" ("id" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "direccion" character varying(200) NOT NULL, "localidad" character varying(100) NOT NULL, "email" character varying NOT NULL, "telefono" character varying, "logoUrl" character varying, CONSTRAINT "UQ_80190618c1c1a41250fab1a6510" UNIQUE ("email"), CONSTRAINT "PK_0b03d6cacbc321b0b0e5d25ad2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_tipo_enum" AS ENUM('DEPARTAMENTO', 'CASA', 'PH', 'LOTE', 'LOCAL', 'OFICINA', 'CAMPO', 'POZO')`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_operacion_enum" AS ENUM('VENTA', 'ALQUILER', 'TEMPORAL', 'AMBAS')`);
        await queryRunner.query(`CREATE TABLE "propiedades" ("id" SERIAL NOT NULL, "titulo" character varying(150) NOT NULL, "descripcion" text, "tipo" "public"."propiedades_tipo_enum" NOT NULL, "operacion" "public"."propiedades_operacion_enum" NOT NULL, "precio" integer, "direccion" character varying(200) NOT NULL, "localidad" character varying(120) NOT NULL, "ambientes" integer, "dormitorios" integer, "banos" integer, "metrosCubiertos" integer, "metrosTotales" integer, "imagenes" text, "activo" boolean NOT NULL DEFAULT true, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "agenciaId" integer, "creadoPorId" integer, CONSTRAINT "PK_ee3a1dc8c0d17c197d54bc2ff37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."operaciones_tipo_enum" AS ENUM('VENTA', 'ALQUILER', 'TEMPORAL', 'AMBAS')`);
        await queryRunner.query(`CREATE TYPE "public"."operaciones_estado_enum" AS ENUM('PENDIENTE', 'RESERVADA', 'EN_PROCESO', 'FINALIZADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TYPE "public"."operaciones_medio_enum" AS ENUM('WHATSAPP', 'TELEFONO', 'EMAIL', 'PRESENCIAL', 'WEB')`);
        await queryRunner.query(`CREATE TABLE "operaciones" ("id" SERIAL NOT NULL, "tipo" "public"."operaciones_tipo_enum" NOT NULL, "estado" "public"."operaciones_estado_enum" NOT NULL DEFAULT 'PENDIENTE', "medio" "public"."operaciones_medio_enum", "fechaReserva" TIMESTAMP, "fechaFinalizacion" TIMESTAMP, "observaciones" text, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "propiedadId" integer, "agenciaId" integer, "propietarioDirectoId" integer, "creadoPorId" integer NOT NULL, "compradorInquilinoId" integer, CONSTRAINT "PK_c52d2f0bc2772a24657bdd4c676" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_7ee6e4cef5309b7e24b5c3a9ae8" FOREIGN KEY ("agenciaId") REFERENCES "agencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "propiedades" ADD CONSTRAINT "FK_0f4747086249968b555016c8cad" FOREIGN KEY ("agenciaId") REFERENCES "agencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "propiedades" ADD CONSTRAINT "FK_1b6d5168085ede878972e0d2b54" FOREIGN KEY ("creadoPorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operaciones" ADD CONSTRAINT "FK_d5b016abfae21326430edbb976a" FOREIGN KEY ("propiedadId") REFERENCES "propiedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operaciones" ADD CONSTRAINT "FK_119adadeb210b3b8d566b4b90a9" FOREIGN KEY ("agenciaId") REFERENCES "agencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operaciones" ADD CONSTRAINT "FK_471cbdf0039e65b3a18ec69a519" FOREIGN KEY ("propietarioDirectoId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operaciones" ADD CONSTRAINT "FK_be8ca2d55e1d886e4096c17f8a6" FOREIGN KEY ("creadoPorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operaciones" ADD CONSTRAINT "FK_47313219b7b1e1ef029470d61f8" FOREIGN KEY ("compradorInquilinoId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operaciones" DROP CONSTRAINT "FK_47313219b7b1e1ef029470d61f8"`);
        await queryRunner.query(`ALTER TABLE "operaciones" DROP CONSTRAINT "FK_be8ca2d55e1d886e4096c17f8a6"`);
        await queryRunner.query(`ALTER TABLE "operaciones" DROP CONSTRAINT "FK_471cbdf0039e65b3a18ec69a519"`);
        await queryRunner.query(`ALTER TABLE "operaciones" DROP CONSTRAINT "FK_119adadeb210b3b8d566b4b90a9"`);
        await queryRunner.query(`ALTER TABLE "operaciones" DROP CONSTRAINT "FK_d5b016abfae21326430edbb976a"`);
        await queryRunner.query(`ALTER TABLE "propiedades" DROP CONSTRAINT "FK_1b6d5168085ede878972e0d2b54"`);
        await queryRunner.query(`ALTER TABLE "propiedades" DROP CONSTRAINT "FK_0f4747086249968b555016c8cad"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_7ee6e4cef5309b7e24b5c3a9ae8"`);
        await queryRunner.query(`DROP TABLE "operaciones"`);
        await queryRunner.query(`DROP TYPE "public"."operaciones_medio_enum"`);
        await queryRunner.query(`DROP TYPE "public"."operaciones_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."operaciones_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "propiedades"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_operacion_enum"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "agencias"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
