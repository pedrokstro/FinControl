-- ================================================
-- ADICIONAR PERMISSÃO DE ADMIN
-- ================================================

USE fincontrol_db;

-- Atualizar usuário demo@financeiro.com para admin
UPDATE users 
SET 
  isAdmin = TRUE,
  role = 'admin'
WHERE email = 'demo@financeiro.com';

-- Verificar se foi atualizado
SELECT 
  id,
  name,
  email,
  role,
  isAdmin,
  isPremium
FROM users 
WHERE email = 'demo@financeiro.com';
