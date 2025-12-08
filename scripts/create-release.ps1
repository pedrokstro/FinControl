# Script para criar release manualmente no GitHub

Write-Host "`n=== Criar Release v1.8.0 - FinControl ===`n" -ForegroundColor Cyan

$tag = "v1.8.0"
$title = "FinControl v1.8.0 - Sistema Completo de Controle Financeiro"

$releaseNotes = @"
# 🎉 FinControl v1.8.0

Sistema completo de controle financeiro pessoal com React, TypeScript e Node.js.

## ✨ Funcionalidades Principais

### Frontend
- 📊 **Dashboard Interativo** - Visão completa das finanças com gráficos
- 💸 **Transações Recorrentes** - Geração automática de parcelas
- 🧮 **Calculadoras Financeiras** - Porcentagem e juros compostos com design premium
- 🏷️ **Categorias Personalizadas** - 40+ ícones exclusivos PNG
- 📈 **Gráficos Detalhados** - Pizza, linha e barras com Recharts
- 🎯 **Sistema de Metas** - Acompanhamento de economia

### Backend
- 🔐 **Autenticação JWT** - Sistema seguro de login
- 🗄️ **PostgreSQL + TypeORM** - Banco de dados robusto
- 📝 **API RESTful** - Endpoints completos
- 🔄 **Migrations** - Controle de versão do banco

### DevOps
- ⚙️ **GitHub Actions** - CI/CD completo
- 🔒 **Secrets Management** - Configuração segura
- 📦 **Scripts Utilitários** - Backup, migrations, setup
- 📚 **Documentação Completa** - README, guias e workflows

## 🐛 Correções

- ✅ Transações recorrentes persistem após logout/login
- ✅ Exclusão de transação pai remove todas as parcelas filhas
- ✅ Labels do gráfico de pizza sem sobreposição
- ✅ Inputs das calculadoras com overflow corrigido
- ✅ Credenciais removidas do código (segurança)

## 🎨 Melhorias

- ✨ Design premium nas calculadoras
- 🎯 Footer com versão do projeto (1.8.0)
- 📋 README completo com badges
- 🔐 Sistema de secrets automatizado
- 📖 Documentação expandida

## 🛠️ Stack Tecnológica

**Frontend:**
- React 18.2 + TypeScript 5.2
- Vite 5.0 + Tailwind CSS 3.4
- Zustand + React Hook Form + Zod
- Recharts + Lucide Icons

**Backend:**
- Node.js 20.x + Express 4.x
- PostgreSQL 15 + TypeORM 0.3
- JWT + Winston Logger

**DevOps:**
- GitHub Actions
- ESLint + Prettier + Vitest

## 📦 Instalação

\`\`\`bash
# Clonar repositório
git clone https://github.com/pedrokstro/FinControl.git
cd FinControl

# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
\`\`\`

## 🔗 Links

- 📚 [Documentação Completa](https://github.com/pedrokstro/FinControl#readme)
- 🚀 [Quick Start Guide](https://github.com/pedrokstro/FinControl/blob/main/.github/QUICK_START.md)
- 🔐 [Configuração de Secrets](https://github.com/pedrokstro/FinControl/blob/main/.github/SECRETS_SETUP.md)
- ⚙️ [Workflows](https://github.com/pedrokstro/FinControl/blob/main/.github/WORKFLOWS.md)

## 👨‍💻 Desenvolvido por

**PEDRO KSTRO**

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
"@

Write-Host "Criando release notes..." -ForegroundColor Yellow

# Salvar release notes em arquivo temporário
$releaseNotes | Out-File -FilePath "release-notes-temp.md" -Encoding UTF8

Write-Host "[OK] Release notes criadas!" -ForegroundColor Green
Write-Host "`nPara criar a release:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/pedrokstro/FinControl/releases/new" -ForegroundColor Gray
Write-Host "2. Tag: v1.8.0" -ForegroundColor Gray
Write-Host "3. Title: $title" -ForegroundColor Gray
Write-Host "4. Copie o conteudo de: release-notes-temp.md" -ForegroundColor Gray
Write-Host "5. Clique em 'Publish release'" -ForegroundColor Gray

Write-Host "`nOu use GitHub CLI (se instalado):" -ForegroundColor Cyan
Write-Host "gh release create v1.8.0 --title `"$title`" --notes-file release-notes-temp.md" -ForegroundColor Gray

Write-Host "`n[OK] Arquivo release-notes-temp.md criado!`n" -ForegroundColor Green
