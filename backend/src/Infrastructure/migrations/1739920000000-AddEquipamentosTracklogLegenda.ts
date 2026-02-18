import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona equipamentos e tracklog_aproximacao na Via;
 * legenda no Croqui.
 */
export class AddEquipamentosTracklogLegenda1739920000000 implements MigrationInterface {
  name = 'AddEquipamentosTracklogLegenda1739920000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "via" ADD COLUMN IF NOT EXISTS "equipamentos" text`);
    await queryRunner.query(`ALTER TABLE "via" ADD COLUMN IF NOT EXISTS "tracklog_aproximacao" character varying`);
    await queryRunner.query(`ALTER TABLE "croqui" ADD COLUMN IF NOT EXISTS "legenda" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "via" DROP COLUMN IF EXISTS "equipamentos"`);
    await queryRunner.query(`ALTER TABLE "via" DROP COLUMN IF EXISTS "tracklog_aproximacao"`);
    await queryRunner.query(`ALTER TABLE "croqui" DROP COLUMN IF EXISTS "legenda"`);
  }
}
