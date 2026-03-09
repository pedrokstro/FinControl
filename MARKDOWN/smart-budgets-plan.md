# Implementação: Orçamentos Inteligentes por Categoria (Smart Budgets)

## 🎯 Objetivo
Permitir que os usuários estipulem restrições financeiras e um limite de gastos para cada categoria de despesa (ex: Moradia, Alimentação, Lazer). O foco é trazer clareza visual, gerando Barras de Progresso que variam de cor (Verde, Amarelo, Vermelho) com base na porcentagem já gasta no mês.

## 📋 Arquitetura da Solução e Fases

### Fase 1: Estrutura Base e Serviços (🔥 Atual)
- [x] Criação de Tipos e Interfaces `Budget` (`src/types/index.ts`).
- [x] Criação do Serviço Local para Orçamentos (`src/services/budget.service.ts`).
  - Funções de `getBudgets`, `saveBudget`, `deleteBudget`.

### Fase 2: Adaptação das Interfaces e Estados
- [x] Conectar os limites de Orçamentos com as Categorias localmente e no Contexto (Zustand ou Hooks globais).
- [x] Construir o Componente `BudgetProgressBar`. Ele deve receber o total da categoria, o orçamentado, e processar as divisões:
  - `< 70%`: Verde (Sustentável)
  - `70% - 90%`: Amarelo (Atenção)
  - `> 90%`: Vermelho (Crítico / Ultrapassado)

### Fase 3: Interações da UI e Modais
- [x] Alterar a Listagem na página `Categories.tsx` para além de listar as categorias, mostrar visualmente a Barra do "Limite Gasto".
- [x] Adicionar botão "Definir Orçamento" ou "Ajustar Limite" no modal/ações da categoria.
- [x] Incorporar painel simplificado "Meus Limites" num Widget ou sessão do `Dashboard.tsx`, para a visualização macro do mês.

---

> Esse documento reflete o planejamento inicial. As etapas de Estado/Lógica foram desenhadas para a Fase 1 e estão rodando ou em prontas. Aguardo seu sinal verde para começar as integrações de estado e a mudança profunda nas views (Fases 2 e 3).
