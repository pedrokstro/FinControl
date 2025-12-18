-- Script para registrar a migration na tabela migrations do Supabase
-- Execute este script no SQL Editor para registrar que a migration foi executada

-- Verificar se já existe
SELECT * FROM migrations WHERE timestamp = 1734372000000;

-- Se não existir, inserir (execute apenas se a query acima retornar 0 linhas)
INSERT INTO migrations (timestamp, name)
SELECT 1734372000000, 'AddInstallmentsToTransactions1734372000000'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE timestamp = 1734372000000
);

-- Verificar se foi registrado
SELECT * FROM migrations ORDER BY timestamp DESC LIMIT 5;
