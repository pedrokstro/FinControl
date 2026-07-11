# Especificações do Frontend Web Atual (React)

Este documento mapeia o funcionamento do cliente frontend web atual do FinControl para auxiliar na tradução das telas, fluxos de navegação e gerenciamento de estado para o Jetpack Compose no Android.

---

## 1. Arquitetura de Estados (Stores do Zustand)
A aplicação web gerencia o estado global por meio de duas stores do Zustand:

### 1. `useAuthStore`
Controla a sessão, autenticação, preferências e dados do usuário logado.
- **Campos**:
  - `user`: Dados cadastrais (`id`, `name`, `email`, `role`, `planType`, `isPremium`, `isAdmin`, `theme`).
  - `token`/`refreshToken`: Tokens de autenticação JWT salvos no localStorage.
  - `isAuthenticated`: Flag booleana de estado de login.
  - `theme`: Controla o tema ativo (`light` | `dark` | `system`).
- **Métodos**:
  - `login(email, password)`: Envia requisição para a API, armazena tokens e dados do usuário.
  - `logout()`: Limpa tokens locais e estados.
  - `updateTheme(theme)`: Sincroniza a preferência no banco via API `/users/profile` e altera a classe `dark` na raiz da página.

### 2. `useFinancialStore`
Centraliza todos os registros e operações financeiras.
- **Campos**:
  - `transactions`: Lista completa das transações obtidas da API.
  - `categories`: Lista de categorias de receitas/despesas.
  - `creditCards`: Lista de cartões cadastrados.
  - `dashboardSummary`: Resumo do mês atual (`monthBalance`, `income`, `expense`).
  - `isLoading`: Estado de carregamento global para spinners e skeletons.
- **Métodos**:
  - `syncWithBackend()`: Executado na montagem do layout (`MainLayout`) para sincronizar transações, categorias e cartões em lote.
  - `addTransaction(data)` / `editTransaction(id, data)` / `deleteTransaction(id)`: Invoca a API e atualiza o estado local reativo.

### 3. `useTransactionLimit`
Hook utilitário para validar restrições de planos gratuitos.
- **Métodos**:
  - `checkLimit()`: Retorna se o usuário gratuito atingiu o teto máximo de transações mensais.
  - `usage`: Número de lançamentos ativos.

---

## 2. Mapa de Rotas e Telas
A navegação web é protegida pelo react-router-dom sob o prefixo `/app`:

| Rota Web | Componente | Descrição no Mobile |
|---|---|---|
| `/login` | `Login.tsx` | Tela inicial de acesso com inputs |
| `/register` | `Register.tsx` | Cadastro de novos usuários |
| `/app/dashboard` | `Dashboard.tsx` | Tela Principal (Saldo, Atalhos e Avisos) |
| `/app/transactions` | `Transactions.tsx` | Lista agrupada de transações com swipe de ações |
| `/app/categories` | `Categories.tsx` | Lista e criação de categorias |
| `/app/cards` | `Cards.tsx` | Limites e despesas de cartões de crédito |
| `/app/subscriptions` | `Subscriptions.tsx` | Upgrade para o plano Premium |
| `/app/admin` | `Admin.tsx` | Gestão de avisos (Apenas visível se `isAdmin === true`) |

---

## 3. Comportamento Visual dos Componentes Críticos

### 1. Lista Agrupada por Dia (`Transactions.tsx`)
- **Web UI**: As transações são agrupadas por data ISO. No mobile, cada dia é envelopado em um contêiner card arredondado (`rounded-2xl bg-white border border-gray-200/50`) e as transações do mesmo dia aparecem em linhas separadas por divisores sutis.
- **Mecânica de Swipe**: O card da transação desliza no eixo X (`drag="x"` do Framer Motion). O arrasto é bloqueado para a direita (`right: 0`) e limitado à esquerda (`left: -112px` ou `-232px`). Ao soltar com arrasto menor que 30px, o card retorna a zero; se maior, fixa-se aberto sobre os botões.

### 2. Modal QuickAdd (`Dashboard.tsx`)
- **Web UI**: Exibe um Bottom Sheet tátil.
- **Display de Valor**: O input foca automaticamente e centraliza o valor digitado de forma gigante. O valor padrão é `0,00`.
- **Efeito de Mola**: Ativar a chave de transação recorrente expande verticalmente as opções de parcelas com efeito de mola elástica (spring).

### 3. Calendário / Data (`CustomDatePicker.tsx`)
- **Comportamento**: Para evitar cortes causados por propriedades de `overflow: hidden` nos modais, o calendário é renderizado diretamente no `body` da página através de um **React Portal** e posicionado de forma fixa utilizando cálculos dinâmicos de coordenadas (`getBoundingClientRect`).
- **Mobile Translate**: No Android, utilize o componente padrão de diálogo `DatePickerDialog` do Material 3 para uma experiência nativa polida.
