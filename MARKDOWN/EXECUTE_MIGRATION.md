# 🚀 Executar Migration no Supabase

## 📋 Passo a Passo

### **1. Acessar Supabase Dashboard**

1. Acesse: https://app.supabase.com
2. Faça login
3. Selecione seu projeto **FinControl**

### **2. Abrir SQL Editor**

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**

### **3. Copiar e Colar o SQL**

Copie TODO o conteúdo abaixo e cole no SQL Editor:

```sql
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
```

### **4. Executar**

1. Clique no botão **Run** (ou pressione `Ctrl + Enter`)
2. Aguarde a execução
3. Verifique se apareceu "Migration executada com sucesso! ✅"

### **5. Verificar Resultados**

Você deve ver duas tabelas com as colunas criadas:

#### **Tabela `users`:**
- `isTrial` (boolean)
- `googlePayTransactionId` (varchar)
- `subscriptionStatus` (varchar)

#### **Tabela `notifications`:**
- `updatedAt` (timestamp)
- `category` (varchar)
- `relatedId` (varchar)
- `relatedType` (varchar)

## ✅ Pronto!

Agora você pode:

1. **Fazer commit e push** das alterações
2. **Deploy automático** via GitHub Actions
3. **Testar** o botão "Iniciar Teste Grátis de 7 Dias"

## 🔧 Se der erro

### **Erro: relation "users" does not exist**
Significa que a tabela `users` ainda não existe. Você precisa executar o schema completo primeiro.

### **Erro: column already exists**
Normal! A migration usa `IF NOT EXISTS`, então é seguro executar múltiplas vezes.

### **Erro: permission denied**
Verifique se você está usando o usuário `postgres` correto do Supabase.

## 📞 Suporte

Se tiver problemas, me avise qual erro apareceu!
