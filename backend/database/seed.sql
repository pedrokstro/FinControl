-- ================================================
-- FINCONTROL - DADOS INICIAIS (SEED)
-- ================================================

USE fincontrol_db;

-- ================================================
-- LIMPAR DADOS EXISTENTES (CUIDADO!)
-- ================================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE notifications;
-- TRUNCATE TABLE verification_codes;
-- TRUNCATE TABLE refresh_tokens;
-- TRUNCATE TABLE transactions;
-- TRUNCATE TABLE savings_goals;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ================================================
-- USUÁRIO ADMIN DE TESTE
-- ================================================
-- Senha: admin123
INSERT INTO users (id, name, email, password, isActive, role, isAdmin, emailVerified, createdAt) VALUES
('admin-uuid-123', 'Administrador', 'admin@fincontrol.com', '$2a$10$YourHashedPasswordHere', TRUE, 'admin', TRUE, TRUE, NOW())
ON DUPLICATE KEY UPDATE name = name;

-- ================================================
-- CATEGORIAS PADRÃO DE RECEITAS
-- ================================================
INSERT INTO categories (id, name, type, color, icon, userId, isDefault, createdAt) VALUES
(UUID(), 'Salário', 'income', '#10b981', '💼', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Freelance', 'income', '#3b82f6', '💻', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Investimentos', 'income', '#8b5cf6', '📈', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Vendas', 'income', '#f59e0b', '💰', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Prêmios', 'income', '#ec4899', '🎁', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Outros', 'income', '#6b7280', '💵', 'admin-uuid-123', TRUE, NOW());

-- ================================================
-- CATEGORIAS PADRÃO DE DESPESAS
-- ================================================
INSERT INTO categories (id, name, type, color, icon, userId, isDefault, createdAt) VALUES
(UUID(), 'Alimentação', 'expense', '#ef4444', '🍔', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Transporte', 'expense', '#f59e0b', '🚗', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Moradia', 'expense', '#06b6d4', '🏠', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Saúde', 'expense', '#ec4899', '🏥', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Educação', 'expense', '#6366f1', '📚', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Lazer', 'expense', '#14b8a6', '🎮', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Vestuário', 'expense', '#8b5cf6', '👕', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Beleza', 'expense', '#f472b6', '💄', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Pets', 'expense', '#fbbf24', '🐶', 'admin-uuid-123', TRUE, NOW()),
(UUID(), 'Outros', 'expense', '#6b7280', '💸', 'admin-uuid-123', TRUE, NOW());

-- ================================================
-- TRANSAÇÕES DE EXEMPLO (OPCIONAL)
-- ================================================
-- Descomentar para adicionar transações de exemplo

-- SET @user_id = 'admin-uuid-123';
-- SET @salary_cat = (SELECT id FROM categories WHERE name = 'Salário' AND userId = @user_id LIMIT 1);
-- SET @food_cat = (SELECT id FROM categories WHERE name = 'Alimentação' AND userId = @user_id LIMIT 1);

-- INSERT INTO transactions (id, type, amount, description, date, categoryId, userId, createdAt) VALUES
-- (UUID(), 'income', 5000.00, 'Salário Mensal', CURDATE(), @salary_cat, @user_id, NOW()),
-- (UUID(), 'expense', 150.00, 'Supermercado', CURDATE(), @food_cat, @user_id, NOW());

-- ================================================
-- META DE ECONOMIA DE EXEMPLO
-- ================================================
-- INSERT INTO savings_goals (id, userId, targetAmount, currentAmount, month, year, description, createdAt) VALUES
-- (UUID(), 'admin-uuid-123', 1000.00, 250.00, MONTH(CURDATE()), YEAR(CURDATE()), 'Meta de economia mensal', NOW());

-- ================================================
-- FIM DO SEED
-- ================================================

SELECT 'Dados iniciais inseridos com sucesso!' AS status;
