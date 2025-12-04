-- ================================================
-- CORRIGIR TABELA DE NOTIFICAÇÕES
-- ================================================

USE fincontrol_db;

-- Verificar estrutura atual
DESCRIBE notifications;

-- Adicionar colunas que estão faltando
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) NULL AFTER type;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS relatedId VARCHAR(36) NULL AFTER isRead;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS relatedType VARCHAR(50) NULL AFTER relatedId;

-- Adicionar coluna updatedAt (IMPORTANTE!)
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER createdAt;

-- Verificar estrutura atualizada
DESCRIBE notifications;

SELECT 'Tabela de notificações corrigida!' AS status;
