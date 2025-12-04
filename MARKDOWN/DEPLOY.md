# 🚀 Guia de Deploy Automático - FinControl

Sistema completo de CI/CD com deploy automático e migrations de banco de dados.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Como Usar](#como-usar)
4. [Migrations](#migrations)
5. [Backup e Restore](#backup-e-restore)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### O que foi implementado?

✅ **GitHub Actions CI/CD**
- Deploy automático ao fazer push
- Build e testes automatizados
- Deploy de frontend (Vercel/Netlify)
- Deploy de backend (SSH)
- Notificações de sucesso/falha

✅ **Sistema de Migrations**
- Controle de versão do banco de dados
- Execução automática no deploy
- Rollback manual disponível
- Backup automático antes de migrations

✅ **Scripts de Backup**
- Backup automático do MySQL
- Restore de backups
- Limpeza de backups antigos
- Listagem de backups disponíveis

---

## ⚙️ Configuração Inicial

### 1. Instalar Dependências

```bash
# Instalar mysql2 (MySQL client)
npm install mysql2 --save

# Ou se preferir globalmente
npm install -g mysql2
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
DATABASE_URL=mysql://user:password@localhost:3306/fincontrol_db
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fincontrol_db
DB_USER=root
DB_PASSWORD=sua_senha_aqui
```

### 3. Configurar GitHub Secrets

Vá em: `GitHub Repository > Settings > Secrets and variables > Actions`

Adicione os seguintes secrets:

#### Database
```
DATABASE_URL=mysql://user:pass@host:3306/db
DB_HOST=seu_host
DB_PORT=3306
DB_NAME=fincontrol_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

#### Vercel (Frontend)
```
VERCEL_TOKEN=seu_token_vercel
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id
```

#### Servidor (Backend - opcional)
```
SERVER_HOST=seu_servidor.com
SERVER_USER=usuario_ssh
SSH_PRIVATE_KEY=sua_chave_privada_ssh
```

#### Notificações (opcional)
```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

---

## 🚀 Como Usar

### Deploy Automático

Simplesmente faça push para a branch `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

**O que acontece automaticamente:**

1. ✅ Build e testes
2. ✅ Verificação de TypeScript
3. ✅ Lint
4. ✅ Backup do banco de dados
5. ✅ Execução de migrations pendentes
6. ✅ Deploy do frontend
7. ✅ Deploy do backend (se configurado)
8. ✅ Notificação do resultado

### Monitorar Deploy

1. Vá para `Actions` no GitHub
2. Selecione o workflow em execução
3. Veja os logs em tempo real

---

## 🗄️ Migrations

### Criar Nova Migration

```bash
npm run migration:create
```

Você será perguntado:
- Nome da migration
- Tipo (tabela, coluna, índice, dados, custom)

Exemplo:
```
Nome: add_user_avatar
Tipo: 2 (coluna)
```

Isso cria: `migrations/20250113120000_add_user_avatar.sql`

### Editar Migration

Abra o arquivo criado e edite o SQL:

```sql
-- Migration: add_user_avatar
-- Created at: 2025-01-13T12:00:00.000Z

-- UP Migration
ALTER TABLE users
  ADD COLUMN avatar_url VARCHAR(500);

CREATE INDEX idx_users_avatar ON users(avatar_url);

-- DOWN Migration (para rollback)
-- ALTER TABLE users DROP COLUMN avatar_url;
```

### Executar Migrations

```bash
# Executar todas as migrations pendentes
npm run migrate

# Ver status das migrations
npm run migration:status
```

### Exemplos de Migrations

#### Criar Tabela
```sql
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### Adicionar Coluna
```sql
ALTER TABLE users
  ADD COLUMN phone VARCHAR(20);
```

#### Criar Índice
```sql
CREATE INDEX idx_transactions_user_id 
  ON transactions(user_id);
```

#### Inserir Dados
```sql
INSERT INTO categories (name, type, emoji) VALUES
  ('Salário', 'income', '💰'),
  ('Alimentação', 'expense', '🍔');
```

---

## 💾 Backup e Restore

### Criar Backup Manual

```bash
npm run db:backup
```

Isso cria: `backups/backup_YYYY-MM-DD-HH-MM-SS.sql`

### Listar Backups

```bash
npm run db:list
```

Saída:
```
📋 Backups disponíveis:
   1. backup_2025-01-13-12-00-00.sql - 2.5 MB - 13/01/2025 12:00:00
   2. backup_2025-01-12-10-30-00.sql - 2.3 MB - 12/01/2025 10:30:00
```

### Restaurar Backup

```bash
npm run db:restore backup_2025-01-13-12-00-00.sql
```

⚠️ **ATENÇÃO:** Isso sobrescreve o banco atual!

---

## 🔄 Fluxo Completo de Deploy

```mermaid
graph TD
    A[git push origin main] --> B[GitHub Actions Triggered]
    B --> C[Build & Test]
    C --> D{Sucesso?}
    D -->|Não| E[Notificar Falha]
    D -->|Sim| F[Backup Database]
    F --> G[Run Migrations]
    G --> H[Deploy Frontend]
    G --> I[Deploy Backend]
    H --> J[Notificar Sucesso]
    I --> J
```

---

## 📊 Estrutura de Arquivos

```
fincontrol/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Workflow principal
│       └── README.md           # Documentação do workflow
├── migrations/
│   ├── README.md               # Guia de migrations
│   └── YYYYMMDDHHMMSS_*.sql   # Arquivos de migration
├── backups/
│   └── backup_*.sql            # Backups automáticos
├── scripts/
│   ├── run-migrations.js       # Executar migrations
│   ├── create-migration.js     # Criar nova migration
│   ├── migration-status.js     # Ver status
│   └── backup-database.js      # Backup e restore
├── .env.example                # Exemplo de variáveis
├── DEPLOY.md                   # Este arquivo
└── package.json                # Scripts npm
```

---

## 🛠️ Comandos Disponíveis

### Desenvolvimento
```bash
npm run dev              # Iniciar dev server
npm run build            # Build para produção
npm run preview          # Preview do build
npm run lint             # Lint do código
npm run type-check       # Verificar TypeScript
```

### Migrations
```bash
npm run migrate          # Executar migrations
npm run migration:create # Criar nova migration
npm run migration:status # Ver status
```

### Backup
```bash
npm run db:backup        # Criar backup
npm run db:restore       # Restaurar backup
npm run db:list          # Listar backups
```

### Deploy
```bash
npm run deploy           # Build + Migrate
```

---

## 🐛 Troubleshooting

### Migration Falhou

**Problema:** Migration retornou erro

**Solução:**
```bash
# 1. Ver o erro no log
npm run migration:status

# 2. Restaurar backup
npm run db:restore backup_YYYY-MM-DD.sql

# 3. Corrigir SQL da migration
# Editar: migrations/YYYYMMDDHHMMSS_nome.sql

# 4. Tentar novamente
npm run migrate
```

### Deploy Falhou no GitHub Actions

**Problema:** Workflow falhou

**Solução:**
1. Ver logs no GitHub Actions
2. Verificar secrets configurados
3. Testar localmente:
```bash
npm run build
npm run migrate
```

### Erro de Conexão com Banco

**Problema:** `Error: connect ECONNREFUSED`

**Solução:**
1. Verificar se MySQL está rodando (XAMPP)
2. Verificar credenciais no `.env`
3. Testar conexão:
```bash
mysql -h localhost -u root -p fincontrol_db
```

### Backup Não Funciona

**Problema:** `mysqldump: command not found`

**Solução:**
```bash
# Instalar MySQL client
# Ubuntu/Debian
sudo apt-get install mysql-client

# macOS
brew install mysql-client

# Windows (XAMPP)
# Adicionar ao PATH: C:\xampp\mysql\bin
```

---

## 📈 Boas Práticas

### ✅ Fazer

- Sempre criar backup antes de migrations em produção
- Testar migrations em desenvolvimento primeiro
- Commitar migrations junto com o código
- Usar nomes descritivos para migrations
- Documentar migrations complexas
- Manter backups dos últimos 10 deploys

### ❌ Não Fazer

- Modificar migrations já executadas em produção
- Fazer DROP de tabelas sem backup
- Executar migrations diretamente em produção sem teste
- Commitar arquivos `.env` com credenciais
- Ignorar erros de migration

---

## 🔐 Segurança

### Variáveis Sensíveis

**NUNCA commite:**
- `.env` (credenciais reais)
- Chaves SSH privadas
- Tokens de API
- Senhas de banco de dados

**Use:**
- `.env.example` (template sem credenciais)
- GitHub Secrets (para CI/CD)
- Variáveis de ambiente do servidor

### Backup

- Backups são armazenados localmente em `backups/`
- Em produção, use S3 ou similar
- Mantenha backups criptografados
- Teste restore regularmente

---

## 📞 Suporte

### Problemas Comuns

1. **Migration não executou**
   - Verificar logs: `npm run migration:status`
   - Ver erro no GitHub Actions

2. **Deploy falhou**
   - Verificar secrets do GitHub
   - Testar build local

3. **Backup não funciona**
   - Instalar `mysqldump`
   - Verificar credenciais

### Recursos

- [Documentação MySQL](https://dev.mysql.com/doc/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Deploy](https://vercel.com/docs)
- [PlanetScale Docs](https://planetscale.com/docs)

---

## 🎉 Pronto!

Seu sistema de deploy automático está configurado!

**Próximos passos:**

1. ✅ Configurar secrets no GitHub
2. ✅ Criar primeira migration
3. ✅ Fazer push para `main`
4. ✅ Monitorar deploy no GitHub Actions
5. ✅ Verificar aplicação deployada

**Qualquer mudança que você fizer agora será automaticamente deployada!** 🚀
