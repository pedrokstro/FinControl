# Migrations do Banco de Dados

Este diretório contém as migrations do banco de dados do FinControl.

## 📋 Convenções

### Nomenclatura de Arquivos
```
YYYYMMDDHHMMSS_nome_descritivo.sql
```

Exemplo: `20250113120000_add_user_avatar.sql`

### Estrutura do Arquivo SQL
```sql
-- Migration: Nome descritivo
-- Created at: ISO timestamp

-- UP Migration (aplicar alterações)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- DOWN Migration (reverter alterações - comentado)
-- DROP TABLE IF EXISTS users;
```

## 🚀 Como Usar

### Criar Nova Migration
```bash
npm run migration:create
```

### Executar Migrations Pendentes
```bash
npm run migrate
```

### Listar Migrations Executadas
```bash
npm run migration:status
```

### Criar Backup Antes de Migrar
```bash
npm run db:backup
npm run migrate
```

## 📝 Exemplos de Migrations

### 1. Criar Tabela
```sql
-- Migration: create_transactions_table
-- Created at: 2025-01-13T12:00:00.000Z

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  category_id INTEGER REFERENCES categories(id),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
```

### 2. Adicionar Coluna
```sql
-- Migration: add_avatar_to_users

ALTER TABLE users
  ADD COLUMN avatar_url VARCHAR(500);

CREATE INDEX idx_users_avatar ON users(avatar_url);
```

### 3. Modificar Coluna
```sql
-- Migration: change_amount_precision

ALTER TABLE transactions
  ALTER COLUMN amount TYPE DECIMAL(12, 2);
```

### 4. Criar Índice
```sql
-- Migration: add_email_index

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

### 5. Inserir Dados Iniciais
```sql
-- Migration: seed_default_categories

INSERT INTO categories (name, type, emoji, user_id) VALUES
  ('Salário', 'income', '💰', NULL),
  ('Freelance', 'income', '💼', NULL),
  ('Alimentação', 'expense', '🍔', NULL),
  ('Transporte', 'expense', '🚗', NULL),
  ('Moradia', 'expense', '🏠', NULL);
```

### 6. Adicionar Constraint
```sql
-- Migration: add_email_unique_constraint

ALTER TABLE users
  ADD CONSTRAINT unique_email UNIQUE (email);
```

### 7. Criar Trigger
```sql
-- Migration: add_updated_at_trigger

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## ⚠️ Boas Práticas

### ✅ Fazer
- Sempre criar backup antes de migrations em produção
- Testar migrations em ambiente de desenvolvimento primeiro
- Incluir comentários explicativos
- Manter migrations pequenas e focadas
- Versionar migrations no Git
- Incluir DOWN migration comentada para referência

### ❌ Não Fazer
- Modificar migrations já executadas em produção
- Criar migrations que dependem de dados específicos
- Fazer DROP de tabelas sem backup
- Executar migrations diretamente em produção sem teste

## 🔄 Processo de Deploy

1. **Desenvolvimento**
   ```bash
   npm run migration:create
   # Editar arquivo SQL
   npm run migrate
   # Testar aplicação
   ```

2. **Commit**
   ```bash
   git add migrations/
   git commit -m "feat: add user avatar migration"
   git push
   ```

3. **CI/CD (Automático)**
   - GitHub Actions detecta nova migration
   - Cria backup automático
   - Executa migration
   - Notifica resultado

## 📊 Controle de Versão

As migrations executadas são registradas na tabela `schema_migrations`:

```sql
SELECT * FROM schema_migrations ORDER BY executed_at DESC;
```

| id | version | name | executed_at |
|----|---------|------|-------------|
| 1 | 20250113120000 | create_users_table | 2025-01-13 12:00:00 |
| 2 | 20250113130000 | add_user_avatar | 2025-01-13 13:00:00 |

## 🛠️ Troubleshooting

### Migration Falhou
```bash
# 1. Verificar erro no log
# 2. Corrigir SQL
# 3. Restaurar backup se necessário
npm run db:restore <backup-file>
# 4. Executar migration corrigida
npm run migrate
```

### Rollback Manual
```sql
-- Copiar SQL da seção DOWN da migration
-- Executar manualmente no banco
-- Remover registro da tabela schema_migrations
DELETE FROM schema_migrations WHERE version = '20250113120000';
```

## 📚 Recursos

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Best Practices](https://www.sqlstyle.guide/)
- [Database Migration Patterns](https://martinfowler.com/articles/evodb.html)
