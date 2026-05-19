import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTipoSolicitadoToAgenciaSolicitudes1779120100000
  implements MigrationInterface
{
  name = 'AddTipoSolicitadoToAgenciaSolicitudes1779120100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE t.typname = 'agencia_solicitudes_tiposolicitado_enum'
            AND n.nspname = 'public'
        ) THEN
          CREATE TYPE "public"."agencia_solicitudes_tiposolicitado_enum" AS ENUM(
            'INMOBILIARIA',
            'CORREDOR',
            'MARTILLERO',
            'BROKER',
            'DESARROLLADOR',
            'CONSTRUCTOR',
            'ARQUITECTO',
            'DECORADOR',
            'TASADOR'
          );
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "agencia_solicitudes"
      ADD COLUMN IF NOT EXISTS "tipoSolicitado" "public"."agencia_solicitudes_tiposolicitado_enum" NOT NULL DEFAULT 'INMOBILIARIA'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "agencia_solicitudes"
      DROP COLUMN IF EXISTS "tipoSolicitado"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."agencia_solicitudes_tiposolicitado_enum"
    `);
  }
}
