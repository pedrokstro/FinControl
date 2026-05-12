# Changelog

## [2.12.31] - 2026-05-12

### Adicionado
- **UI (IconPicker):** Implementada a **Busca Universal de Ícones**. Agora o usuário pode buscar por termos genéricos (ex: "academia", "pet", "viagem") e receber sugestões de ícones relacionados via Iconify API, além das logos de marcas oficiais.
- **Utilidades:** Adicionada camada de tradução automática para termos de busca comuns, melhorando a precisão dos resultados em bibliotecas de ícones globais.

## [2.12.30] - 2026-05-12

### Corrigido
- **UI (IconPicker):** Resolvido o problema de logos de marcas que não carregavam. O sistema agora possui um mapeamento de domínios muito mais abrangente e uma lógica de resolução inteligente para marcas desconhecidas.
- **Otimização:** Otimizado o componente `BrandIcon` para evitar requisições de arquivos locais inexistentes, eliminando os erros 404 no console do navegador e melhorando a performance de carregamento da aba de marcas.

## [2.12.29] - 2026-05-11

### Alterado
- **UI (Login):** Vídeo do logotipo agora é carregado via **GitHub Raw URL**. Esta mudança garante que o vídeo seja servido por um CDN externo estável, eliminando qualquer problema de processamento ou bloqueio de assets pelo servidor de produção (Vercel).

## [2.12.28] - 2026-05-11

### Corrigido
- **Geral:** Restaurados os assets (`logofincontrol.png` e `walletanimation.mp4`) para a pasta `public`. Esta mudança visa garantir a máxima compatibilidade com o servidor da Vercel, evitando que o bundler do Vite altere os arquivos de mídia.
- **UI (Login):** Implementado um `useEffect` para forçar a reprodução do vídeo via JavaScript, garantindo que a animação inicie corretamente em dispositivos onde o `autoPlay` nativo pode ser bloqueado ou ignorado.

## [2.12.27] - 2026-05-11

### Alterado
- **UI (Login):** Logotipo animado configurado para reprodução contínua e automática (`autoPlay`). Removida a necessidade de interação (hover) para iniciar a animação, garantindo um visual dinâmico constante na tela de login.

## [2.12.26] - 2026-05-11

### Melhorado
- **UI (Login):** Reaplicados os filtros de brilho e contraste no logotipo animado agora que o carregamento via Vercel foi estabilizado. O fundo cinza foi novamente neutralizado para garantir uma integração visual perfeita com a interface.

## [2.12.25] - 2026-05-11

### Corrigido
- **UI (Login):** Implementada uma nova estratégia de carregamento para o vídeo do logotipo utilizando o construtor `new URL(..., import.meta.url)`. Esta é a forma recomendada pelo Vite para lidar com assets que precisam de caminhos dinâmicos em produção. Além disso, os filtros de brilho/contraste foram simplificados para garantir que o vídeo seja visível em todos os navegadores após o deploy.

## [2.12.24] - 2026-05-11

### Corrigido
- **Geral:** Corrigidas as referências da logo (`logofincontrol.png`) em toda a aplicação (Sidebar, Landing Page, Registro e Login). Como o arquivo foi movido para a pasta de assets para otimização de build, todos os componentes foram atualizados para importar o recurso corretamente via Vite, garantindo que a logo seja exibida em todos os ambientes.

## [2.12.23] - 2026-05-11

### Melhorado
- **UI/Performance (Login):** Otimizado o carregamento do logotipo animado. Agora o sistema exibe inicialmente a imagem estática (PNG) e só carrega/inicia o vídeo quando o usuário passa o mouse sobre o logo. Isso reduz o consumo de dados inicial e garante que a imagem estática sirva como um fallback perfeito enquanto o vídeo é ativado sob demanda.

## [2.12.22] - 2026-05-11

### Corrigido
- **UI (Login):** Movido o vídeo `walletanimation.mp4` da pasta `public` para `src/assets`. Ao importar o vídeo como um módulo do Vite, garantimos que o bundler gere uma URL válida e rastreável durante o build, resolvendo problemas de caminhos quebrados em ambientes de produção como a Vercel.

## [2.12.21] - 2026-05-11

### Corrigido
- **UI (Login):** Refatorada a implementação do vídeo do logotipo para usar a tag `<source type="video/mp4">`. Isso aumenta a compatibilidade com diferentes navegadores e servidores de hospedagem (como a Vercel), garantindo que a animação seja carregada e reproduzida corretamente em produção.

## [2.12.20] - 2026-05-11

### Corrigido
- **UI (Login):** Refinado o ajuste do vídeo do logotipo. Foram aplicados filtros de brilho e contraste (`brightness-[1.15] contrast-[1.1]`) para "estourar" o fundo cinza do vídeo para branco puro, garantindo que a mesclagem com o fundo do card seja invisível e o logo pareça 100% transparente.

