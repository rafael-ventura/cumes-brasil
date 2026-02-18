import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddViaCerjAndHistoriaResumo1739900000000 implements MigrationInterface {
  name = 'AddViaCerjAndHistoriaResumo1739900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "via" ADD COLUMN IF NOT EXISTS "historia_resumo" character varying`);
    await queryRunner.query(`ALTER TABLE "via" ADD COLUMN IF NOT EXISTS "via_cerj" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "via" DROP COLUMN IF EXISTS "historia_resumo"`);
    await queryRunner.query(`ALTER TABLE "via" DROP COLUMN IF EXISTS "via_cerj"`);
  }
}
