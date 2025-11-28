-- Script SQL dinâmico para dropar TODAS as tabelas do schema public
-- ATENÇÃO: Isso vai apagar TODOS os dados!

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Desabilitar temporariamente as foreign keys
    SET session_replication_role = 'replica';
    
    -- Dropar todas as tabelas do schema public
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Reabilitar foreign keys
    SET session_replication_role = 'origin';
END $$;

-- Verificar se todas as tabelas foram removidas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