## [2.12.19] - 2026-05-11

### Corrigido
- **UI (Login):** Ajustado o vídeo do logotipo para remover o fundo cinza. Utilizada a propriedade `mix-blend-mode: multiply` para garantir que o fundo do vídeo se funda perfeitamente com o fundo branco do card, resultando em uma aparência de transparência total.

## [2.12.18] - 2026-05-11

### Adicionado
- **UI (Login):** Implementado logotipo animado em vídeo (`walletanimation.mp4`). O ícone estático foi substituído por uma animação fluida em loop, conferindo um aspecto mais dinâmico e moderno à tela de login. O vídeo está configurado para reprodução automática, sem áudio e em loop infinito.

## [2.12.17] - 2026-05-11

### Melhorado
- **UI (Login):** Atualizado o estilo dos botões "Entrar" e "Google" para o formato *pill* (totalmente arredondados), conferindo um visual mais moderno e amigável que se alinha com os novos padrões de interface do sistema.

## [2.12.16] - 2026-05-11

### Melhorado
- **UI (Login):** Refinamento da animação do logotipo. Removidas as moedas flutuantes em favor de um efeito mais sóbrio e elegante. Agora o logo apresenta um brilho radial sutil ao fundo e um efeito de "varredura de luz" (glint) que atravessa o ícone ao passar o mouse, mantendo a sofisticação da interface.

## [2.12.15] - 2026-05-11

### Melhorado
- **UI (Login):** Adicionada uma animação interativa premium ao logotipo na página de login. Agora, ao passar o mouse sobre o ícone da carteira, ele realiza um movimento 3D suave (tilt) e "dispara" moedas e cédulas flutuantes, criando um feedback visual divertido e temático relacionado ao universo financeiro.

## [2.12.14] - 2026-05-11

### Melhorado
- **UX Mobile (Modais):** Removido o botão de fechar (X) em modais estilo bottom-sheet no mobile. Como esses modais já possuem a alça visual (handle) e suporte a deslizar para fechar, a remoção do botão libera espaço e limpa a interface, seguindo padrões modernos de design mobile.

## [2.12.13] - 2026-05-11

### Corrigido
- **Limpeza de Código:** Removidos ícones e variáveis não utilizados em `Transactions.tsx` para otimização e redução de avisos do compilador.

## [2.12.12] - 2026-05-11

### Adicionado
- **Categorias (Logos de Marcas):** Implementada a funcionalidade de utilizar logotipos reais de marcas (Netflix, Spotify, iFood, etc.) como ícones de categoria.
- **IconPicker:** Adicionada a aba "Marcas" no seletor de ícones, permitindo buscar e visualizar logos automaticamente através de integração com bancos de imagens (Logo.dev, Google, Simple Icons).
- **Componente CategoryIcon:** Agora suporta renderização dinâmica de logos de marcas via prefixo `brand:`.

## [2.12.11] - 2026-05-11

### Melhorado
- **UI (Modal de Transação):** Redesign completo dos seletores de tipo (Receita/Despesa). Agora utilizam bordas arredondadas (2xl), ícones em círculos coloridos, tipografia em negrito e efeitos visuais de sombra e escala ao selecionar, proporcionando uma experiência mais premium e tátil.

## [2.12.9] - 2026-05-11

### Melhorado
- **Layout Mobile (Transações):** Reorganizados os cards de KPI para melhor visibilidade. O card de "Saldo do Mês" agora aparece no topo com largura total, enquanto os cards de "Lançamentos", "Receitas" e "Despesas" ficam alinhados em uma única linha (grid de 3 colunas) com design ultra-compacto.

## [2.12.8] - 2026-05-11

### Melhorado
- **UX (Limite de Plano):** O banner estático de limite de transações foi transformado em uma notificação flutuante (estilo Toast/FAB) mais discreta e moderna. 
- **Interatividade:** Adicionado botão para fechar o aviso e animações suaves com Framer Motion. O aviso agora aparece de forma flutuante sobre o conteúdo, otimizando o espaço das páginas.

## [2.12.6] - 2026-05-11

### Corrigido
- **TypeScript:** Corrigido erro de tipagem implícita no evento de alteração do checkbox de recorrência na página de Transações.

## [2.12.5] - 2026-05-11

### Corrigido
- **Consistência de Saldo:** Corrigida inconsistência onde despesas no cartão de crédito não eram descontadas do saldo mensal na página de Transações, embora fossem no Dashboard. Agora ambas as páginas refletem o mesmo resultado mensal (Receitas - Despesas totais).

## [2.12.3] - 2026-05-11

### Melhorado
- **Responsividade (Mobile):** Aplicados os mesmos ajustes de otimização de espaço (padding e fontes reduzidas) nos cards do Dashboard, garantindo consistência visual em todo o app.

## [2.12.2] - 2026-05-11

