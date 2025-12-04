-- ================================================
-- ADICIONAR COLUNA isTrial
-- ================================================

USE fincontrol_db;

-- Adicionar coluna isTrial
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS isTrial BOOLEAN DEFAULT FALSE AFTER isPremium;

-- Verificar estrutura
DESCRIBE users;

SELECT 'Coluna isTrial adicionada com sucesso!' AS status;
