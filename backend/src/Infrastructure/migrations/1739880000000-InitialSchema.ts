import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration inicial do schema.
 * Se o banco já foi criado com synchronize:true, rode:
 *   npm run migration:generate
 * para gerar a migration correta a partir do estado atual.
 */
export class InitialSchema1739880000000 implements MigrationInterface {
  name = 'InitialSchema1739880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Continente
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "continente" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        CONSTRAINT "PK_continente" PRIMARY KEY ("id")
      )
    `);

    // Pais
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pais" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "continenteId" integer NOT NULL,
        CONSTRAINT "PK_pais" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pais_continente" FOREIGN KEY ("continenteId") REFERENCES "continente"("id")
      )
    `);

    // Regiao
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "regiao" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "paisId" integer NOT NULL,
        CONSTRAINT "PK_regiao" PRIMARY KEY ("id"),
        CONSTRAINT "FK_regiao_pais" FOREIGN KEY ("paisId") REFERENCES "pais"("id")
      )
    `);

    // Estado
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "estado" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "sigla" character varying NOT NULL,
        "regiaoId" integer,
        "paisId" integer NOT NULL,
        CONSTRAINT "PK_estado" PRIMARY KEY ("id"),
        CONSTRAINT "FK_estado_regiao" FOREIGN KEY ("regiaoId") REFERENCES "regiao"("id"),
        CONSTRAINT "FK_estado_pais" FOREIGN KEY ("paisId") REFERENCES "pais"("id")
      )
    `);

    // Cidade
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cidade" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "estadoId" integer NOT NULL,
        CONSTRAINT "PK_cidade" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cidade_estado" FOREIGN KEY ("estadoId") REFERENCES "estado"("id")
      )
    `);

    // Bairro
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bairro" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "cidadeId" integer NOT NULL,
        CONSTRAINT "PK_bairro" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bairro_cidade" FOREIGN KEY ("cidadeId") REFERENCES "cidade"("id")
      )
    `);

    // Fonte
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "fonte" (
        "id" SERIAL NOT NULL,
        "autor" character varying NOT NULL,
        "referencia" character varying NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_fonte" PRIMARY KEY ("id")
      )
    `);

    // Imagem
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "imagem" (
        "id" SERIAL NOT NULL,
        "url" character varying NOT NULL,
        "descricao" character varying,
        "fonte_id" integer,
        "tipo_entidade" character varying NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_imagem" PRIMARY KEY ("id"),
        CONSTRAINT "FK_imagem_fonte" FOREIGN KEY ("fonte_id") REFERENCES "fonte"("id")
      )
    `);

    // Localizacao
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "localizacao" (
        "id" SERIAL NOT NULL,
        "continenteId" integer NOT NULL,
        "paisId" integer NOT NULL,
        "regiaoId" integer,
        "estadoId" integer NOT NULL,
        "cidadeId" integer NOT NULL,
        "bairroId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_localizacao" PRIMARY KEY ("id"),
        CONSTRAINT "FK_localizacao_continente" FOREIGN KEY ("continenteId") REFERENCES "continente"("id"),
        CONSTRAINT "FK_localizacao_pais" FOREIGN KEY ("paisId") REFERENCES "pais"("id"),
        CONSTRAINT "FK_localizacao_regiao" FOREIGN KEY ("regiaoId") REFERENCES "regiao"("id"),
        CONSTRAINT "FK_localizacao_estado" FOREIGN KEY ("estadoId") REFERENCES "estado"("id"),
        CONSTRAINT "FK_localizacao_cidade" FOREIGN KEY ("cidadeId") REFERENCES "cidade"("id"),
        CONSTRAINT "FK_localizacao_bairro" FOREIGN KEY ("bairroId") REFERENCES "bairro"("id")
      )
    `);

    // Montanha
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "montanha" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "altura" integer,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "imagemId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_montanha" PRIMARY KEY ("id"),
        CONSTRAINT "FK_montanha_imagem" FOREIGN KEY ("imagemId") REFERENCES "imagem"("id")
      )
    `);

    // Face
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "face" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "fantasia" character varying,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "montanhaId" integer NOT NULL,
        "fonteId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_face" PRIMARY KEY ("id"),
        CONSTRAINT "FK_face_montanha" FOREIGN KEY ("montanhaId") REFERENCES "montanha"("id"),
        CONSTRAINT "FK_face_fonte" FOREIGN KEY ("fonteId") REFERENCES "fonte"("id")
      )
    `);

    // Setor
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "setor" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "montanhaId" integer NOT NULL,
        "faceId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_setor" PRIMARY KEY ("id"),
        CONSTRAINT "FK_setor_montanha" FOREIGN KEY ("montanhaId") REFERENCES "montanha"("id"),
        CONSTRAINT "FK_setor_face" FOREIGN KEY ("faceId") REFERENCES "face"("id")
      )
    `);

    // Via
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "via" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "grau" character varying,
        "crux" character varying,
        "artificial" character varying,
        "duracao" character varying,
        "exposicao" character varying,
        "extensao" numeric(5,2),
        "conquistadores" character varying,
        "detalhes" character varying,
        "data" character varying,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "tipo_rocha" character varying,
        "tipo_escalada" character varying,
        "modalidade" character varying,
        "viaPrincipalId" integer,
        "fonteId" integer,
        "imagemId" integer,
        "montanhaId" integer,
        "faceId" integer,
        "setorId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_via" PRIMARY KEY ("id"),
        CONSTRAINT "FK_via_viaPrincipal" FOREIGN KEY ("viaPrincipalId") REFERENCES "via"("id"),
        CONSTRAINT "FK_via_fonte" FOREIGN KEY ("fonteId") REFERENCES "fonte"("id"),
        CONSTRAINT "FK_via_imagem" FOREIGN KEY ("imagemId") REFERENCES "imagem"("id"),
        CONSTRAINT "FK_via_montanha" FOREIGN KEY ("montanhaId") REFERENCES "montanha"("id"),
        CONSTRAINT "FK_via_face" FOREIGN KEY ("faceId") REFERENCES "face"("id"),
        CONSTRAINT "FK_via_setor" FOREIGN KEY ("setorId") REFERENCES "setor"("id")
      )
    `);

    // Tabelas de junção ManyToMany
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "montanha_localizacoes" (
        "montanhaId" integer NOT NULL,
        "localizacaoId" integer NOT NULL,
        CONSTRAINT "PK_montanha_localizacoes" PRIMARY KEY ("montanhaId", "localizacaoId"),
        CONSTRAINT "FK_montanha_localizacoes_montanha" FOREIGN KEY ("montanhaId") REFERENCES "montanha"("id"),
        CONSTRAINT "FK_montanha_localizacoes_localizacao" FOREIGN KEY ("localizacaoId") REFERENCES "localizacao"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "face_localizacoes" (
        "faceId" integer NOT NULL,
        "localizacaoId" integer NOT NULL,
        CONSTRAINT "PK_face_localizacoes" PRIMARY KEY ("faceId", "localizacaoId"),
        CONSTRAINT "FK_face_localizacoes_face" FOREIGN KEY ("faceId") REFERENCES "face"("id"),
        CONSTRAINT "FK_face_localizacoes_localizacao" FOREIGN KEY ("localizacaoId") REFERENCES "localizacao"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "setor_localizacoes" (
        "setorId" integer NOT NULL,
        "localizacaoId" integer NOT NULL,
        CONSTRAINT "PK_setor_localizacoes" PRIMARY KEY ("setorId", "localizacaoId"),
        CONSTRAINT "FK_setor_localizacoes_setor" FOREIGN KEY ("setorId") REFERENCES "setor"("id"),
        CONSTRAINT "FK_setor_localizacoes_localizacao" FOREIGN KEY ("localizacaoId") REFERENCES "localizacao"("id")
      )
    `);

    // Usuario, Colecao, Croqui, Escalada, Participante, ViaColecao, ViaCroqui
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuario" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "email" character varying NOT NULL,
        "idade" integer,
        "password_hash" character varying NOT NULL,
        "data_atividade" character varying,
        "clube_organizacao" character varying,
        "localizacao" character varying,
        "biografia" character varying,
        "via_preferida" integer,
        "foto_perfilId" integer,
        "resetPasswordToken" character varying,
        "resetPasswordUrl" character varying,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_usuario" PRIMARY KEY ("id"),
        CONSTRAINT "FK_usuario_via" FOREIGN KEY ("via_preferida") REFERENCES "via"("id"),
        CONSTRAINT "FK_usuario_imagem" FOREIGN KEY ("foto_perfilId") REFERENCES "imagem"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "colecao" (
        "id" SERIAL NOT NULL,
        "fantasia" character varying,
        "nome" character varying NOT NULL,
        "descricao" character varying,
        "usuarioId" integer,
        "imagemId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_colecao" PRIMARY KEY ("id"),
        CONSTRAINT "FK_colecao_usuario" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id"),
        CONSTRAINT "FK_colecao_imagem" FOREIGN KEY ("imagemId") REFERENCES "imagem"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "croqui" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "fonteId" integer,
        "imagemId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_croqui" PRIMARY KEY ("id"),
        CONSTRAINT "FK_croqui_fonte" FOREIGN KEY ("fonteId") REFERENCES "fonte"("id"),
        CONSTRAINT "FK_croqui_imagem" FOREIGN KEY ("imagemId") REFERENCES "imagem"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "escalada" (
        "id" SERIAL NOT NULL,
        "data" date NOT NULL,
        "observacao" character varying,
        "usuarioId" integer,
        "viaId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_escalada" PRIMARY KEY ("id"),
        CONSTRAINT "FK_escalada_usuario" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id"),
        CONSTRAINT "FK_escalada_via" FOREIGN KEY ("viaId") REFERENCES "via"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "participante" (
        "id" SERIAL NOT NULL,
        "tipo" character varying NOT NULL,
        "nome" character varying NOT NULL,
        "email" character varying,
        "escaladaId" integer,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_participante" PRIMARY KEY ("id"),
        CONSTRAINT "FK_participante_escalada" FOREIGN KEY ("escaladaId") REFERENCES "escalada"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "via_colecao" (
        "id" SERIAL NOT NULL,
        "viaId" integer,
        "colecaoId" integer,
        "data_adicao" TIMESTAMP DEFAULT now() NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_via_colecao" PRIMARY KEY ("id"),
        CONSTRAINT "FK_via_colecao_via" FOREIGN KEY ("viaId") REFERENCES "via"("id"),
        CONSTRAINT "FK_via_colecao_colecao" FOREIGN KEY ("colecaoId") REFERENCES "colecao"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "via_croqui" (
        "id" SERIAL NOT NULL,
        "via_id" integer,
        "croqui_id" integer,
        "data_adicao" TIMESTAMP DEFAULT now() NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_via_croqui" PRIMARY KEY ("id"),
        CONSTRAINT "FK_via_croqui_via" FOREIGN KEY ("via_id") REFERENCES "via"("id"),
        CONSTRAINT "FK_via_croqui_croqui" FOREIGN KEY ("croqui_id") REFERENCES "croqui"("id")
      )
    `);

    // Índices
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_montanha_nome" ON "montanha" ("nome")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_via_nome" ON "via" ("nome")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_via_grau" ON "via" ("grau")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "via_croqui"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "via_colecao"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "participante"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "escalada"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "croqui"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "colecao"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuario"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "setor_localizacoes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "face_localizacoes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "montanha_localizacoes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "via"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "setor"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "face"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "montanha"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "localizacao"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "imagem"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "fonte"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bairro"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cidade"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "estado"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "regiao"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pais"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "continente"`);
  }
}
