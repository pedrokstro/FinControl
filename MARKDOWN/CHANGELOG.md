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

## [2.2.0] - 2026-03-10

### Adicionado
- **Controle de Cartões de Crédito (Completo):**
  - Página `/cartões` completamente funcional: listagem visual, cards com fatura atual calculada em tempo real, barra de progresso do limite utilizado, dias de fechamento e vencimento.
  - Modal de criação e edição de cartões com nome, bandeira, limite (opcional), dia de fechamento e dia de vencimento.
  - Exclusão de cartão com modal de confirmação.
  - Ao criar ou editar uma despesa, o usuário pode vincular um **Cartão de Crédito** (dropdown opcional).
  - Despesas vinculadas a cartões são **excluídas do total de despesas** no resumo mensal, evitando dupla contagem (a fatura já representa o total).
  - O backend agora retorna os dados do cartão (`creditCard`) em todas as queries de transações.

- **Rastreador de Assinaturas (Melhorado):**
  - Detecção automática de marca por nome: Netflix, Spotify, Amazon/Prime, Apple/iCloud, Google/YouTube e Disney+ exibem seus ícones reais.
  - Ícones de marcas adicionados ao `iconMapping.tsx` via `@iconify/react` (Netflix, Spotify, Amazon, Apple, Google, Disney+).
  - Grupo **"Assinaturas"** adicionado no seletor de ícones (IconPicker) para despesas, facilitando categorizar streaming e serviços.

### Corrigido
- `creditCard` adicionado às `relations` nas queries de `create`, `findAll`, `findById` e `update` do `transaction.service.ts`.
- Avisos de lint removidos (`useMemo`, `Wallet`) na página `Cards.tsx`.

---

## [2.1.3] - 2026-03-10

### Adicionado
- **Rastreador de Assinaturas (Subscriptions Tracker):**
  - Nova aba principal dedicada a gastos fixos recorrentes.
  - Varre o histórico e agrupa despesas recorrentes (ex: Netflix, Spotify, Academia).
  - Mostra projeção implacável do custo no mês ("Custo Mensal") e no ano inteiro ("Dreno Anual").
  - Reaproveita a aba nativa de ícones "Exclusivos" para as marcas e serviços sem sujar o código.
  - Ícone de atalho fácil pelo Menu Lateral "Assinaturas".
  - Barra de pesquisa integrada para achar a assinatura exata.

---

## [2.1.2] - 2026-03-10

### Adicionado
- **Feedback Tátil (Haptics):** Implementação de respostas vibratórias (`navigator.vibrate`) em interações importantes no mobile, como:
  - Salvar/Excluir transações e categorias (vibração de sucesso/aviso).
  - Abrir e selecionar datas em calendários e opções em dropdowns personalizados (vibração leve).
  - Navegação do Menu e botão Flutuante (vibração média e tátil de botões).

## [2.1.1] - 2026-03-09

### Adicionado
- **PWA Fullscreen:** O aplicativo agora roda em modo tela cheia real (fullscreen), ocultando a barra de status do sistema para uma experiência de aplicativo nativo completa.
- Suporte a `viewport-fit=cover` para aproveitar toda a área da tela em dispositivos com entalhe (notches).

### Corrigido
- Valores financeiros nos cartões de resumo que ficavam obstruídos ou com "..." no mobile agora ajustam o tamanho da fonte dinamicamente e não são mais truncados.

---

## [2.1.0] - 2026-03-09

### Adicionado
- **Swipe-to-Action Mobile:** Gesto de deslizar para a esquerda (framer-motion) adicionado nos cartões de transação para editar/excluir deslizando o dedo no celular.
- **Pull-to-Close:** Gesto de deslizar de cima para baixo na "barrinha" para fechar Fisicamente todos os Modais, Calendários Customizados, Dropdowns e Icon Pickers fluídos tipo iOS.
- Teclado numérico Mobile Nativo em todos os campos que exigem moeda, taxas ou quantidades financeiras (`inputMode="decimal"`), refinando o uso no iOS/Android.
- Remodelação Visual de Cartões Estatísticos: Cartões refeitos usando ícones, sombras e modo Focus com cores na página de transações/dashboard.
- Responsividade refinada no Login (sem `scrollbars` no mobile) e posicionamento melhorado do botão "Sair" para o Floating Action Button (FAB) em telas pequenas.

### Alterado
- Extermínio de selects nativos HTML: Troca total de `<select>` engessados por Dropdowns Customizados e fluidos em Telas de Configurações, Admin, Calculadora e Modal de Transações.
- Refinada e simplificada a barra com Seletor de Meses para acompanhar o padrão visual leve na interface de transações.

---

## [2.0.1] - 2026-03-09

### Adicionado
- Animações escalonadas nos gráficos da Dashboard: AreaChart (receitas vs despesas), BarChart formatadas.
- Animações circulares e lineares de PieCharts na Calculadora de Juros Compostos e em Relatórios Dinâmicos.
- Animação padronizada de expansão e visibilidade (pulsação ascendente) para ícones TradingUp/TradingDown em modais e alertas de Upgrade e Limits.
- Re-refatoração e memoização de gráficos Recharts no arquivo AdvancedCharts para exibição estática transacional animada suave de elementos svg.

### Corrigido
- Avisos de ununsed components no linter (`PageTransition` em Plans.tsx).
- Responsividade refinada para uso de animações em ambiente Mobile (Dashboard e Modal Premium).

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
