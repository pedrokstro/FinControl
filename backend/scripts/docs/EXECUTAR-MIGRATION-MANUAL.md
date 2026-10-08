# 📋 Guia: Executar Migration Manualmente

## Passo 1: Abrir DBeaver

1. Abra o **DBeaver**
2. Conecte ao banco de dados **fincontrol_db**

## Passo 2: Copiar SQL

Copie TODO o SQL abaixo:

```sql
-- Migration: Criar tabela verification_codes para códigos de email

-- 1. Criar tabela verification_codes
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
  "expiresAt" TIMESTAMP NOT NULL,
  "isUsed" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criar índices
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_type ON verification_codes(type);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes("expiresAt");

-- 3. Criar trigger para atualizar updatedAt
CREATE OR REPLACE FUNCTION update_verification_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_verification_codes_updated_at ON verification_codes;
CREATE TRIGGER trigger_update_verification_codes_updated_at
BEFORE UPDATE ON verification_codes
FOR EACH ROW
EXECUTE FUNCTION update_verification_codes_updated_at();

-- 4. Adicionar campo emailVerified na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT FALSE;

-- 5. Criar índice
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users("emailVerified");

-- 6. Verificar resultado
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'verification_codes'
ORDER BY ordinal_position;
```

## Passo 3: Executar no DBeaver

1. Abra um **SQL Editor** (Ctrl+])
2. Cole o SQL copiado
3. Clique em **Execute SQL Statement** (Ctrl+Enter)
4. Verifique se apareceu a mensagem de sucesso

## Passo 4: Verificar

Você deve ver uma tabela com as colunas:
- id
- email
- code
- type
- expiresAt
- isUsed
- createdAt
- updatedAt

## ✅ Pronto!

Após executar a migration, você pode:

1. Reiniciar o backend: `npm run dev`
2. Testar os endpoints com o arquivo `test-verification.http`
3. Ou executar o script: `powershell -ExecutionPolicy Bypass -File .\testar-verificacao-completa.ps1`
