import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migra Via de 1 imagem (imagemId) para múltiplas imagens (via_imagem).
 * Cria tabela via_imagem, migra dados existentes e remove coluna imagemId.
 */
export class ViaMultiplasImagens1739910000000 implements MigrationInterface {
  name = 'ViaMultiplasImagens1739910000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criar tabela via_imagem
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "via_imagem" (
        "id" SERIAL NOT NULL,
        "viaId" integer NOT NULL,
        "imagemId" integer NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_via_imagem" PRIMARY KEY ("id"),
        CONSTRAINT "FK_via_imagem_via" FOREIGN KEY ("viaId") REFERENCES "via"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_via_imagem_imagem" FOREIGN KEY ("imagemId") REFERENCES "imagem"("id") ON DELETE CASCADE
      )
    `);

    // 2. Migrar dados: vias que tinham imagemId -> via_imagem
    await queryRunner.query(`
      INSERT INTO "via_imagem" ("viaId", "imagemId", "created_at", "updated_at")
      SELECT "id", "imagemId", "created_at", "updated_at"
      FROM "via"
      WHERE "imagemId" IS NOT NULL
    `);

    // 3. Remover FK e coluna imagemId da via
    await queryRunner.query(`ALTER TABLE "via" DROP CONSTRAINT IF EXISTS "FK_via_imagem"`);
    await queryRunner.query(`ALTER TABLE "via" DROP COLUMN IF EXISTS "imagemId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar coluna imagemId de volta na via
    await queryRunner.query(`ALTER TABLE "via" ADD COLUMN IF NOT EXISTS "imagemId" integer`);
    await queryRunner.query(`
      ALTER TABLE "via" ADD CONSTRAINT "FK_via_imagem" 
      FOREIGN KEY ("imagemId") REFERENCES "imagem"("id")
    `);

    // 2. Migrar primeira imagem de cada via de volta
    await queryRunner.query(`
      UPDATE "via" v
      SET "imagemId" = (
        SELECT vi."imagemId"
        FROM "via_imagem" vi
        WHERE vi."viaId" = v."id"
        ORDER BY vi."id" ASC
        LIMIT 1
      )
    `);

    // 3. Dropar tabela via_imagem
    await queryRunner.query(`DROP TABLE IF EXISTS "via_imagem"`);
  }
}
