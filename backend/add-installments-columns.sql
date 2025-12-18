-- Script SQL para adicionar colunas de parcelas manualmente no Supabase
-- Execute este script no SQL Editor do Supabase se a migration não rodar automaticamente

-- Adicionar coluna totalInstallments
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS "totalInstallments" INTEGER NULL;

COMMENT ON COLUMN transactions."totalInstallments" IS 'Número total de parcelas (null = recorrência infinita ou usa recurrenceEndDate)';

-- Adicionar coluna currentInstallment
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS "currentInstallment" INTEGER NULL DEFAULT 1;

COMMENT ON COLUMN transactions."currentInstallment" IS 'Parcela atual (para controle de progresso)';

-- Adicionar coluna isCancelled
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS "isCancelled" BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN transactions."isCancelled" IS 'Indica se a recorrência foi cancelada pelo usuário';

-- Adicionar coluna cancelledAt
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP NULL;

COMMENT ON COLUMN transactions."cancelledAt" IS 'Data em que a recorrência foi cancelada';

-- Verificar se as colunas foram criadas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'transactions'
AND column_name IN ('totalInstallments', 'currentInstallment', 'isCancelled', 'cancelledAt')
ORDER BY column_name;
