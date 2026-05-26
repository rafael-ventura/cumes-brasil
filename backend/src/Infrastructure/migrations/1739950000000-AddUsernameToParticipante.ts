import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona coluna username (nullable) na tabela participante.
 * Permite vincular um participante a um usuário do site pelo username.
 */
export class AddUsernameToParticipante1739950000000 implements MigrationInterface {
  name = 'AddUsernameToParticipante1739950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "participante" ADD COLUMN IF NOT EXISTS "username" VARCHAR(30) NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participante" DROP COLUMN IF EXISTS "username"`);
  }
}
