-- Verificar o problema
SELECT MAX(id) as max_id FROM imagem;
SELECT last_value FROM imagem_id_seq;

-- Corrigir a sequência para o próximo valor após o MAX
SELECT setval('imagem_id_seq', (SELECT MAX(id) FROM imagem));
