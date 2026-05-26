import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona coluna link_externo na tabela usuario.
 */
export class AddLinkExternoToUsuario1740000000000 implements MigrationInterface {
  name = 'AddLinkExternoToUsuario1740000000000';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuario" ADD COLUMN IF NOT EXISTS "link_externo" text NULL`
    );
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN IF EXISTS "link_externo"`);
  }
}

