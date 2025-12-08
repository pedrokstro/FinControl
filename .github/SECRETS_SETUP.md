# 🔐 Configuração de Secrets e Variables

Este guia explica como configurar secrets e variables no GitHub para o projeto FinControl.

## 📍 Onde Configurar

Acesse: **Settings** → **Secrets and variables** → **Actions**

URL direta: `https://github.com/pedrokstro/FinControl/settings/secrets/actions`

---

## 🔑 Secrets Necessários

### 1. Secrets do Backend

#### `DATABASE_URL`
- **Descrição:** URL de conexão com PostgreSQL em produção
- **Formato:** `postgresql://usuario:senha@host:5432/database`
- **Exemplo:** `postgresql://fincontrol:senha123@db.example.com:5432/fincontrol_prod`
- **Usado em:** Deploy, testes de integração

#### `JWT_SECRET`
- **Descrição:** Chave secreta para geração de tokens JWT
- **Formato:** String aleatória de 64+ caracteres
- **Exemplo:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
- **Usado em:** Autenticação, geração de tokens
- **Gerar:** 
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

#### `DATABASE_PASSWORD`
- **Descrição:** Senha do banco de dados PostgreSQL
- **Formato:** String segura
- **Usado em:** Conexão com banco de dados

---

### 2. Secrets de Deploy

#### `VERCEL_TOKEN` (se usar Vercel)
- **Descrição:** Token de autenticação da Vercel
- **Como obter:**
  1. Acesse https://vercel.com/account/tokens
  2. Crie um novo token
  3. Copie e adicione como secret
- **Usado em:** Deploy automático para Vercel

#### `NETLIFY_AUTH_TOKEN` (se usar Netlify)
- **Descrição:** Token de autenticação da Netlify
- **Como obter:**
  1. Acesse https://app.netlify.com/user/applications
  2. Crie um Personal Access Token
  3. Copie e adicione como secret
- **Usado em:** Deploy automático para Netlify

#### `NETLIFY_SITE_ID` (se usar Netlify)
- **Descrição:** ID do site na Netlify
- **Como obter:**
  1. Acesse seu site na Netlify
  2. Settings → General → Site details
  3. Copie o Site ID
- **Usado em:** Deploy automático para Netlify

---

### 3. Secrets de Notificações (Opcional)

#### `SLACK_WEBHOOK_URL`
- **Descrição:** URL do webhook para notificações no Slack
- **Como obter:**
  1. Acesse https://api.slack.com/apps
  2. Crie um Incoming Webhook
  3. Copie a URL
- **Usado em:** Notificações de build, deploy, releases

#### `DISCORD_WEBHOOK_URL`
- **Descrição:** URL do webhook para notificações no Discord
- **Como obter:**
  1. Server Settings → Integrations → Webhooks
  2. Crie um novo webhook
  3. Copie a URL
- **Usado em:** Notificações de build, deploy, releases

---

## 📊 Variables (Environment Variables)

### 1. Variables do Projeto

#### `NODE_ENV`
- **Valor:** `production`
- **Descrição:** Ambiente de execução
- **Usado em:** Build, deploy

#### `VITE_API_URL`
- **Valor:** URL da API em produção (ex: `https://api.fincontrol.com`)
- **Descrição:** URL base da API para o frontend
- **Usado em:** Build do frontend

#### `VITE_APP_NAME`
- **Valor:** `FinControl`
- **Descrição:** Nome da aplicação
- **Usado em:** Frontend

#### `VITE_APP_VERSION`
- **Valor:** `1.8.0`
- **Descrição:** Versão atual da aplicação
- **Usado em:** Frontend, footer

---

## 🛠️ Como Adicionar Secrets

### Via Interface Web

1. Acesse `https://github.com/pedrokstro/FinControl/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. Preencha:
   - **Name:** Nome do secret (ex: `DATABASE_URL`)
   - **Secret:** Valor do secret
4. Clique em **"Add secret"**

### Via GitHub CLI

```bash
# Instalar GitHub CLI
gh auth login

# Adicionar secret
gh secret set DATABASE_URL --body "postgresql://user:pass@host:5432/db"
gh secret set JWT_SECRET --body "$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"

# Listar secrets
gh secret list
```

---

## 🔒 Boas Práticas de Segurança

### ✅ Fazer

- ✅ Usar secrets para dados sensíveis (senhas, tokens, chaves)
- ✅ Rotacionar secrets regularmente (a cada 90 dias)
- ✅ Usar secrets diferentes para cada ambiente (dev, staging, prod)
- ✅ Limitar acesso aos secrets (apenas pessoas necessárias)
- ✅ Gerar JWT_SECRET com alta entropia (64+ bytes)
- ✅ Usar HTTPS para todas as conexões
- ✅ Auditar uso de secrets regularmente

### ❌ Não Fazer

- ❌ Commitar secrets no código
- ❌ Compartilhar secrets via chat/email
- ❌ Usar senhas fracas ou previsíveis
- ❌ Reutilizar secrets entre projetos
- ❌ Logar valores de secrets
- ❌ Expor secrets em variáveis de ambiente públicas
- ❌ Usar secrets em pull requests de forks

---

## 🧪 Testando Secrets Localmente

### Arquivo `.env.local` (não commitar!)

```env
# Backend
DATABASE_URL=postgresql://localhost:5432/fincontrol_dev
JWT_SECRET=dev-secret-key-change-in-production
DATABASE_PASSWORD=dev_password

# Frontend
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=FinControl
VITE_APP_VERSION=1.8.0

# Deploy (opcional para testes)
VERCEL_TOKEN=your_vercel_token_here
NETLIFY_AUTH_TOKEN=your_netlify_token_here
```

### Carregar no workflow local (act)

```bash
# Criar arquivo de secrets para act
cat > .secrets <<EOF
DATABASE_URL=postgresql://localhost:5432/fincontrol_test
JWT_SECRET=test-secret-key
EOF

# Executar workflow com secrets
act --secret-file .secrets
```

---

## 📋 Checklist de Configuração

### Secrets Essenciais
- [ ] `DATABASE_URL` - URL do banco PostgreSQL
- [ ] `JWT_SECRET` - Chave secreta JWT (64+ chars)
- [ ] `DATABASE_PASSWORD` - Senha do banco

### Secrets de Deploy (escolher plataforma)
- [ ] `VERCEL_TOKEN` (se usar Vercel)
- [ ] `NETLIFY_AUTH_TOKEN` (se usar Netlify)
- [ ] `NETLIFY_SITE_ID` (se usar Netlify)

### Variables
- [ ] `NODE_ENV` = production
- [ ] `VITE_API_URL` = URL da API
- [ ] `VITE_APP_VERSION` = 1.8.0

### Secrets Opcionais
- [ ] `SLACK_WEBHOOK_URL` (notificações)
- [ ] `DISCORD_WEBHOOK_URL` (notificações)

---

## 🔄 Rotação de Secrets

### Quando Rotacionar

- 🔄 A cada 90 dias (recomendado)
- 🔄 Após saída de membro da equipe
- 🔄 Após suspeita de vazamento
- 🔄 Após incidente de segurança

### Como Rotacionar

1. Gerar novo secret
2. Adicionar como novo secret no GitHub
3. Atualizar aplicação para usar novo secret
4. Testar em staging
5. Deploy em produção
6. Remover secret antigo após confirmação

---

## 📚 Recursos

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Secrets](https://cli.github.com/manual/gh_secret)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

**Última atualização:** Dezembro 2024  
**Versão:** 1.8.0  
**Autor:** PEDRO KSTRO
