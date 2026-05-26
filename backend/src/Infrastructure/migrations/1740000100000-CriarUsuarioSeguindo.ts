import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cria tabela de relacionamento "seguir": seguidor → seguido.
 */
export class CriarUsuarioSeguindo1740000100000 implements MigrationInterface {
  name = 'CriarUsuarioSeguindo1740000100000';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuario_seguindo" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        "seguidorId" integer NOT NULL,
        "seguidoId" integer NOT NULL,
        CONSTRAINT "PK_usuario_seguindo" PRIMARY KEY ("id"),
        CONSTRAINT "FK_usuario_seguindo_seguidor" FOREIGN KEY ("seguidorId") REFERENCES "usuario"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_usuario_seguindo_seguido" FOREIGN KEY ("seguidoId") REFERENCES "usuario"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_usuario_seguindo" UNIQUE ("seguidorId", "seguidoId")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_usuario_seguindo_seguidorId" ON "usuario_seguindo" ("seguidorId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_usuario_seguindo_seguidoId" ON "usuario_seguindo" ("seguidoId")
    `);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "usuario_seguindo"`);
  }
}

