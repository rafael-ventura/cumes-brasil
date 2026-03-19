import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona coluna perfil_publico na tabela usuario.
 * Default true (público) para novos e existentes.
 */
export class AddPerfilPublicoToUsuario1739940000000 implements MigrationInterface {
  name = 'AddPerfilPublicoToUsuario1739940000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuario" ADD COLUMN IF NOT EXISTS "perfil_publico" boolean DEFAULT true`
    );
    await queryRunner.query(
      `UPDATE "usuario" SET "perfil_publico" = true WHERE "perfil_publico" IS NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN IF EXISTS "perfil_publico"`);
  }
}
