# 🚀 Guia Completo de Deploy - FinControl

## ✅ Status Atual
- [x] Banco de dados PostgreSQL (Supabase) configurado
- [x] GitHub Actions configurado
- [x] Vercel configurado para frontend
- [x] Render configurado para backend
- [ ] Executar migration de Trial e Google Pay

---

## 🗄️ **Banco de Dados**

### **Produção (Configurado)**
- **Tipo**: PostgreSQL 15
- **Provider**: Supabase
- **Host**: db.hzazlkgpamawlqmvxyii.supabase.co
- **Porta**: 5432
- **Database**: postgres
- **User**: postgres
- **SSL**: Habilitado

### **Desenvolvimento Local (Opcional)**
- **Tipo**: PostgreSQL 15
- **Host**: localhost
- **Porta**: 5432
- **Database**: fincontrol_dev
- **User**: postgres
- **Password**: postgres

### **Por que Supabase?**
- ✅ PostgreSQL gerenciado
- ✅ Gratuito até 500MB
- ✅ Backups automáticos
- ✅ Dashboard SQL integrado
- ✅ Escalável
- ✅ SSL/TLS automático
- 🔗 https://supabase.com

---

## 📋 **Secrets Obrigatórios no GitHub**

Acesse: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### **1. Database (PostgreSQL - Supabase)**
```bash
# URL completa do Supabase
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres

# Ou detalhado:
DB_HOST = db.hzazlkgpamawlqmvxyii.supabase.co
DB_PORT = 5432
DB_USERNAME = postgres
DB_PASSWORD = sua_senha_supabase
DB_DATABASE = postgres
```

### **3. JWT Secrets (CRÍTICO - Gerar novos)**
```bash
# Gerar com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET = [gerar string aleatória de 64 caracteres]
JWT_REFRESH_SECRET = [gerar string aleatória diferente de 64 caracteres]
```

### **4. Deploy Frontend (escolha uma opção)**

#### **Opção A: Vercel (Recomendado)**
```bash
VERCEL_TOKEN = [token da Vercel]
VERCEL_ORG_ID = [ID da organização]
VERCEL_PROJECT_ID = [ID do projeto]
```

Como obter:
1. Acesse https://vercel.com/account/tokens
2. Crie um novo token
3. Instale Vercel CLI: `npm i -g vercel`
4. Execute: `vercel link` na pasta do projeto
5. Os IDs estarão em `.vercel/project.json`

#### **Opção B: Netlify**
```bash
NETLIFY_SITE_ID = [ID do site]
NETLIFY_AUTH_TOKEN = [token de autenticação]
```

Como obter:
1. Acesse https://app.netlify.com/user/applications
2. Crie um Personal Access Token
3. O SITE_ID está em: Site Settings → General → Site details

### **5. Deploy Backend (opcional - se não usar Render/Railway)**
```bash
SERVER_HOST = [IP ou domínio do servidor]
SERVER_USER = [usuário SSH]
SSH_PRIVATE_KEY = [chave privada SSH]
```

### **6. Email (para recuperação de senha)**
```bash
EMAIL_USER = [seu email]
EMAIL_PASSWORD = [senha de app do Gmail ou SMTP]
```

Para Gmail:
1. Ative autenticação de 2 fatores
2. Gere senha de app: https://myaccount.google.com/apppasswords

### **7. Notificações (opcional)**
```bash
DISCORD_WEBHOOK_URL = [URL do webhook do Discord]
```

---

## 🔧 **Configuração Passo a Passo**

### **Passo 1: Gerar JWT Secrets**

Execute no terminal:
```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT_REFRESH_SECRET (execute novamente para gerar outro)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie os valores e adicione como secrets no GitHub.

### **Passo 2: Configurar Vercel (Frontend)**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Linkar projeto (na pasta raiz)
vercel link

# 4. Ver configurações
cat .vercel/project.json
```

Adicione os valores como secrets:
- `VERCEL_TOKEN`: Token da conta
- `VERCEL_ORG_ID`: Do arquivo .vercel/project.json
- `VERCEL_PROJECT_ID`: Do arquivo .vercel/project.json

### **Passo 3: Configurar Backend (Render/Railway)**

#### **Opção A: Render (Grátis)**
1. Acesse https://render.com
2. Crie um novo Web Service
3. Conecte ao repositório GitHub
4. Configure:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment: Node
5. Adicione as variáveis de ambiente:
   ```
   DATABASE_URL
   JWT_SECRET
   JWT_REFRESH_SECRET
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://seu-frontend.vercel.app
   ```

#### **Opção B: Railway (Grátis)**
1. Acesse https://railway.app
2. Crie novo projeto
3. Conecte ao GitHub
4. Configure variáveis de ambiente (mesmas acima)

