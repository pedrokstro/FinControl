# 🚀 Quick Start - Configuração Rápida

Guia rápido para configurar o projeto FinControl do zero.

## ⚡ Setup em 5 Minutos

### 1️⃣ Clonar e Instalar

```bash
# Clonar repositório
git clone https://github.com/pedrokstro/FinControl.git
cd FinControl

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend
npm install
cd ..
```

### 2️⃣ Configurar Banco de Dados

```bash
# Instalar PostgreSQL 15
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql@15
# Linux: sudo apt install postgresql-15

# Criar banco de dados
psql -U postgres
CREATE DATABASE fincontrol_db;
CREATE USER fincontrol WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE fincontrol_db TO fincontrol;
\q
```

### 3️⃣ Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
# Importante: Alterar DATABASE_URL e JWT_SECRET
```

**Gerar JWT Secret:**
```bash
node scripts/generate-jwt-secret.js
```

### 4️⃣ Executar Migrations

```bash
cd backend
npm run migration:run
npm run seed  # Opcional: dados de exemplo
cd ..
```

### 5️⃣ Iniciar Aplicação

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🔐 Configurar GitHub Secrets

### Secrets Essenciais

1. **Acesse:** https://github.com/pedrokstro/FinControl/settings/secrets/actions

2. **Adicione os seguintes secrets:**

| Secret Name | Descrição | Como Gerar |
|-------------|-----------|------------|
| `DATABASE_URL` | URL do PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Chave JWT | `node scripts/generate-jwt-secret.js` |
| `DATABASE_PASSWORD` | Senha do banco | Sua senha do PostgreSQL |

### Secrets de Deploy (Opcional)

Para deploy automático, adicione:

**Vercel:**
- `VERCEL_TOKEN` - Token da Vercel
- `VERCEL_ORG_ID` - ID da organização
- `VERCEL_PROJECT_ID` - ID do projeto

**Netlify:**
- `NETLIFY_AUTH_TOKEN` - Token de autenticação
- `NETLIFY_SITE_ID` - ID do site

---

## 📦 Criar Release

```bash
# Criar tag
git tag -a v1.8.1 -m "Release 1.8.1"

# Enviar tag (dispara workflow de release)
git push origin v1.8.1
```

---

## 🧪 Executar Testes

```bash
# Frontend
npm test
npm run test:coverage

# Backend
cd backend
npm test
npm run test:e2e
```

---

## 🏗️ Build de Produção

```bash
# Frontend
npm run build
npm run preview  # Testar build

# Backend
cd backend
npm run build
npm start
```

---

## 📊 Verificar GitHub Actions

1. Acesse: https://github.com/pedrokstro/FinControl/actions
2. Verifique se os workflows estão passando ✅
3. Corrija erros se necessário

---

## 🔧 Comandos Úteis

```bash
# Backup do projeto
.\scripts\backup-project.ps1

# Limpar node_modules
npm run clean

# Atualizar dependências
npm update
cd backend && npm update

# Verificar vulnerabilidades
npm audit
npm audit fix

# Formatar código
npm run format

# Lint
npm run lint
npm run lint:fix
```

---

## 📚 Próximos Passos

- [ ] Configurar domínio personalizado
- [ ] Configurar SSL/HTTPS
- [ ] Configurar backup automático
- [ ] Configurar monitoramento (Sentry, LogRocket)
- [ ] Configurar analytics (Google Analytics, Plausible)
- [ ] Configurar CDN (Cloudflare)
- [ ] Configurar email (SendGrid, Mailgun)
- [ ] Configurar notificações push

---

## 🆘 Problemas Comuns

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

### Erro: "Cannot connect to database"
- Verificar se PostgreSQL está rodando
- Verificar credenciais no `.env`
- Verificar firewall

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Permission denied"
```bash
# Linux/macOS
chmod +x scripts/*.sh
```

---

## 📞 Suporte

- **Issues:** https://github.com/pedrokstro/FinControl/issues
- **Discussions:** https://github.com/pedrokstro/FinControl/discussions
- **Email:** suporte@fincontrol.com

---

**Desenvolvido por PEDRO KSTRO** ❤️
