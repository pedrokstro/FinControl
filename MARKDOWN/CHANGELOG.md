# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Planejado
- PWA (Progressive Web App)
- Modo offline
- Exportação de dados em PDF
- Múltiplos idiomas (i18n)
- Integração com Open Banking
- Aplicativo mobile (React Native)

---

## [1.0.0] - 2025-11-12

### 🎉 Lançamento Inicial

#### Adicionado

**Autenticação**
- Sistema de login e registro
- Autenticação com JWT
- Persistência de sessão
- Recuperação de senha
- Validação de email

**Dashboard**
- Resumo financeiro mensal
- Gráfico de evolução anual (barras)
- Gráfico de histórico mensal (área)
- Gráfico de finanças por categoria (pizza)
- Cards de métricas principais
- Últimas transações
- Meta de economia
- Atalhos de teclado

**Transações**
- CRUD completo de transações
- Filtros por tipo, categoria e período
- Busca por descrição
- Ordenação de colunas
- Transações recorrentes
- Adição rápida com calculadora
- Validação de formulários

**Categorias**
- CRUD de categorias personalizadas
- Seletor de ícones (Lucide)
- Seletor de emojis (Premium)
- Paleta de cores customizável
- Separação por tipo (receita/despesa)
- Categorias padrão do sistema

**Relatórios**
- Gráfico de evolução mensal
- Análise por categoria
- Comparação de períodos
- Exportação para CSV
- Filtros de data

**Configurações**
- Edição de perfil
- Upload de avatar
- Alteração de senha
- Preferências de notificação
- Tema claro/escuro
- Exclusão de conta

**Painel Admin**
- Estatísticas de usuários
- Envio de notificações
- Gerenciamento de usuários

**UI/UX**
- Design responsivo (mobile, tablet, desktop)
- Tema claro/escuro
- Animações suaves
- Feedback visual (toasts)
- Loading states
- Skeleton loaders
- Transições de página
- Sidebar colapsável

**Performance**
- Lazy loading de rotas
- Memoização de cálculos
- Otimização de re-renders
- Cache local (IndexedDB)
- Code splitting

#### Corrigido

- Animação de gráficos de barras (crescimento vertical)
- Persistência de sidebar por usuário
- Upload de avatar para banco de dados
- Validação de formulários
- Isolamento de dados entre usuários
- Encoding UTF-8 de arquivos
- Rate limiting de API
- Erros 401 em transações
- Valores NaN em cálculos

#### Alterado

- Organização de documentação (pasta MARKDOWN)
- Estrutura de componentes
- Sistema de rotas
- Gerenciamento de estado (Zustand)
- Validação com Zod

#### Removido

- LocalStorage como fonte principal de dados
- Código duplicado
- Dependências não utilizadas

---

## [0.5.0] - 2025-11-10

### Adicionado
- Sistema de planos Premium
- Página de checkout
- Integração com Stripe (simulado)
- Seletor de emojis para categorias
- Calculadora integrada

### Corrigido
- Banner Premium na sidebar
- Verificação de status Premium
- Cache de categorias

---

## [0.4.0] - 2025-11-08

### Adicionado
- Transações recorrentes
- Modal de confirmação de exclusão
- Atalhos de teclado
- Paleta de cores para categorias

### Corrigido
- Categorias não aparecendo
- Transações sumindo após reload

---

## [0.3.0] - 2025-11-05

### Adicionado
- Página de relatórios
- Gráficos interativos
- Exportação de dados
- Filtros avançados

### Alterado
- Layout do dashboard
- Cores do tema

---

## [0.2.0] - 2025-11-01

### Adicionado
- CRUD de categorias
- Seletor de ícones
- Validação de formulários
- Feedback visual

### Corrigido
- Erros de validação
- Performance de listagens

---

## [0.1.0] - 2025-10-28

### Adicionado
- Estrutura inicial do projeto
- Sistema de autenticação
- Dashboard básico
- CRUD de transações
- Configurações de usuário

---

## Tipos de Mudanças

- `Adicionado` - para novas funcionalidades
- `Alterado` - para mudanças em funcionalidades existentes
- `Depreciado` - para funcionalidades que serão removidas
- `Removido` - para funcionalidades removidas
- `Corrigido` - para correções de bugs
- `Segurança` - para vulnerabilidades corrigidas

---

**Legenda de Versões:**
- **Major (X.0.0)** - Mudanças incompatíveis com versões anteriores
- **Minor (0.X.0)** - Novas funcionalidades compatíveis
- **Patch (0.0.X)** - Correções de bugs compatíveis