### **Passo 4: Configurar CORS**

No backend, adicione o domínio do frontend:
```env
CORS_ORIGIN=https://seu-app.vercel.app
```

---

## 🧪 **Testar Localmente Antes do Deploy**

```bash
# 1. Backend
cd backend
cp .env.example .env
# Edite .env com suas configurações
npm install
npm run build
npm start

# 2. Frontend
cd ..
cp .env.example .env
# Edite .env com a URL do backend
npm install
npm run build
npm run preview
```

---

## 🚀 **Fazer Deploy**

```bash
# 1. Commit e push
git add .
git commit -m "feat: configurar deploy"
git push origin main

# 2. Acompanhar no GitHub
# Acesse: Actions → Auto Deploy
```

---

## 📊 **Variáveis de Ambiente - Resumo**

### **Backend (.env)**
```env
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1

# Database (Supabase)
DATABASE_URL=postgresql://postgres:PASSWORD@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres

# JWT
JWT_SECRET=<gerar>
JWT_REFRESH_SECRET=<gerar>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://seu-frontend.vercel.app

# Email
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=senha-de-app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Frontend (.env)**
```env
VITE_API_URL=https://seu-backend.render.com/api/v1
VITE_APP_NAME=FinControl
VITE_APP_VERSION=1.0.0
```

---

## ✅ **Checklist Final**

- [ ] DATABASE_URL configurado
- [ ] JWT_SECRET gerado e configurado
- [ ] JWT_REFRESH_SECRET gerado e configurado
- [ ] Vercel/Netlify configurado
- [ ] Backend deployado (Render/Railway)
- [ ] CORS configurado com domínio correto
- [ ] Email configurado (opcional)
- [ ] Teste de conexão com banco
- [ ] Teste de autenticação
- [ ] Teste de CRUD

---

## 🆘 **Troubleshooting**

### **Erro: CORS**
```
Access to fetch at 'https://backend.com' from origin 'https://frontend.com' has been blocked
```
**Solução:** Adicione o domínio do frontend em `CORS_ORIGIN` no backend.

### **Erro: Database Connection**
```
Error: connect ETIMEDOUT
```
**Solução:** 
1. Verifique se o DATABASE_URL está correto
2. Verifique se o IP está na whitelist do Supabase (Settings > Database > Connection Pooling)
3. Teste a conexão: `psql $DATABASE_URL`

### **Erro: JWT Invalid**
```
Error: jwt malformed
```
**Solução:** Verifique se JWT_SECRET está configurado corretamente.

---

## �️ **Migrations e Schema do Banco**

### **Arquivos SQL Disponíveis**

Todos os scripts SQL estão em: `backend/database/postgresql/`

1. **`add-trial-and-googlepay.sql`** - Migration completa com:
   - Campo `isTrial` (teste grátis 7 dias)
   - Campos Google Pay
   - Campos extras notifications
   - Índices de performance

### **Como executar no Supabase:**

#### **Opção 1: SQL Editor (Recomendado)**
1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Cole o conteúdo de `add-trial-and-googlepay.sql`
4. Clique em **Run**

#### **Opção 2: Via psql**
```bash
# Conectar ao Supabase
psql "postgresql://postgres:[PASSWORD]@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres"

# Executar migration
\i backend/database/postgresql/add-trial-and-googlepay.sql
```

#### **Opção 3: Via DATABASE_URL**
```bash
psql $DATABASE_URL -f backend/database/postgresql/add-trial-and-googlepay.sql
```

### **Estrutura do Banco:**

- **users** - Usuários e assinaturas
- **categories** - Categorias de transações
- **transactions** - Transações financeiras
- **savings_goals** - Metas de economia
- **notifications** - Notificações do sistema
- **verification_codes** - Códigos de verificação (email, senha)
- **refresh_tokens** - Tokens de autenticação

---

## 💳 **Sistema de Pagamento**

### **Google Pay (Implementado)**
- Pagamento único via Google Pay
- Teste grátis de 7 dias (sem cartão)
- Renovação manual

### **Configuração:**
```bash
# No frontend (Checkout.tsx)
environment: 'TEST'  # Mudar para 'PRODUCTION' em produção
```

### **Fluxo:**
1. Usuário pode iniciar teste grátis de 7 dias
2. Após expirar, pode comprar via Google Pay
3. Pagamento único (mensal ou anual)
4. Sem renovação automática

---

## �📞 **Suporte**

- GitHub Issues: https://github.com/seu-usuario/fincontrol/issues
- Documentação Vercel: https://vercel.com/docs
- Documentação Render: https://render.com/docs
- Documentação Supabase: https://supabase.com/docs

---

**Última atualização:** 04/12/2025