### Melhorado
- **Responsividade (Mobile):** Ajustados os cards de KPI na página de Transações para evitar quebras em telas pequenas.
- **Otimização de Layout:** Card de Saldo agora ocupa a largura total (2 colunas) em mobile, enquanto os demais cards tiveram padding, tamanhos de ícones e fontes reduzidos proporcionalmente para garantir que os valores fiquem visíveis.

## [2.12.0] - 2026-05-11

### Melhorado
- **Página de Transações:** Redesenho completo com cabeçalho compacto e cards premium (Receitas, Despesas, Saldo).
- **Consistência Visual:** Página de transações agora segue o mesmo padrão estético moderno do dashboard.

### Corrigido
- **Página de Transações:** Corrigido crash causado por importações faltantes de ícones (`ArrowUpRight`, `ArrowDownRight`).

## [2.11.8] - 2026-05-11

### Melhorado
- **Página de Transações:** Redesenho completo do cabeçalho e dos cards de resumo.
- **Navegação de Mês:** Integrada ao cabeçalho para melhor aproveitamento de espaço.
- **Cards de Resumo:** Aplicado o estilo "premium" com gradientes, barras de progresso e ícones destacados.

## [2.11.7] - 2026-05-11

### Melhorado
- **Cards de KPI:** Redesenho premium com barra de cor no topo (verde/vermelho), ícone com anel sutil e layout label → valor → info.
- **Header Dropdown:** Removido o atalho de "Configurações" do menu do perfil, deixando apenas "Sair".

## [2.11.6] - 2026-05-11

### Melhorado
- **Dashboard UI:** Redesenho do topo do painel — navegação de mês integrada ao header em um seletor compacto e elegante.
- **Dashboard UI:** Removidos os cards redundantes de data/hora e atalhos de teclado, liberando espaço para o conteúdo.
- **Cards de KPI:** Enriquecidos com contagem de lançamentos, atalho "Ver detalhes" e barra de progresso de gasto vs. receita no card de saldo.

## [2.11.5] - 2026-05-11

### Adicionado
- **Transações Recorrentes Fixas:** Agora é possível criar transações sem limite de parcelas (tempo indeterminado) ao deixar o campo de parcelas vazio. A recorrência continuará até que a transação pai seja removida ou a recorrência cancelada.

## [2.11.4] - 2026-05-08

### Corrigido
- **Build/Vercel:** Correção de erro de aninhamento JSX no componente de Configurações que impedia o deploy.

## [2.11.3] - 2026-05-08

### Alterado
- **UI de Recuperação:** Remoção da logo redundante na página de esqueci a senha para um visual mais limpo focado na ação.

## [2.11.2] - 2026-05-08

### Corrigido
- **Especificação WebAuthn:** Removida propriedade `userVerification` do nível incorreto nas opções de criação de credencial.

## [2.11.1] - 2026-05-08

### Corrigido
- **Tipagem WebAuthn:** Correção de erros de TypeScript no componente de bloqueio biométrico.
- **Limpeza de Código:** Remoção de imports não utilizados.

## [2.11.0] - 2026-05-08

All notable changes to this project will be documented in this file.

## [2.10.5] - 2024-05-08

### Corrigido
- Layout dos **Cartões**: Ajustada a responsividade para evitar que o conteúdo fique "espremido" no mobile.
- Otimização de espaço: Reduzido o padding lateral e implementado layout em coluna para as datas de fechamento/vencimento em telas pequenas.
- Tipografia dinâmica: O valor da fatura agora ajusta o tamanho automaticamente para evitar quebras em telas menores.

## [2.10.4] - 2024-05-08

### Corrigido
- Legibilidade da **MobileNavBar**: Aumentada a opacidade do fundo (de 10% para 90%) e o desfoque de fundo para evitar interferência visual com o conteúdo em scroll.
- Contraste do menu **Ações Rápidas**: Ajustadas as cores de texto e ícones para garantir leitura clara em qualquer condição de iluminação e fundo.
- Definição visual: Adicionada borda mais nítida e sombra profunda na barra de navegação mobile.

## [2.10.3] - 2024-05-08

### Adicionado
- Sistema de **Cascata de Resolução (Fallback)** para ícones: Local ⮕ Simple Icons ⮕ Logo.dev ⮕ Google Favicon.
- Garantia de que todos os bancos brasileiros e marcas globais tenham ícones representativos.
- Lógica de tratamento de erro para percorrer todas as APIs disponíveis antes de ocultar o ícone.

## [2.10.2] - 2024-05-08

### Adicionado
- Integração com a API **Logo.dev** para resolução automática de logotipos de bancos e bandeiras.
- Novo utilitário `brandUtils.ts` para mapeamento inteligente de nomes para domínios.
- Suporte a centenas de bancos brasileiros e marcas globais sem necessidade de download manual de imagens.
- Fallback automático para o Google Favicon API caso o domínio não seja encontrado no Logo.dev.

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
