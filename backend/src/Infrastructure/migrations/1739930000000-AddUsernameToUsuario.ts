import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona coluna username na tabela usuario.
 * Gera username para usuários existentes a partir do nome.
 */
export class AddUsernameToUsuario1739930000000 implements MigrationInterface {
  name = 'AddUsernameToUsuario1739930000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuario" ADD COLUMN IF NOT EXISTS "username" character varying`);

    // Popular username para usuários existentes
    const usuarios = await queryRunner.query(
      `SELECT id, nome FROM "usuario" WHERE "username" IS NULL`
    );

    for (const usuario of usuarios) {
      const baseUsername = usuario.nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 30) || 'usuario';

      let username = baseUsername;
      let sufixo = 1;
      let existe = true;

      while (existe) {
        const conflito = await queryRunner.query(
          `SELECT id FROM "usuario" WHERE "username" = $1 AND id != $2`,
          [username, usuario.id]
        );
        if (conflito.length === 0) {
          existe = false;
        } else {
          username = `${baseUsername}_${sufixo}`;
          sufixo++;
        }
      }

      await queryRunner.query(
        `UPDATE "usuario" SET "username" = $1 WHERE id = $2`,
        [username, usuario.id]
      );
    }

    await queryRunner.query(
      `ALTER TABLE "usuario" ALTER COLUMN "username" SET NOT NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_usuario_username" ON "usuario" ("username")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_usuario_username"`);
    await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN IF EXISTS "username"`);
  }
}
