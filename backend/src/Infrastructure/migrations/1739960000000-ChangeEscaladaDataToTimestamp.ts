import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Muda a coluna data da tabela escalada de DATE para TIMESTAMP.
 * Permite registrar o horário exato da escalada.
 * Dados existentes (só data) são mantidos com hora 00:00:00.
 */
export class ChangeEscaladaDataToTimestamp1739960000000 implements MigrationInterface {
  name = 'ChangeEscaladaDataToTimestamp1739960000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "escalada" ALTER COLUMN "data" TYPE TIMESTAMP WITHOUT TIME ZONE USING "data"::timestamp`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "escalada" ALTER COLUMN "data" TYPE DATE USING "data"::date`
    );
  }
}
