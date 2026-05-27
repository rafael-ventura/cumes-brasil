import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAdminToUsuario1765000000000 implements MigrationInterface {
  name = 'AddIsAdminToUsuario1765000000000';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario" ADD COLUMN IF NOT EXISTS "is_admin" boolean NOT NULL DEFAULT false
    `);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN IF EXISTS "is_admin"`);
  }
}
