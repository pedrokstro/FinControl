# Especificações de Banco de Dados (Database)

Esta seção descreve a modelagem das tabelas do banco de dados PostgreSQL (Supabase) e sua contraparte local (SQLite/Room Database) que deve ser implementada no app Android.

---

## 1. Mapeamento de Entidades (Room/SQLite local vs Supabase)

### Tabela `users`
Contém os dados cadastrais do usuário e informações do plano premium:
- `id` (UUID, Chave Primária)
- `name` (VARCHAR)
- `email` (VARCHAR, Único)
- `password` (VARCHAR - armazenado em hash bcrypt no backend)
- `avatar` (VARCHAR, Nullable)
- `planType` (VARCHAR: `free` ou `premium`)
- `isPremium` (BOOLEAN)
- `isAdmin` (BOOLEAN)
- `theme` (VARCHAR: `light`, `dark` ou `system`)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabela `categories`
Categorias padrão do sistema ou personalizadas criadas pelo usuário:
- `id` (UUID, Chave Primária)
- `name` (VARCHAR)
- `icon` (VARCHAR - nome do ícone mapeado do Lucide, ex: `ShoppingBag`)
- `color` (VARCHAR - código hexadecimal de cor, ex: `#ef4444`)
- `type` (VARCHAR: `income` ou `expense`)
- `userId` (UUID, Chave Estrangeira ligando a `users`)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabela `transactions`
Lançamentos financeiros de receitas e despesas. Suporta recorrências e parcelas:
- `id` (UUID, Chave Primária)
- `type` (VARCHAR: `income` ou `expense`)
- `amount` (DECIMAL/DOUBLE)
- `description` (VARCHAR)
- `date` (VARCHAR, formato `YYYY-MM-DD`)
- `categoryId` (UUID, Chave Estrangeira ligando a `categories`)
- `userId` (UUID, Chave Estrangeira ligando a `users`)
- `isRecurring` (BOOLEAN)
- `recurrenceType` (VARCHAR: `daily`, `weekly`, `monthly`, `yearly` ou Nullable)
- `recurrenceEndDate` (TIMESTAMP, Nullable)
- `nextOccurrence` (TIMESTAMP, Nullable)
- `parentTransactionId` (UUID, Nullable - aponta para a transação mãe geradora da recorrência)
- `creditCardId` (UUID, Nullable - Chave Estrangeira ligando a `credit_cards`)
- `totalInstallments` (INTEGER, Nullable - Total de parcelas contratadas)
- `currentInstallment` (INTEGER, Nullable - Parcela ativa atual do lançamento)
- `isCancelled` (BOOLEAN)
- `cancelledAt` (TIMESTAMP, Nullable)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabela `credit_cards`
Cartões de crédito cadastrados:
- `id` (UUID, Chave Primária)
- `name` (VARCHAR)
- `limit` (DECIMAL/DOUBLE)
- `closingDay` (INTEGER - Dia do fechamento da fatura)
- `dueDay` (INTEGER - Dia do vencimento)
- `brand` (VARCHAR - ex: `Visa`, `Mastercard`)
- `userId` (UUID, Chave Estrangeira ligando a `users`)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabela `budgets`
Orçamentos e tetos mensais por categoria:
- `id` (UUID, Chave Primária)
- `amountLimit` (DECIMAL/DOUBLE)
- `categoryId` (UUID, Chave Estrangeira ligando a `categories`)
- `userId` (UUID, Chave Estrangeira ligando a `users`)
- `month` (INTEGER)
- `year` (INTEGER)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabela `savings_goals`
Metas de poupança/investimentos:
- `id` (UUID, Chave Primária)
- `name` (VARCHAR)
- `targetAmount` (DECIMAL/DOUBLE)
- `currentAmount` (DECIMAL/DOUBLE)
- `targetDate` (TIMESTAMP)
- `userId` (UUID, Chave Estrangeira ligando a `users`)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabela `dashboard_cards`
Cards e avisos informativos dinâmicos para o carrossel do painel (geridos via painel administrativo):
- `id` (UUID, Chave Primária)
- `title` (VARCHAR)
- `desc` (VARCHAR)
- `bg` (VARCHAR - classe CSS ou identificador de estilo)
- `icon` (VARCHAR - nome do ícone Lucide)
- `iconColor` (VARCHAR - hexadecimal ou classe CSS)
- `actionPath` (VARCHAR - rota interna ou link externo HTTP)
- `imageSrc` (VARCHAR, Nullable - caminho de imagem local ou link de mídia)
- `isActive` (BOOLEAN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

---

## 2. Lógica de Segurança (RLS - Row Level Security)
No backend Supabase/PostgreSQL, a segurança de dados é garantida por meio de políticas de RLS. No cliente Android, você deve garantir que:
- O banco local SQLite não compartilhe dados entre diferentes credenciais. Ao efetuar logout, **o banco de dados local Room deve ser limpo completamente** (`db.clearAllTables()`) para evitar vazamento de dados de sessão.
- As consultas locais filtrem sempre pelo `userId` logado ativamente.
