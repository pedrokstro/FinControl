# GitHub Actions - CI/CD Pipeline

Este diretório contém os workflows de CI/CD do FinControl.

## 🚀 Workflow Principal: deploy.yml

### Triggers
- Push para `main` ou `production`
- Pull Request para `main`

### Jobs

#### 1️⃣ Build e Test
```yaml
- Checkout código
- Setup Node.js 18.x
- Instalar dependências
- Verificar TypeScript
- Lint
- Build
- Upload artifacts
```

#### 2️⃣ Deploy Frontend
```yaml
- Download build artifacts
- Deploy para Vercel/Netlify
```

#### 3️⃣ Database Migrations
```yaml
- Verificar migrations pendentes
- Criar backup do banco
- Executar migrations
```

#### 4️⃣ Deploy Backend
```yaml
- SSH para servidor
- Pull código
- Instalar dependências
- Build
- Restart PM2
```

#### 5️⃣ Notificação
```yaml
- Enviar notificação Discord/Slack
- Status: Sucesso ou Falha
```

## 🔐 Secrets Necessários

Configure no GitHub: `Settings > Secrets and variables > Actions`

### Vercel
```
VERCEL_TOKEN=seu_token
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id
```

### Netlify (alternativa)
```
NETLIFY_SITE_ID=seu_site_id
NETLIFY_AUTH_TOKEN=seu_token
```

### Database
```
DATABASE_URL=postgresql://user:pass@host:5432/db
DB_HOST=seu_host
DB_PORT=5432
DB_NAME=seu_database
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

### Servidor (Backend)
```
SERVER_HOST=seu_servidor.com
SERVER_USER=usuario_ssh
SSH_PRIVATE_KEY=sua_chave_privada
```

### Notificações
```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Backup
```
BACKUP_BUCKET=seu_bucket_s3
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=seu_secret
```

## 📊 Fluxo de Deploy

```mermaid
graph TD
    A[Push para main] --> B[Build e Test]
    B --> C{Sucesso?}
    C -->|Sim| D[Backup DB]
    C -->|Não| Z[Notificar Falha]
    D --> E[Executar Migrations]
    E --> F[Deploy Frontend]
    E --> G[Deploy Backend]
    F --> H[Notificar Sucesso]
    G --> H
```

## 🛠️ Como Usar

### Deploy Automático
```bash
# Fazer commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# GitHub Actions executa automaticamente
```

### Monitorar Deploy
1. Ir para `Actions` no GitHub
2. Selecionar workflow em execução
3. Ver logs em tempo real

### Deploy Manual
```bash
# Trigger manual no GitHub Actions
# Ou executar localmente:
npm run build
npm run migrate
npm run deploy
```

## 📝 Logs e Debugging

### Ver Logs do Workflow
```
GitHub > Actions > Selecionar run > Ver job > Ver step
```

### Logs de Migration
```bash
# No servidor
tail -f /var/log/migrations.log
```

### Logs de Deploy
```bash
# No servidor
pm2 logs fincontrol
```

## ⚠️ Troubleshooting

### Build Falha
```bash
# Verificar localmente
npm run build
npm run type-check
npm run lint
```

### Migration Falha
```bash
# Restaurar backup
npm run db:restore <backup-file>

# Verificar migration
cat migrations/YYYYMMDDHHMMSS_nome.sql

# Testar localmente
npm run migrate
```

### Deploy Falha
```bash
# Verificar secrets configurados
# Verificar logs do GitHub Actions
# Testar conexão SSH
ssh usuario@servidor
```

## 🔄 Rollback

### Rollback de Código
```bash
# Reverter commit
git revert HEAD
git push origin main
# GitHub Actions faz deploy automático
```

### Rollback de Database
```bash
# Restaurar backup
node scripts/backup-database.js restore backup_YYYYMMDD.sql
```

### Rollback de Deploy
```bash
# SSH no servidor
ssh usuario@servidor
cd /var/www/fincontrol
git reset --hard HEAD~1
npm ci
npm run build
pm2 restart fincontrol
```

## 📈 Melhorias Futuras

- [ ] Testes automatizados (Jest, Cypress)
- [ ] Deploy staging antes de produção
- [ ] Smoke tests pós-deploy
- [ ] Monitoramento de performance
- [ ] Alertas de erro (Sentry)
- [ ] Deploy blue-green
- [ ] Canary deployments
- [ ] Rollback automático em caso de erro

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Deploy](https://vercel.com/docs/deployments/overview)
- [Netlify Deploy](https://docs.netlify.com/site-deploys/overview/)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)
