# 🗄️ Migrations PostgreSQL - FinControl

Scripts SQL para executar diretamente no Supabase ou outro banco PostgreSQL.

## 📋 Ordem de Execução

### 1️⃣ **Primeira vez (banco novo)**

Execute no SQL Editor do Supabase:

```sql
-- 1. Schema completo (se ainda não existir)
-- Copie e cole o conteúdo do schema.sql

-- 2. Adicionar Trial e Google Pay
\i add-trial-and-googlepay.sql
```

### 2️⃣ **Atualização (banco existente)**

Se você já tem o banco rodando e quer adicionar as novas funcionalidades:

```sql
-- Executar apenas a migration de Trial e Google Pay
\i add-trial-and-googlepay.sql
```

## 🔧 Como Executar no Supabase

### **Opção 1: SQL Editor (Recomendado)**

1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo do arquivo SQL
5. Clique em **Run**

### **Opção 2: Via psql (Terminal)**

```bash
# Conectar ao Supabase
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Executar migration
\i backend/database/postgresql/add-trial-and-googlepay.sql
```

### **Opção 3: Via DATABASE_URL**

```bash
# Usando a URL completa
psql $DATABASE_URL -f backend/database/postgresql/add-trial-and-googlepay.sql
```

## 📁 Arquivos Disponíveis

- **`add-trial-and-googlepay.sql`** - Adiciona:
  - Campo `isTrial` (teste grátis de 7 dias)
  - Campo `googlePayTransactionId`
  - Campo `subscriptionStatus`
  - Campos extras em `notifications`
  - Índices para performance

## ✅ Verificar Execução

Após executar, verifique se as colunas foram criadas:

```sql
-- Verificar colunas da tabela users
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('isTrial', 'googlePayTransactionId', 'subscriptionStatus')
ORDER BY ordinal_position;

-- Verificar colunas da tabela notifications
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'notifications'
AND column_name IN ('updatedAt', 'category', 'relatedId', 'relatedType')
ORDER BY ordinal_position;
```

## 🔄 Rollback

Se precisar reverter as mudanças:

```sql
-- Remover colunas adicionadas
ALTER TABLE users DROP COLUMN IF EXISTS "isTrial";
ALTER TABLE users DROP COLUMN IF EXISTS "googlePayTransactionId";
ALTER TABLE users DROP COLUMN IF EXISTS "subscriptionStatus";

ALTER TABLE notifications DROP COLUMN IF EXISTS "updatedAt";
ALTER TABLE notifications DROP COLUMN IF EXISTS "category";
ALTER TABLE notifications DROP COLUMN IF EXISTS "relatedId";
ALTER TABLE notifications DROP COLUMN IF EXISTS "relatedType";

-- Remover índices
DROP INDEX IF EXISTS idx_users_trial;
DROP INDEX IF EXISTS idx_users_subscription_status;
DROP INDEX IF EXISTS idx_notifications_category;
```

## 🚀 Próximos Passos

Após executar as migrations:

1. ✅ Atualizar `DATABASE_URL` no GitHub Secrets
2. ✅ Fazer deploy do backend (Render)
3. ✅ Testar funcionalidade de trial
4. ✅ Testar integração Google Pay

## 📞 Suporte

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
