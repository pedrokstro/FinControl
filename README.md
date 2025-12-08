<div align="center">

# 💰 FinControl

![Version](https://img.shields.io/badge/version-1.8.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)

### Stack Tecnológica

![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-fe0902?style=for-the-badge&logo=typeorm&logoColor=white)

### Qualidade & Ferramentas

![ESLint](https://img.shields.io/badge/ESLint-8.x-4b32c3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.x-f7b93e?style=for-the-badge&logo=prettier&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-1.x-6e9f18?style=for-the-badge&logo=vitest&logoColor=white)

---

</div>

Sistema completo de controle financeiro pessoal desenvolvido com React, TypeScript e Tailwind CSS.

## ✨ Características

### 🎯 Funcionalidades Principais

- 🔐 **Autenticação Segura** - Sistema de login com JWT e persistência local
- 📊 **Dashboard Intuitivo** - Visão geral completa das finanças com gráficos interativos
- 💸 **Gestão de Transações** - CRUD completo com filtros avançados
- 🏷️ **Categorias Personalizadas** - Organize receitas e despesas
- 📈 **Relatórios Detalhados** - Análises e visualizações financeiras
- ⚙️ **Configurações** - Personalização e preferências do usuário

### 🎨 Interface

- ✅ Design moderno e responsivo
- ✅ Componentes reutilizáveis
- ✅ Animações e transições suaves
- ✅ Feedback visual com toasts
- ✅ Paleta de cores personalizável
- ✅ Acessibilidade (WCAG 2.1 AA)

### 🛠️ Tecnologias

#### Frontend
- **React 18.2** - Biblioteca UI
- **TypeScript 5.2** - Tipagem estática
- **Vite 5.0** - Build tool e dev server
- **React Router 6.20** - Roteamento
- **Tailwind CSS 3.4** - Estilização

#### Gerenciamento de Estado
- **Zustand 4.4** - State management leve e performático
- **React Hook Form 7.49** - Gerenciamento de formulários
- **Zod 3.22** - Validação de schemas

#### Gráficos e Visualização
- **Recharts 2.10** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos

#### Qualidade de Código
- **ESLint** - Linting
- **Vitest** - Testes unitários
- **Testing Library** - Testes de componentes

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd controle-financeiro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:3000
```

## 🔑 Credenciais de Demonstração

Para acessar o sistema, use:

- **Email:** demo@financeiro.com
- **Senha:** demo123

## ⚠️ Correção de Encoding (Importante!)

Se você ver caracteres corrompidos (�) na página de Categorias:

**Solução Rápida:**
```bash
# Windows - Execute o script de correção
.\fix-encoding.bat

# Ou via PowerShell
.\fix-all-files-utf8.ps1
```

**Documentação completa:** Veja `FIX-ENCODING-NOW.md` para instruções detalhadas.

## 📁 Estrutura do Projeto

```
fincontrol/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   └── layout/      # Componentes de layout
│   ├── pages/           # Páginas da aplicação
│   ├── store/           # Gerenciamento de estado (Zustand)
│   ├── types/           # Definições TypeScript
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globais
├── backend/             # API Node.js
│   ├── src/             # Código fonte do backend
│   └── database/        # Migrations e seeds
├── scripts/             # Scripts utilitários
├── index.html           # HTML base
├── package.json         # Dependências
├── tsconfig.json        # Configuração TypeScript
├── tailwind.config.js   # Configuração Tailwind
├── vite.config.ts       # Configuração Vite
└── README.md            # Documentação
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Compila para produção
npm run preview         # Preview do build de produção

# Qualidade
npm run lint            # Executa ESLint
npm run test            # Executa testes
npm run test:ui         # Interface de testes
npm run test:coverage   # Cobertura de testes
```

## 📋 Funcionalidades Detalhadas

### Dashboard
- Resumo financeiro mensal
- Gráficos de evolução
- Últimas transações
- Cards de métricas principais

### Transações
- Adicionar receitas e despesas
- Editar e excluir transações
- Filtros por tipo, categoria e período
- Busca por descrição
- Tabela ordenável

### Categorias
- Criar categorias personalizadas
- Ícones e cores customizáveis
- Separação por tipo (receita/despesa)
- Gerenciamento completo

### Relatórios
- Gráficos de evolução mensal
- Análise por categoria
- Comparação de períodos
- Exportação para CSV

### Configurações
- Edição de perfil
- Alteração de senha
- Preferências de notificação
- Personalização visual

## 🔒 Segurança

- Rotas protegidas com autenticação
- Validação de formulários com Zod
- Tokens JWT (simulado)
- Persistência segura com localStorage
- Sanitização de inputs

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 📱 Mobile (320px+)
- 💻 Tablet (768px+)
- 🖥️ Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Customização

### Cores
Edite `tailwind.config.js` para personalizar o tema:
```js
theme: {
  extend: {
    colors: {
      primary: { /* suas cores */ },
      success: { /* suas cores */ },
      danger: { /* suas cores */ }
    }
  }
}
```

### Componentes
Todos os componentes são modulares e podem ser facilmente customizados.

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Modo watch
npm run test:watch

# Interface visual
npm run test:ui

# Cobertura
npm run test:coverage
```

## ?? Deploy

### Build de Produção
```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

### Deploy em Plataformas

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## ?? Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## ?? Roadmap

- [ ] Integração com API backend real
- [ ] Autenticação com OAuth (Google, Facebook)
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Múltiplos idiomas (i18n)
- [ ] Orçamentos e metas financeiras
- [ ] Exportação de relatórios em PDF
- [ ] Integração com bancos (Open Banking)
- [ ] Lembretes e notificações push
- [ ] Aplicativo mobile (React Native)

## ?? Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ????? Autor

Desenvolvido com ?? por [Seu Nome]

## ?? Agradecimentos

- React Team
- Tailwind CSS
- Recharts
- Zustand
- Comunidade Open Source

---

? Se este projeto te ajudou, considere dar uma estrela!
