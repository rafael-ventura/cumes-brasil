-- Script SQL para dropar todas as tabelas do banco de dados
-- ATENÇÃO: Isso vai apagar TODOS os dados!

-- Desabilitar temporariamente as foreign keys
SET session_replication_role = 'replica';

-- Dropar todas as tabelas (em ordem para evitar problemas de foreign key)
DROP TABLE IF EXISTS "via_croqui" CASCADE;
DROP TABLE IF EXISTS "via_colecao" CASCADE;
DROP TABLE IF EXISTS "escalada" CASCADE;
DROP TABLE IF EXISTS "via" CASCADE;
DROP TABLE IF EXISTS "localizacao" CASCADE;
DROP TABLE IF EXISTS "setor" CASCADE;
DROP TABLE IF EXISTS "face" CASCADE;
DROP TABLE IF EXISTS "montanha" CASCADE;
DROP TABLE IF EXISTS "croqui" CASCADE;
DROP TABLE IF EXISTS "imagem" CASCADE;
DROP TABLE IF EXISTS "fonte" CASCADE;
DROP TABLE IF EXISTS "colecao" CASCADE;
DROP TABLE IF EXISTS "participante" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;
DROP TABLE IF EXISTS "bairro" CASCADE;
DROP TABLE IF EXISTS "cidade" CASCADE;
DROP TABLE IF EXISTS "estado" CASCADE;
DROP TABLE IF EXISTS "regiao" CASCADE;
DROP TABLE IF EXISTS "pais" CASCADE;
DROP TABLE IF EXISTS "continente" CASCADE;

-- Reabilitar foreign keys
SET session_replication_role = 'origin';

-- Verificar se todas as tabelas foram removidas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

