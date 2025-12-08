# FinControl v1.8.0

Sistema completo de controle financeiro pessoal com React, TypeScript e Node.js.

## Funcionalidades Principais

### Frontend
- Dashboard Interativo - Visao completa das financas com graficos
- Transacoes Recorrentes - Geracao automatica de parcelas
- Calculadoras Financeiras - Porcentagem e juros compostos com design premium
- Categorias Personalizadas - 40+ icones exclusivos PNG
- Graficos Detalhados - Pizza, linha e barras com Recharts
- Sistema de Metas - Acompanhamento de economia

### Backend
- Autenticacao JWT - Sistema seguro de login
- PostgreSQL + TypeORM - Banco de dados robusto
- API RESTful - Endpoints completos
- Migrations - Controle de versao do banco

### DevOps
- GitHub Actions - CI/CD completo
- Secrets Management - Configuracao segura
- Scripts Utilitarios - Backup, migrations, setup
- Documentacao Completa - README, guias e workflows

## Correcoes

- Transacoes recorrentes persistem apos logout/login
- Exclusao de transacao pai remove todas as parcelas filhas
- Labels do grafico de pizza sem sobreposicao
- Inputs das calculadoras com overflow corrigido
- Credenciais removidas do codigo (seguranca)

## Melhorias

- Design premium nas calculadoras
- Footer com versao do projeto (1.8.0)
- README completo com badges
- Sistema de secrets automatizado
- Documentacao expandida

## Stack Tecnologica

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

## Instalacao

```bash
# Clonar repositorio
git clone https://github.com/pedrokstro/FinControl.git
cd FinControl

# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

## Links

- [Documentacao Completa](https://github.com/pedrokstro/FinControl#readme)
- [Quick Start Guide](https://github.com/pedrokstro/FinControl/blob/main/.github/QUICK_START.md)
- [Configuracao de Secrets](https://github.com/pedrokstro/FinControl/blob/main/.github/SECRETS_SETUP.md)
- [Workflows](https://github.com/pedrokstro/FinControl/blob/main/.github/WORKFLOWS.md)

## Desenvolvido por

**PEDRO KSTRO**

---

Se este projeto te ajudou, considere dar uma estrela!
