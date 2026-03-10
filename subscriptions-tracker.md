# Subscriptions Tracker

## Goal
Criar uma página dedicada na navegação principal para rastrear gastos fixos recorrentes (Assinaturas), calculando o impacto financeiro mensal e anual, e exibindo logos personalizados das marcas principais.

## Tasks
- [ ] Task 1: Adicionar logotipos das principais marcas (Netflix, Spotify, Amazon, etc.) à biblioteca de ícones (`iconMapping.ts` ou criar componente SVG).
- [ ] Task 2: Atualizar `Sidebar.tsx` e `MobileNavBar.tsx` (e rotas em `App.tsx`) para incluir a nova aba "Assinaturas".
- [ ] Task 3: Criar a página `Subscriptions.tsx` estruturada (Header, Cards de Resumo Mensal/Anual, Grid de Assinaturas).
- [ ] Task 4: Implementar a lógica de filtragem puxando do contexto de transações (`useFinancial`) onde `isRecurring === true` e `type === 'expense'`.
- [ ] Task 5: Adicionar feedback tátil (Haptics) e garantir responsividade (Safe Area).

## Done When
- [ ] É possível ver a nova página "Assinaturas" pelo menu principal.
- [ ] A página exibe o total gasto por mês e o somatório dramático por ano.
- [ ] Transações marcadas como "Recorrentes" aparecem automaticamente nesta aba com seus respectivos ícones/logos de marca quando aplicável.
