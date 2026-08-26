import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Introduz `role` (enum) como fonte de verdade da autorização e remove `is_admin`.
 * Backfill: usuários com is_admin=true viram role='admin'; os demais 'usuario'.
 * `is_admin` passa a ser derivado de `role` na entidade (getter), sem coluna no banco.
 */
export class AddRoleToUsuario1766100000000 implements MigrationInterface {
  name = 'AddRoleToUsuario1766100000000';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usuario_role_enum') THEN
          CREATE TYPE "public"."usuario_role_enum" AS ENUM('usuario', 'moderador', 'admin');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "usuario"
      ADD COLUMN IF NOT EXISTS "role" "public"."usuario_role_enum" NOT NULL DEFAULT 'usuario'
    `);

    // Backfill + remoção de is_admin só se a coluna ainda existir (idempotente).
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'usuario' AND column_name = 'is_admin'
        ) THEN
          UPDATE "usuario" SET "role" = 'admin' WHERE "is_admin" = true;
          ALTER TABLE "usuario" DROP COLUMN "is_admin";
        END IF;
      END $$;
    `);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario"
      ADD COLUMN IF NOT EXISTS "is_admin" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`UPDATE "usuario" SET "is_admin" = true WHERE "role" = 'admin'`);
    await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN IF EXISTS "role"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."usuario_role_enum"`);
  }
}
