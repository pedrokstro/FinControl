# 🔄 GitHub Actions Workflows

Este documento descreve os workflows automatizados configurados para o projeto FinControl.

## 📋 Workflows Disponíveis

### 1. CI/CD Pipeline (`ci.yml`)

**Trigger:** Push e Pull Request nas branches `main` e `develop`

**Jobs:**

#### Frontend Build & Test
- ✅ Executa em Node.js 18.x e 20.x
- ✅ Instala dependências com cache
- ✅ Executa ESLint
- ✅ Executa testes unitários
- ✅ Faz build do frontend
- ✅ Salva artefatos de build

#### Backend Build & Test
- ✅ Configura PostgreSQL 15 como serviço
- ✅ Executa em Node.js 18.x e 20.x
- ✅ Instala dependências do backend
- ✅ Executa linting
- ✅ Executa testes com banco de dados
- ✅ Faz build do backend

#### Code Quality Check
- ✅ Verifica formatação com Prettier
- ✅ Busca por TODO/FIXME no código
- ✅ Análise de qualidade de código

#### Security Audit
- ✅ Executa `npm audit` no frontend
- ✅ Executa `npm audit` no backend
- ✅ Verifica vulnerabilidades conhecidas

#### Deploy to Production
- ✅ Executa apenas na branch `main`
- ✅ Depende de todos os jobs anteriores
- ✅ Faz build de produção
- ✅ Pronto para deploy automático

---

### 2. Release (`release.yml`)

**Trigger:** Push de tags no formato `v*.*.*` (ex: v1.8.0)

**Funcionalidades:**
- 📦 Cria release automática no GitHub
- 📝 Gera notas de release com commits desde a última tag
- 📤 Anexa artefatos de build ao release
- 🏷️ Marca como release oficial (não draft/prerelease)

**Como criar uma release:**
```bash
git tag -a v1.8.1 -m "Release 1.8.1"
git push origin v1.8.1
```

---

### 3. Dependency Review (`dependency-review.yml`)

**Trigger:** Pull Requests para `main` e `develop`

**Funcionalidades:**
- 🔍 Analisa mudanças em dependências
- ⚠️ Alerta sobre vulnerabilidades moderadas ou superiores
- 💬 Comenta no PR com resumo de dependências
- 🛡️ Previne merge de dependências vulneráveis

---

### 4. Update Badges (`update-badges.yml`)

**Trigger:** 
- Push na branch `main`
- Agendamento semanal (domingos)

**Funcionalidades:**
- 📊 Calcula estatísticas do projeto
- 📈 Conta linhas de código
- 📁 Conta arquivos TypeScript
- 🔄 Atualiza métricas automaticamente

---

## 🎯 Status dos Workflows

Você pode visualizar o status dos workflows em:
- **Actions Tab:** https://github.com/pedrokstro/FinControl/actions
- **Badges no README:** Mostram status em tempo real

## 🔧 Configuração Local

Para testar os workflows localmente, use [act](https://github.com/nektos/act):

```bash
# Instalar act
choco install act-cli  # Windows
brew install act       # macOS

# Executar workflow de CI
act -j frontend

# Executar todos os jobs
act push
```

## 📝 Variáveis de Ambiente

Os workflows usam as seguintes variáveis:

### Secrets (configurar em Settings > Secrets)
- `GITHUB_TOKEN` - Gerado automaticamente pelo GitHub

### Variáveis de Ambiente
- `NODE_ENV` - Ambiente de execução (test, production)
- `DATABASE_URL` - URL do banco PostgreSQL (apenas em testes)
- `JWT_SECRET` - Chave secreta JWT (apenas em testes)

## 🚀 Melhorias Futuras

- [ ] Adicionar cobertura de testes com Codecov
- [ ] Implementar deploy automático para Vercel/Netlify
- [ ] Adicionar notificações no Slack/Discord
- [ ] Configurar análise de código com SonarCloud
- [ ] Adicionar testes E2E com Playwright
- [ ] Implementar cache de dependências mais agressivo
- [ ] Adicionar workflow de performance testing

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Marketplace](https://github.com/marketplace?type=actions)

---

**Última atualização:** Dezembro 2024  
**Versão:** 1.8.0
