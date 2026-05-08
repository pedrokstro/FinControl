# Changelog

All notable changes to this project will be documented in this file.

## [2.10.1] - 2024-05-08

### Corrigido
- Exibição dos ícones de bandeira (Mastercard, Visa, etc.) nos cartões. Removido o filtro que forçava a cor branca, permitindo a visualização das cores originais das marcas.
- Mapeamento de ícones agora é *case-insensitive*, garantindo que o ícone correto seja carregado independente de como o nome foi digitado (ex: Mastercard vs mastercard).
- Melhoria no contraste do container de ícones dos cartões com fundo neutro.

## [2.10.0] - 2024-05-08

### Adicionado
- Novo componente `CustomMonthPicker` com suporte a *bottom sheet* e design premium.
- Filtro por Categoria na página de Relatórios para análise granular.
- Filtro por Tipo (Receita/Despesa) na página de Relatórios.
- Botão "Limpar Filtros" para reset rápido da visualização.

### Alterado
- Substituição de inputs nativos de data e mês por `CustomDatePicker` e `CustomMonthPicker`.
- Redesign completo da seção de filtros em Relatórios para melhor UX mobile.
- Refinamento do indicador de transações encontradas com animação de pulso.

## [2.9.11] - 2026-05-08

### Corrigido
- **Tipagem no Cards.tsx**: Resolvido erro onde o componente de ícone `CreditCard` era usado como tipo em vez do tipo `CreditCardType`.
- **Importações**: Removida importação redundante do ícone `CreditCard`.

## [2.9.10] - 2026-05-08

### Alterado
- **Padronização de UI**: Remoção global do efeito de "levantar" (`hover:translate-y`) nos cards e botões em todo o site.
- **Limpeza de Estilo**: Centralização do comportamento estático no `index.css` e remoção de animações de escala individuais em `Cards`, `Admin`, `Landing`, `Plans` e `Login`.

## [2.9.9] - 2026-05-08

### Added
- Conclusão da **Fase 3: Detalhes e Gestão Avançada** na página de Cartões.
- Novo sistema de **Cards Expansíveis**: agora é possível ver a lista completa de assinaturas vinculadas a cada cartão diretamente na tela de gestão.
- Sincronização inteligente de dados: as assinaturas são agrupadas por descrição para mostrar apenas os valores mais recentes e evitar duplicidade histórica.
- Refinamento das **Quick Actions**: botões de edição e exclusão com micro-interações aprimoradas.
- Melhoria no sistema de **Haptics** (feedback táctil) ao expandir/recolher detalhes dos cartões.

### Changed
- Atualização da versão do sistema para 2.9.9.


## [2.9.8] - 2026-05-08

### Added
- Implementação da **Fase 2: Redesign Visual (Premium UI)** na página de Cartões.
- Novo layout "Card-First" com **gradientes inteligentes** baseados na bandeira do cartão (Visa, Master, Nubank, Inter, etc).
- Efeitos de **Glassmorphism** com desfoque de fundo e bordas translúcidas para uma estética premium.
- Animações fluidas com `framer-motion` em toda a listagem, incluindo efeitos de hover e entrada suave dos cards.
- Refinamento das barras de progresso de uso do limite com efeitos de gradiente e sombras.

### Changed
- Atualização da versão do sistema para 2.9.8.


## [2.9.7] - 2026-05-08

### Added
- Implementação da **Fase 1: Inteligência de Fatura** na página de Cartões.
- Adicionado **Breakdown de Gastos** por cartão, separando visualmente Assinaturas (Recorrentes) de Gastos Eventuais com porcentagens.
- Implementado **Alerta de Proximidade de Vencimento**, com labels dinâmicos ("Vence Hoje", "Vence em X dias", "Vencido").
- Adicionada **Projeção de Próxima Fatura**, que calcula automaticamente o valor estimado para o próximo mês com base nas assinaturas vinculadas ao cartão.

### Changed
- Atualização da versão do sistema para 2.9.7.


## [2.9.6] - 2026-05-08

