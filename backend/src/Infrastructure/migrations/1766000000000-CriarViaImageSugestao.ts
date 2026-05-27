import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriarViaImageSugestao1766000000000 implements MigrationInterface {
  name = 'CriarViaImageSugestao1766000000000';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "via_image_sugestao" (
        "id"               SERIAL NOT NULL,
        "created_at"       TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at"       TIMESTAMP DEFAULT now() NOT NULL,
        "viaId"            integer NOT NULL,
        "imagemId"         integer NOT NULL,
        "usuarioId"        integer,
        "status"           varchar NOT NULL DEFAULT 'pendente',
        "creditos"         varchar(255),
        "motivo_rejeicao"  varchar(500),
        "admin_revisorId"  integer,
        "reviewed_at"      TIMESTAMP,
        CONSTRAINT "PK_via_image_sugestao" PRIMARY KEY ("id"),
        CONSTRAINT "FK_via_image_sugestao_via"    FOREIGN KEY ("viaId")           REFERENCES "via"("id")     ON DELETE CASCADE,
        CONSTRAINT "FK_via_image_sugestao_imagem" FOREIGN KEY ("imagemId")        REFERENCES "imagem"("id")  ON DELETE CASCADE,
        CONSTRAINT "FK_via_image_sugestao_user"   FOREIGN KEY ("usuarioId")       REFERENCES "usuario"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_via_image_sugestao_admin"  FOREIGN KEY ("admin_revisorId") REFERENCES "usuario"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_via_image_sugestao_via"    ON "via_image_sugestao" ("viaId");
      CREATE INDEX IF NOT EXISTS "IDX_via_image_sugestao_status" ON "via_image_sugestao" ("status");
    `);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "via_image_sugestao"`);
  }
}
