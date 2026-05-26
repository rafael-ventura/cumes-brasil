import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona coluna conquistas_publico na tabela usuario.
 * Default true (visível para visitantes) para novos e existentes.
 */
export class AddConquistasPublicoToUsuario1740000001000 implements MigrationInterface {
  name = 'AddConquistasPublicoToUsuario1740000001000';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuario" ADD COLUMN IF NOT EXISTS "conquistas_publico" boolean DEFAULT true`
    );
    await queryRunner.query(
      `UPDATE "usuario" SET "conquistas_publico" = true WHERE "conquistas_publico" IS NULL`
    );
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuario" DROP COLUMN IF EXISTS "conquistas_publico"`
    );
  }
}

