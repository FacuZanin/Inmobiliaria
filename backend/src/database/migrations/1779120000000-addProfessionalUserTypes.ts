import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfessionalUserTypes1779120000000
  implements MigrationInterface
{
  name = 'AddProfessionalUserTypes1779120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE t.typname = 'users_tipo_enum'
            AND n.nspname = 'public'
        ) THEN
          ALTER TYPE "public"."users_tipo_enum" ADD VALUE IF NOT EXISTS 'ARQUITECTO';
          ALTER TYPE "public"."users_tipo_enum" ADD VALUE IF NOT EXISTS 'DECORADOR';
          ALTER TYPE "public"."users_tipo_enum" ADD VALUE IF NOT EXISTS 'TASADOR';
        END IF;
      END
      $$;
    `);
  }

  public async down(): Promise<void> {
    // PostgreSQL cannot safely remove enum values without rebuilding the type.
  }
}
