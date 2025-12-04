-- ================================================
-- MIGRATION: Adicionar Trial e Google Pay
-- Database: PostgreSQL (Supabase)
-- ================================================

-- Adicionar coluna isTrial para teste grátis de 7 dias
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isTrial" boolean DEFAULT false;

-- Adicionar colunas do Google Pay
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "googlePayTransactionId" varchar(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "subscriptionStatus" varchar(50);

-- Adicionar colunas faltantes na tabela notifications
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS "category" varchar(50);

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS "relatedId" varchar(36);

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS "relatedType" varchar(50);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_trial ON users("isTrial");
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users("subscriptionStatus");
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications("category");

-- Verificar estrutura
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('isTrial', 'googlePayTransactionId', 'subscriptionStatus')
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'notifications'
AND column_name IN ('updatedAt', 'category', 'relatedId', 'relatedType')
ORDER BY ordinal_position;

-- Mensagem de sucesso
SELECT 'Migration executada com sucesso! ✅' AS status;
