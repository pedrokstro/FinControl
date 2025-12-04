# 🚀 Quick Start - Deploy Automático

Guia rápido para começar a usar o sistema de deploy automático.

## ⚡ Setup em 5 Minutos

### 1. Instalar Dependência

```bash
npm install pg --save-dev
```

### 2. Configurar Variáveis

```bash
# Copiar exemplo
cp .env.example .env

# Editar com suas credenciais
# DATABASE_URL=postgresql://user:password@localhost:5432/fincontrol
```

### 3. Testar Localmente

```bash
# Ver status das migrations
npm run migration:status

# Executar migrations
npm run migrate

# Criar backup
npm run db:backup
```

### 4. Configurar GitHub

No seu repositório GitHub:

`Settings > Secrets and variables > Actions > New repository secret`

**Mínimo necessário:**

```
DATABASE_URL=postgresql://user:pass@host:5432/db
VERCEL_TOKEN=seu_token
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id
```

### 5. Fazer Deploy!

```bash
git add .
git commit -m "feat: configurar auto-deploy"
git push origin main
```

✅ **Pronto!** GitHub Actions fará o resto automaticamente.

---

## 📝 Criar Sua Primeira Migration

```bash
# 1. Criar migration
npm run migration:create

# 2. Responder perguntas
Nome: add_user_phone
Tipo: 2 (coluna)

# 3. Editar arquivo gerado
# migrations/YYYYMMDDHHMMSS_add_user_phone.sql

# 4. Commitar
git add migrations/
git commit -m "feat: add user phone column"
git push

# 5. Deploy automático acontece!
```

---

## 🎯 Comandos Principais

```bash
# Migrations
npm run migrate              # Executar
npm run migration:create     # Criar nova
npm run migration:status     # Ver status

# Backup
npm run db:backup           # Criar backup
npm run db:list             # Listar backups
npm run db:restore <file>   # Restaurar

# Deploy
git push origin main        # Deploy automático!
```

---

## 📊 Monitorar Deploy

1. Ir para GitHub
2. Clicar em "Actions"
3. Ver workflow em execução
4. Verificar logs

---

## ❓ Problemas?

### Migration não executou
```bash
npm run migration:status
# Ver qual migration falhou
```

### Deploy falhou
```bash
# Ver logs no GitHub Actions
# Testar localmente:
npm run build
npm run migrate
```

### Restaurar backup
```bash
npm run db:list
npm run db:restore backup_YYYY-MM-DD.sql
```

---

## 📚 Documentação Completa

- [DEPLOY.md](./DEPLOY.md) - Guia completo
- [migrations/README.md](./migrations/README.md) - Guia de migrations
- [.github/workflows/README.md](./.github/workflows/README.md) - CI/CD

---

## ✅ Checklist

- [ ] Instalar `pg`
- [ ] Configurar `.env`
- [ ] Testar migrations localmente
- [ ] Configurar GitHub Secrets
- [ ] Fazer primeiro deploy
- [ ] Verificar no GitHub Actions
- [ ] Confirmar aplicação funcionando

**Tudo funcionando? Parabéns! 🎉**

Agora toda mudança que você fizer será automaticamente deployada!
