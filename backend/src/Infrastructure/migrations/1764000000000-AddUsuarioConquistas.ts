import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsuarioConquistas1764000000000 implements MigrationInterface {
  name = 'AddUsuarioConquistas1764000000000';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuario_conquistas" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        "usuarioId" integer NOT NULL,
        "tipo" varchar NOT NULL,
        "valorAtual" integer NOT NULL DEFAULT 0,
        "tier" varchar NOT NULL,
        CONSTRAINT "PK_usuario_conquistas" PRIMARY KEY ("id"),
        CONSTRAINT "FK_usuario_conquistas_usuario" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_usuario_conquistas" UNIQUE ("usuarioId", "tipo")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_usuario_conquistas_usuarioId" ON "usuario_conquistas" ("usuarioId");
    `);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "usuario_conquistas"`);
  }
}