### Added
- Implementado o **Painel de Gerenciamento Integrado** (Fase 3) para Assinaturas/Transações Recorrentes.
- Adicionados **Quick Actions** (Ações rápidas) na lista de assinaturas para "Editar" e "Remover", visíveis ao passar o mouse ou nativos em dispositivos mobile.
- Modal Bottom Sheet aprimorado para suportar **Modo de Edição**, permitindo alterar Valor, Categoria e Frequência sem sair da página atual.
- Conexão nativa com a store `useFinancialStore` (`updateTransaction` e cancelar recorrência), atualizando o estado e a UI em tempo real para os usuários.
- Sincronização e envio de notificação (Toast) garantindo a experiência e integridade dos dados (Evitando a dessincronização).

### Changed
- Atualização da versão do sistema para 2.9.6, marcando a conclusão da Fase 3 do plano de Gestão de Assinaturas.

## [2.9.5] - 2026-05-08

### Added
- Implementada **Análise de Frequência** inteligente na tela de Assinaturas, calculando automaticamente se a cobrança é mensal, semanal, trimestral ou anual com base no histórico de transações.
- Adicionado **Alerta de Aumento de Preço** (ícone `TrendingUp`), que identifica automaticamente quando o valor atual de uma assinatura é superior à cobrança anterior, exibindo o aviso no card principal e no Bottom Sheet de Detalhes.
- O Bottom Sheet de Detalhes da Assinatura agora projeta corretamente o **Custo Anual Projetado** usando a nova lógica de frequência.

### Changed
- Atualização da versão do sistema para 2.9.5, em conformidade com as regras globais de registro de modificações.

## [2.9.4] - 2026-05-08

### Added
- Implementado o **Gráfico Donut de Descoberta Visual** na página de Assinaturas (`Subscriptions.tsx`).
- O gráfico cruza de forma inteligente a renda do mês atual, o total gasto em assinaturas e o montante utilizado em outras despesas para mostrar de forma exata a porcentagem do seu orçamento mensal "devorado" pelas assinaturas.
- Utilizou a biblioteca `recharts` (PieChart) com Tooltip e personalização para manter o visual limpo (Glassmorphism e fintech vibes).

### Changed
- O layout do cabeçalho de Resumo da página de assinaturas foi ajustado para suportar três colunas lado-a-lado no desktop, colocando os cards ao lado do novo gráfico.
- Versão atualizada para 2.9.4 em conformidade com as regras globais de registro de modificações.

## [2.9.3] - 2026-05-08

### Added
- Remodelagem da visualização de Transações Recorrentes (Assinaturas).
- Implementação de um painel de detalhes expansível usando Bottom Sheet (`Modal.tsx`) projetado para se ajustar perfeitamente em telas mobile.
- O card da assinatura agora apresenta uma barra de progresso horizontal mostrando qual percentual do total a assinatura específica ocupa no seu orçamento mensal recorrente.

### Changed
- Substituição da apresentação em Grid/Cards da tela `Subscriptions.tsx` para uma estrutura limpa de lista focada em UI premium e compatibilidade sem quebras para usuários já existentes.
- Atualização da versão do sistema de 2.9.2 para 2.9.3.

## [2.9.2] - 2026-05-08

### Added
- Gráfico moderno de Evolução do Saldo Acumulado adicionado no início da página de relatórios (`Reports.tsx`).
- O gráfico conta com visualização em `AreaChart` da biblioteca Recharts com um gradiente (azul primário), exibindo a flutuação do saldo real ao longo do período selecionado.
- Adicionadas importações necessárias do `date-fns` para lidar com a diferença entre dias e calcular o saldo acumulado histórico (`eachDayOfInterval`, `startOfDay`, `endOfDay`).

### Changed
- Melhoria visual e estrutural na página de Relatórios (`Reports.tsx`), aprimorando o visual inicial que antes era considerado muito simples.
- Atualização da versão do projeto para 2.9.2 em `package.json` e no badge do `README.md`.
