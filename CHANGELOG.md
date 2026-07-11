# Changelog

## [2.14.1] - 2026-07-11

### Alterado
- **Design de Categorias (List View):**
  - Alinhado o estilo visual da lista de categorias ao padrão premium adotado na tabela de transações.
  - Adicionado o **Indicador de Tipo Lateral**: uma barra fina vertical reativa à esquerda de cada categoria (Verde para Receitas, Vermelho para Despesas) que cresce e alonga ao passar o mouse.
  - Implementada a micro-interação de translação horizontal da linha no hover (`group-hover:translate-x-1`), mantendo o indicador de tipo alinhado à borda.
  - Substituídos os botões de ação padrão por botões circulares interativos (`w-8.5 h-8.5`) com efeitos de escala física e cores semânticas.
  - Integradas as animações do Framer Motion (`containerVariants` e `itemVariants`) para revelar a lista em cascata (stagger) de forma suave.

## [2.14.0] - 2026-07-09

### Adicionado
- **Especificações Mobile (Android Native):**
  - Criado o arquivo [MOBILE_CONTEXT_PRD.md](file:///f:/CURSOR/fincontrol/MOBILE%20APPLICATION/MOBILE_CONTEXT_PRD.md) na pasta `MOBILE APPLICATION`.
  - Documentação contendo PRD completo, mapeamento de banco de dados (SQLite/Room e PostgreSQL/Supabase), fluxos e endpoints da API REST do backend, guia visual e paleta de cores baseadas no Material Design 3, mecânicas de movimento e gestos táticos para transações e carrossel Nubank.
  - Adicionado um **Prompt Mestre** e um **Plano de Implementação estruturado** para o Gemini / engenheiro Android construir o cliente Android offline-first utilizando Kotlin e Jetpack Compose.

## [2.13.1] - 2026-07-09

### Alterado
- **Transações Mobile (Mecânica de Swipe Premium):**
  - Removida a propriedade `dragSnapToOrigin` que forçava o fechamento automático instantâneo do card e impossibilitava o clique nos botões de ação.
  - Implementada a mecânica de **snap magnético**: ao arrastar mais de 30px para a esquerda, o card "trava" aberto na distância adequada dos botões (`maxDrag` ajustado para -112px ou -232px dependendo se há recorrência).
  - Implementado **auto-fechamento inteligente**: se o usuário clicar ou tocar (`onTap`) em cima do card que está aberto, ele se fecha suavemente.
  - Adicionado suporte a **fechamento por exclusão de foco**: ao arrastar ou abrir qualquer outra transação da lista, a anterior se fecha de forma automática, garantindo que apenas um card fique aberto por vez.

## [2.13.0] - 2026-07-09

### Corrigido
- **Dashboard Mobile (Cabeçalho Full-bleed):**
  - Adicionada a classe `!mt-0` no wrapper do cabeçalho mobile do saldo para anular o `margin-top` indesejado criado pelo container `.responsive-page` (`space-y-6`).
  - Separado o preenchimento de `p-4` do `main` em `MainLayout.tsx` para `px-4 pb-28 pt-0`, eliminando por completo a faixa branca no topo acima do fundo azul do saldo.
- **Transações Mobile (Scroll Limpo):**
  - Desmembrado o card branco envolvente geral das transações: no mobile, cada grupo de dia agora renderiza em seu próprio card arredondado independente (`bg-white` e `border border-gray-200/50`), sem esticar um fundo branco fixo até o final da página.
  - Removido o preenchimento `pb-28` interno das transações mobile que esticava o card de fundo, permitindo que a lista termine exatamente no último elemento e a área de rolagem posterior revele o fundo cinza transparente natural da página.

## [2.12.99] - 2026-07-08

### Alterado
- **Transações Mobile (Redesign Nubank-inspired):**
  - Adicionado título compacto "Transações" exclusivo no mobile (`sm:hidden`), seguindo o padrão de identificação de página do Dashboard.
  - Lista mobile completamente redesenhada com **agrupamento por data**: cabeçalhos "Hoje", "Ontem" e "dd de MMM" com divisor horizontal sutil entre grupos de dias.
  - Novo card estilo Nubank: **ícone circular de categoria** com fundo colorido translucente, descrição em fonte semi-negrita, subcategoria e tags em texto menor, valor em verde/vermelho sem label "VALOR" redundante.
  - Swipe corrigido: removido fundo vermelho `bg-red-50/20` do container, adicionado `dragSnapToOrigin` para retorno automático ao largar no meio do gesto, botsões de ação menores e mais limpos (`w-9 h-9`).
  - Scroll suave `window.scrollTo({ top: 0 })` ao navegar entre meses.
  - Empty state redesenhado com ícone em círculo, título bold e botão CTA "Adicionar transação" que abre o modal diretamente.

## [2.12.98] - 2026-07-08

### Alterado
- **Transações Mobile (UX Adaptado):**
  - Adicionado FAB (Floating Action Button) circular azul fixo no canto inferior direito, exclusivo para mobile, substituindo o botão empilhado de "Nova Transação" no cabeçalho.
  - Botão "Nova Transação" no header preservado apenas no desktop (`hidden sm:flex`).
  - Navegação de mês compactada no mobile: botões `<` e `>` com tamanho fixo `w-8 h-8`, texto do mês abreviado (`MMM yyyy`) e pill "Hoje" reduzida para `text-[10px]`.
  - Adicionado botão de filtro `SlidersHorizontal` no header mobile que ativa/desativa o painel de busca e filtros via toggle com indicador visual azul quando filtros estão ativos.
  - Painel de filtros oculto por padrão no mobile (`hidden sm:block`), exibido apenas ao clicar no botão de filtro.

## [2.12.97] - 2026-07-08

### Adicionado
- **Admin (Gerenciamento Dinâmico de Cards do Dashboard):**
  - Criada a tabela `public.dashboard_cards` no Supabase com proteção RLS e popularizada com dados padrão.
  - Implementadas rotas públicas (`GET /dashboard/cards`) e de administração (`GET`, `POST`, `PUT`, `DELETE` em `/admin/dashboard-cards`) para gerenciamento completo em tempo real.
  - Adicionada a aba de controle de cards no [Admin.tsx](file:///f:/CURSOR/fincontrol/src/pages/Admin.tsx) com listagem interativa, exclusão física e formulário de cadastro/edição com suporte a presets de estilos (Azul, Destaque, Vermelho, Padrão) e envio de imagens.
  - Conectada a exibição do carrossel no [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx) ao banco de dados utilizando resolvedor de ícones dinâmicos do Lucide.

## [2.12.96] - 2026-07-08

### Alterado
- **Dashboard (Flexibilidade de Mídia nos Cards de Aviso):**
  - Refatorada a renderização dos cards do carrossel em [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx) para suportar tanto ícones do Lucide (propriedade `icon`) quanto imagens personalizadas PNG/JPG (propriedade `imageSrc`), permitindo total flexibilidade na exibição de informativos visuais ricos.

## [2.12.95] - 2026-07-08

### Alterado
- **Footer (Redesenho Compacto Mobile):**
  - Refatorado o rodapé da aplicação em [Footer.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/Footer.tsx) para dividir a renderização entre Desktop (layout institucional completo de colunas) e Mobile (minimalista).
  - No mobile, ocultamos toda a estrutura vertical extensa de branding e blocos de links, substituindo-a por um rodapé super compacto de linha única que acomoda o logo mini com versão, quatro links inline (`Planos`, `Ajuda`, `Privacidade`, `Termos`), ícones de contato em uma pílula central e copyright simplificado.

## [2.12.94] - 2026-07-08

### Adicionado
- **Dashboard (Carrossel de Avisos & Notificações - Estilo Nubank):**
  - Adicionado um carrossel horizontal flutuante de avisos e notificações logo abaixo do banner de limite.
  - Implementado três cartões ricos responsivos (`w-[250px] sm:w-[270px]`):
    - **Segurança ativa**: Dicas de prevenção de fraude por telefone (direciona para `/app/settings`).
    - **Fatura do Cartão**: Alerta dinâmico de faturas de cartão de crédito pendentes em azul sólido (direciona para `/app/cards`).
    - **Suporte FinControl**: Canal de relacionamento e chat de suporte oficial (direciona para `/app/support`).
  - Utilizado o alinhamento de grade de safira do Tailwind CSS para manter rolagem lateral suave e design consistente no mobile e desktop.

## [2.12.93] - 2026-07-08

### Alterado
- **Dashboard (Alinhamento de UI/UX do Modal QuickAdd):**
  - Refatorado o modal de Nova Transação rápida (`showQuickAdd`) no [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx) para adotar integralmente o padrão **FinTech UX** estabelecido na página de lançamentos.
  - Adicionado o visor de valor gigante e focado com tipografia Outfit extra-negrito (`text-4xl`).
  - Implementado os cards de tipo de lançamento semânticos (Receita/Despesa) táteis baseados em seletor `has-[:checked]` do Tailwind CSS.
  - Adicionado suporte a seleção de Cartões de Crédito com renderização de bandeiras (`BrandIcon`) no formulário rápido.
  - Atualizado o card de recorrência para utilizar o toggle switch personalizado com a animação de mola física (`framer-motion`) de expansão.

## [2.12.92] - 2026-07-08

### Corrigido
- **UX (Abertura Instantânea do Modal de Nova Transação):**
  - Alterado o evento de clique do atalho móvel "Nova Trans." no [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx) para chamar diretamente a função nativa `openQuickAdd('expense')` em vez de efetuar uma transição de página para `/app/transactions?add=true`. Isso evita o flash/piscada de tela da mudança de rota e exibe o modal/bottom sheet instantaneamente na mesma tela.

## [2.12.91] - 2026-07-08

### Alterado
- **Layout (Remoção Total da Faixa Branca no Mobile):**
  - Implementado o ajuste condicional de preenchimento (`pt-0`) no contêiner `<main>` do [MainLayout.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/MainLayout.tsx) especificamente para a rota `/app/dashboard`. Isso permite que o card azul de saldo suba completamente até a borda física da tela (notch do smartphone), cobrindo totalmente a antiga faixa branca.
  - Removido o deslocamento por margem negativa superior (`-mt`) em [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx) e ajustado o padding superior do cabeçalho móvel para `pt-[calc(2rem+env(safe-area-inset-top))]`, posicionando os controles perfeitamente abaixo da barra de status.

## [2.12.90] - 2026-07-08

### Alterado
- **Dashboard (Ajustes de Layout Mobile & Estilo Sólido):**
  - O card de "Saldo do Mês" na versão mobile do dashboard agora se estende por toda a largura horizontal da tela (`-mx-4 rounded-none -mt-[...]`) e utiliza a mesma cor azul sólida oficial (`bg-primary-600`) adotada na página de transações, removendo as ondas decorativas.
  - O card de "Meta de Economia" agora fica oculto na versão mobile (através da classe `hidden sm:block`) para otimização de espaço e foco visual.
- **Dashboard (Ajuste do Botão de Notificações):**
  - Corrigido o conflito de nomenclatura no import de `Calculator` da biblioteca `lucide-react` (importado agora como `CalculatorIcon`), resolvendo o bug onde o componente inteiro da calculadora era renderizado dentro do botão circular e quebrava/sobrepunha o botão de notificações vizinho.

## [2.12.89] - 2026-07-08

### Corrigido
- **Tabela de Transações (Contraste no Modo Escuro):**
  - Ajustadas as classes de cor de texto das categorias, receitas e despesas no modo escuro (`dark:text-neutral-300`, `dark:text-success-300` e `dark:text-danger-300`), corrigindo a aplicação de classes inexistentes que deixavam os textos quase pretos (invisíveis) sobre o fundo escuro da tabela.
- **Estilo (Remoção de Animações de Setas):**
  - Desativada a propriedade de animação das classes `.animate-arrow-up` e `.animate-arrow-down` em `src/index.css`, tornando os ícones de setas de Receita/Despesa estáticos de forma a simplificar o visual e reduzir distrações na interface.

## [2.12.88] - 2026-07-08

### Alterado
- **Página de Transações (Solid Balance Card):**
  - Removido o gradiente de fundo do card de "Saldo do Mês", alterando-o para a cor azul sólida oficial do FinControl (`bg-primary-600`), garantindo sobriedade visual e consistência com os demais cards de resumo da interface.

## [2.12.87] - 2026-07-08

### Corrigido
- **Componente de Calendário (CustomDatePicker - Portal & AnimatePresence Fix):**
  - Resolvida a inconsistência de abertura invertendo a estrutura do React Portal e do `AnimatePresence`. O Portal agora é renderizado de forma contínua com verificação de montagem (`mounted`), enquanto o `<AnimatePresence>` reside dentro dele. Isso permite que o Framer Motion gerencie as animações de entrada e saída corretamente sem quebrar o ciclo de renderização.
  - Aplicada máscara de opacidade reativa para ocultar o calendário no primeiro frame do desktop, prevenindo layout flash antes do cálculo das coordenadas de origem.

## [2.12.86] - 2026-07-08

### Alterado
- **Navegação de Configurações (Symmetrical Stretched Tabs):**
  - Refatoradas as abas de configurações para ocupar `flex-1` proporcionalmente de forma simétrica dentro de um contêiner de largura máxima `max-w-3xl`. Isso estica o layout horizontalmente de forma uniforme, garantindo que todas as abas tenham exatamente a mesma largura e que o indicador de seleção ("pill") mantenha uma proporção perfeita e uniforme ao deslizar elastiamente.

## [2.12.85] - 2026-07-08

### Alterado
- **Navegação de Configurações (Solid Brand Color & Increased Padding):**
  - Ajustado o estilo da pill ativa das abas para usar a cor azul sólida oficial do FinControl (`bg-primary-600` em light mode e `bg-primary-500` em dark mode) com texto e ícone brancos.
  - Aumentado significativamente o padding horizontal de cada botão para `px-5.5` e espaçamento geral, eliminando a sensação de aperto e conferindo ampla legibilidade e respiro à navegação.

## [2.12.84] - 2026-07-08

### Alterado
- **Navegação de Configurações (High Contrast Pills Navigation):**
  - Ajustado o estilo da pill ativa nas abas de configurações para utilizar o gradiente oficial `from-primary-600 via-primary-500 to-indigo-600` e cor de texto inteiramente branca (`text-white`), garantindo excelente contraste e tornando a animação de mola física (`layoutId`) extremamente nítida e visível tanto em modo claro quanto escuro.
  - Escurecido sutilmente o plano de fundo do contêiner das abas para aumentar a profundidade visual e o relevo do indicador móvel.

## [2.12.83] - 2026-07-08

### Corrigido
- **Componente de Calendário (CustomDatePicker - Click Outside Portal):**
  - Corrigido o fechamento imediato do calendário renderizado via Portal. Adicionada a referência `popoverRef` no contêiner do calendário para validar cliques de forma combinada com o `containerRef` do input, evitando que cliques de abertura ou interações na grade de dias fechem o date picker incorretamente.

## [2.12.82] - 2026-07-08

### Alterado
- **Navegação de Configurações (Settings Tabs Layout):**
  - Implementada animação de transição física de mola elástica (`spring`) usando o seletor `layoutId="activeSettingsTab"` do Framer Motion. O fundo branco/escuro da aba ativa viaja suavemente entre os botões ao alternar de aba, conferindo um acabamento tátil sofisticado ao painel.
  - Otimizada a renderização e o empilhamento das camadas (`z-index`) para garantir legibilidade perfeita durante o movimento.

## [2.12.81] - 2026-07-08

### Corrigido
- **Componente de Calendário (CustomDatePicker):**
  - Implementada a renderização do popover do calendário via React Portals (`createPortal`) montada diretamente no `document.body` e com posicionamento dinâmico e absoluto via `getBoundingClientRect()`. Isso impede que o calendário seja cortado por modais, barras de rolagem ou contêineres que possuem propriedades `overflow-hidden` ou `overflow-y-auto`.
  - Adicionados cálculos automáticos de posição, mantendo o calendário perfeitamente alinhado à borda direita do campo de entrada no desktop e permitindo que flutue por cima de cabeçalhos fixos e rodapés.
  - Corrigido o bug do calendário na Calculadora de Juros Compostos ao remover a classe `overflow-hidden` do contêiner de entrada da Data de Início, permitindo que a seleção ocorra perfeitamente.
  - Implementada sincronização de escopo de redimensionamento e escuta de scroll para que a caixa do calendário acompanhe o campo de origem mesmo durante interações de tela.

## [2.12.80] - 2026-07-08

### Alterado
- **Modal de Nova/Editar Categoria (Renovação de UX/UI):**
  - Substituído o seletor clássico de dropdown por cartões de tipo (Receita/Despesa) táteis de escala elástica com feedback de clique e bordas brilhantes semânticas.
  - Redesenhada a caixa de visualização em tempo real (Preview) com bordas finas sólidas e uma faixa vertical luminosa na direita que assume de forma reativa a cor hexadecimal escolhida.
  - Padronizados todos os rótulos (labels) com a tipografia Outfit em formato de mini-cabeçalho uppercase.

## [2.12.79] - 2026-07-08

### Otimizado
- **Roteamento e Performance de Navegação:**
  - Removido `key={location.pathname}` do elemento `<Routes>` em `App.tsx` para evitar que todo o contêiner do layout global (`MainLayout` que inclui a `Sidebar`, `Header` e verificações de autenticação) seja desmontado e remontado ao alternar de rota.
  - Eliminado o invólucro `<AnimatePresence mode="wait">` do roteador global. Isso remove a latência artificial de `350ms` de espera pelo término da animação de saída de cada página, tornando a navegação instantânea e poupando ciclos de CPU.
  - Mantidas as animações individuais de entrada suave (`PageTransition`) em cada página para transições elegantes e sem travamentos.
  - Limpos os imports obsoletos de `useLocation` e `AnimatePresence` em `App.tsx`.

## [2.12.78] - 2026-07-08

### Alterado
- **Modal de Criação/Edição de Transações (Renovação de UX/UI):**
  - Implementado display de valor centralizado ampliado ("FinTech style") com prefixo BRL ("R$") em tipografia Outfit extra-negrito.
  - Redesenhados os seletores de tipo de lançamento (Receita/Despesa) com micro-interações de foco e bordas ativas translúcidas com cores semânticas corretas.
  - Agrupados os campos secundários (Data e Cartão de Crédito) em um grid de duas colunas responsivas para reduzir a altura total do modal e a carga cognitiva.
  - Criado card interativo contendo interruptor deslizante (Toggle Switch) estilizado para ativar transações recorrentes.
  - Adicionada animação de expansão suave com mola do Framer Motion para as opções e frequências de recorrência.
  - Padronizadas as etiquetas (labels) em formato de mini-cabeçalho uppercase usando a fonte Outfit.

## [2.12.77] - 2026-07-08

### Alterado
- **Página e Tabela de Transações (Renovação de UI/UX & Integração de Sidebar):**
  - Implementado efeito stagger (entrada em cascata) via Framer Motion para as linhas da tabela e cartões mobile.
  - Inserido indicador de tipo vertical no lado esquerdo de cada linha/card (Verde com brilho para Receitas, Vermelho com brilho para Despesas), herdando o design do indicador da Sidebar.
  - Adicionadas micro-interações como animação de crescimento em hover no indicador lateral, translate-x na linha sob hover, e escala reativa nos botões de ação (`active:scale-90` / `hover:scale-115`).
  - Redesenhados botões de ação para ícones circulares sutis que se destacam com cor contextual no hover.
  - Alinhada a tipografia utilizando Outfit para títulos/cabeçalhos e Inter para corpo e dados.
  - Padronizados os fundos e bordas com a identidade sólida-reta do Header e Sidebar.

## [2.12.76] - 2026-07-08

### Corrigido
- **Processamento de Recorrências (Backend):**
  - Corrigido bug em [recurrence.service.ts](file:///f:/CURSOR/fincontrol/backend/src/services/recurrence.service.ts) onde a verificação de data de fim de recorrência (`recurrenceEndDate`) comparava erroneamente a data atual de execução (`now`) ao invés da data do evento programado (`nextOccurrence`). Esta falha causava o encerramento precoce da recorrência se o job rodasse no dia final, impossibilitando a geração da última parcela (ex: parcela 7/7).

## [2.12.75] - 2026-07-07

### Adicionado
- **Landing Page (Animações de Scroll & Branding):**
  - Implementado o Cartão de Crédito 3D premium estilizado com o branding oficial do FinControl (gradiente Azul Confiança profundo a Indigo, chip metálico, logo e tipografia `Outfit`/`Inter`).
  - Desenvolvidas animações de scroll link do cartão 3D, fazendo-o flutuar no Hero e rotacionar no eixo Z/transladar verticalmente até preencher o centro do grid de recursos na seção seguinte.
  - Implementada reestruturação em 3 colunas responsivas para a seção de recursos ("A escolha estratégica"), reservando o meio para aterrissagem visual do cartão no desktop e otimizando layout limpo no mobile.
  - Aplicados efeitos de surgimento progressivo (scroll reveal) com fade-in e slide-up suave em todas as seções (Features, Preview, Planos, Benefícios e CTA).
  - Adicionado suporte a `prefers-reduced-motion` no React para desabilitar translações físicas complexas e manter apenas fades simples para acessibilidade.

## [2.12.74] - 2026-07-07

### Alterado
- **Dashboard (UX/UI Mobile):**
  - Implementado novo header premium para a versão mobile em [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx).
  - Integrada a navegação mensal diretamente no cabeçalho do card superior no mobile, otimizando o espaço vertical.
  - Adicionado atalhos rápidos com botões flutuantes para incluir receitas e despesas no celular.
  - Adicionado indicador visual de tendência (pílula) comparativo com o saldo do mês anterior.
  - Dividida a renderização do saldo exibindo centavos menores em alinhamento superior para visual sofisticado.

## [2.12.73] - 2026-07-07

### Corrigido
- **Dashboard (Bugfix TS):**
  - Corrigido erro de tipagem reportado pelo TypeScript no componente `CategoryIcon` na página de [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx). A propriedade `size` recebeu o valor adequado (`sm`) em vez do incorreto (`xs`).

## [2.12.72] - 2026-07-07

### Corrigido
- **Dashboard (Bugfix):**
  - Corrigido erro de runtime `ReferenceError: Cannot access 'w' before initialization` causado pela ordem de declaração da constante `topExpensesCurrentMonth` em [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx).
  - A constante foi movida para baixo da declaração de `financialSummary`, resolvendo a referência temporal e estabilizando o carregamento inicial da página.

## [2.12.71] - 2026-07-07

### Alterado
- **Configurações (UX/UI):**
  - Refatorada a interface visual da página de [Settings.tsx](file:///f:/CURSOR/fincontrol/src/pages/Settings.tsx) com design moderno, limpo e profissional.
  - Abas de navegação desktop estilizadas no formato de pílulas flutuantes com fundos e bordas leves em hover/active.
  - Menu de opções mobile (estilo Telegram) redesenhado com avatares e contêineres arredondados `rounded-2xl`, além de ícones envoltos em fundos desbotados de cores correspondentes à identidade visual da Sidebar.
  - Formulários e cards das abas de Perfil, Segurança, Notificações e Preferências atualizados para contêineres modernos com acentos superiores em gradiente e inputs limpos e bem-espaçados.

## [2.12.70] - 2026-07-07

### Alterado
- **Configuração (Agente):**
  - Regra de comportamento do agente no arquivo [AGENTS.md](file:///f:/CURSOR/fincontrol/.agents/AGENTS.md) foi expandida e endurecida.
  - O agente está terminantemente proibido de enviar quaisquer blocos de código (completo, trechos de refatoração, exemplos ou correções) no chat, devendo realizar as correções diretamente nos arquivos e explicar conceitos teoricamente.

## [2.12.69] - 2026-07-07

### Alterado
- **Admin (UX/UI):**
  - Refatorada completamente a interface da página [Admin.tsx](file:///f:/CURSOR/fincontrol/src/pages/Admin.tsx) para um design premium e elegante condizente com a Sidebar e o Dashboard do app.
  - Stats Cards ganharam fundos limpos (sóbrios), bordas finas semi-transparentes, acentos de gradiente superior e efeitos de hover de micro-interação.
  - Formulário de envio de notificações e lista de templates rápidos foram modernizados com layouts em cantos arredondados, focos sutis em campos e botões dinâmicos.
  - Modal de visualização de usuários remodelado usando cantos arredondados `rounded-[2rem]`, efeito `backdrop-blur-sm` no overlay e tabelas modernizadas de dados.

## [2.12.68] - 2026-07-07

### Adicionado
- **Configuração (Agente):**
  - Criado o arquivo de regras de desenvolvimento do projeto [AGENTS.md](file:///f:/CURSOR/fincontrol/.agents/AGENTS.md).
  - Adicionada regra proibindo o agente de detalhar ou imprimir códigos de implementação inteiros no chat antes de realizar as alterações.

## [2.12.67] - 2026-07-07

### Alterado
- **Dashboard (UX/UI):**
  - Substituído o card abstrato de **Saúde Financeira** (`FinancialHealthRing`) pelo widget **Maiores Gastos** no topo direito do painel.
  - O novo widget calcula e exibe de forma clara as 3 principais categorias de despesas que mais consumiram recursos no mês selecionado.
  - Inclui barras de progresso horizontais com as cores originais de cada categoria, porcentagem correspondente em relação ao total de gastos e indicador visual de zero despesas (`empty state`).

## [2.12.66] - 2026-07-07

### Adicionado
- **UX/UI (Sidebar):**
  - Adicionadas animações interativas de hover nos ícones da Sidebar baseadas na classe pai `group` e transições do Tailwind CSS:
    - **Dashboard:** Efeito de escala e pequena inclinação (`group-hover:scale-110 group-hover:rotate-6`).
    - **Transações:** Deslocamento lateral suave (`group-hover:scale-110 group-hover:translate-x-0.5`).
    - **Cartões:** Inclinação acentuada e aumento de escala (`group-hover:scale-115 group-hover:rotate-12`).
    - **Categorias:** Deslocamento vertical de elevação (`group-hover:scale-110 group-hover:-translate-y-0.5`).
    - **Relatórios:** Efeito de subida simulando crescimento (`group-hover:scale-110 group-hover:-translate-y-1`).
    - **Assinaturas:** Rotação suave do relógio (`group-hover:scale-110 group-hover:rotate-12`).
    - **Configurações:** Rotação de 90° da engrenagem (`group-hover:rotate-90 duration-500`).
    - **Admin:** Escudo inclina e ganha escala (`group-hover:scale-110 group-hover:rotate-6`).
    - **Cálculos:** Calculadora dá zoom e rotaciona (`group-hover:scale-110 group-hover:rotate-6`).
    - **Submenus (Percent e Juros Compostos):** Movimentos direcionais e zoom.
    - **Dark Mode (Lua e Sol):** Lua rotaciona e Sol gira em 90°.
    - **Sair (LogOut):** Ícone desliza horizontalmente simulando "porta de saída" (`group-hover:translate-x-0.5`).

## [2.12.65] - 2026-07-07

### Otimizado
- **Performance (Dashboard):** 
  - Removida chamada duplicada e redundante à API de Analytics (`/api/v1/analytics`) no carregamento inicial do Dashboard. A função agora é chamada apenas uma vez na montagem inicial e re-executada de forma reativa apenas quando a data selecionada (`selectedDate`) sofrer alterações.

## [2.12.64] - 2026-07-06

### Corrigido
- **UX/UI (MobileNavBar):**
  - Substituído o seletor `border-t-2` por um indicador em pílula contida (`rounded-full`) ao redor do ícone ativo, evitando vazamento visual nos cantos arredondados da barra.
  - Corrigida a animação de rotação do botão "Mais" para girar apenas o ícone `⋯`, mantendo a pílula de fundo estática.

## [2.12.63] - 2026-07-06

### Alterado
- **UX/UI (MobileNavBar):**
  - Redesenhado o painel de ações rápidas "Mais": de um *bottom sheet* de tela cheia para um **popup flutuante compacto** que surge acima da barra de navegação, mantendo a `MobileNavBar` sempre visível e na frente.
  - O popup possui animação de entrada `scale + opacity + y` com mola (`spring`), ancorando-se acima da barra no canto direito.
  - Overlay de fundo suave com `bg-black/30 backdrop-blur-[2px]` no `z-30`, garantindo que a `MobileNavBar` (`z-50`) fique sempre acessível.
  - Removido o gesto de arrastar para fechar (`useDragControls`), simplificando a lógica e melhorando a performace.

## [2.12.62] - 2026-07-06

### Alterado
- **UX/UI (MobileNavBar):**
  - Invertido o seletor visual ativo da barra de navegação móvel de baixo (`border-b-2`) para cima (`border-t-2`), combinando com o padrão estético moderno de barras flutuantes.
  - Adicionadas micro-animações de mola premium (`spring`) nos ícones de navegação ao serem ativados (`y: -2`, `scale: 1.15`).
  - Adicionada micro-animação de rotação e escala no botão rotativo "Mais" (`rotate: 90`, `scale: 1.15`) quando expandido.
  - Adicionada animação de clique e rotação (`whileTap`) no botão central flutuante de Nova Transação ("➕").

## [2.12.61] - 2026-07-06

### Corrigido
- **UX/UI (Modais):**
  - Ajustado o overlay de fundo (backdrop) dos modais de Receitas e Despesas do Mês no [Dashboard.tsx](file:///f:/CURSOR/fincontrol/src/pages/Dashboard.tsx) e no componente comum [Modal.tsx](file:///f:/CURSOR/fincontrol/src/components/common/Modal.tsx), substituindo `inset-0` por `-inset-1`. Isso expande a área do overlay em 4px para fora de todas as extremidades, eliminando vazamentos de luz e frestas brancas no topo causadas por safe-areas ou arredondamentos de sub-pixels no mobile e desktop.

## [2.12.60] - 2026-07-06

### Removido
- **UX/UI (Sidebar Desktop):**
  - Removidos por completo os blocos de convite Premium ("Torne-se Premium") e de status de membro ativo ("Membro Pro") do rodapé do [Sidebar.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/Sidebar.tsx), simplificando e liberando espaço vertical valioso na barra lateral de navegação.

## [2.12.59] - 2026-07-06

### Alterado
- **UX/UI (Footer Geral):**
  - Substituído o logo antigo de carteira (`Wallet` do lucide) no [Footer.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/Footer.tsx) pela nova imagem de logo oficial corporativa (`/icons/logofincontrol.png`), harmonizando a marca em todo o projeto.
  - Implementada a exibição dinâmica da versão do aplicativo no Footer, importando as informações diretamente do `package.json` do projeto, eliminando dados estáticos legados (`2.12.33`).

## [2.12.58] - 2026-07-06

### Alterado
- **UX/UI (Header & Sidebar):**
  - Migradas a imagem de perfil do usuário e a ação de logout (Sair) do Header para a base da Sidebar Desktop.
  - Implementado bloco de perfil do usuário elegante na base da Sidebar que se adapta de forma responsiva ao estado colapsado (exibindo foto e botão de logout em empilhamento centralizado) e ao estado expandido (exibindo foto, nome, email e botão de logout lado a lado com transição suave).
  - O Header foi simplificado, permanecendo focado apenas no boas-vindas/saudação dinâmica e no dropdown de notificações.

## [2.12.57] - 2026-07-06

### Alterado
- **UX/UI (Layout Geral):**
  - Removidos os cantos arredondados na lateral direita da Sidebar e ajustada sua altura para preencher toda a tela verticalmente (`h-screen`, `my-0`). Isso alinha visualmente a Sidebar de ponta a ponta com o Header no topo, eliminando frestas e criando uma interface contínua, integrada e muito mais corporativa.

## [2.12.56] - 2026-07-06

### Alterado
- **UX/UI (Sidebar Desktop):**
  - Abreviados os nomes das sub-opções do menu "Cálculos" de `Calc. de Porcentagem` para `Porcentagem` e de `Calc. de Juros Compostos` para `Juros Compostos`, otimizando o espaço horizontal e eliminando cortes de texto.
  - Ocultadas as barras de rolagem vertical e horizontal no contêiner de navegação da Sidebar (`overflow-x-hidden` e `.scrollbar-hide`), garantindo que o menu lateral mantenha sempre um aspecto visual monolítico e limpo, sem barras quebrando a estética, mesmo quando expandido.

## [2.12.55] - 2026-07-06

### Adicionado
- **UX/UI (Layout Desktop):**
  - **Saudação Dinâmica:** Adicionada uma seção de saudação de boas-vindas no lado esquerdo do `Header` com ícones animados baseados no horário (Sol giratório lento para o dia, Sol fraco pulsante para a tarde e Lua/Estrelas flutuando verticalmente para a noite), integrada com a tipografia Outfit.
  - **Sidebar Premium:** Adicionado o efeito de indicador vertical deslizante (`motion.div` com `layoutId` do Framer Motion) na borda esquerda do item ativo na `Sidebar`, acompanhado de um gradiente de brilho interno suave e arredondamento aprimorado (`rounded-xl`).
  - **Scrollbar Glassmorphic:** Implementada uma barra de rolagem minimalista, ultrafina (6px), com fundo da pista transparente e cursor translúcido com opacidades adaptativas no hover/click, integrando-se organicamente aos temas escuro e claro.

## [2.12.52] - 2026-07-06

### Adicionado
- **UX/UI (Layout & Mobile NavBar):** 
  - Adicionado suporte a gestos de arrastar para fechar (drag-to-close) no bottom sheet "Mais" da `MobileNavBar` utilizando `useDragControls` e propriedades físicas do `framer-motion` (consistente com o gesto presente nos demais modais do app).
  - Adicionado espaçamento superior seguro para a safe-area de status bar (`pt-[calc(1rem+env(safe-area-inset-top))]`) em todas as páginas na visualização móvel no [MainLayout.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/MainLayout.tsx), prevenindo que os dashboards ou cabeçalhos colidam com o relógio ou notch do celular.

## [2.12.51] - 2026-07-06

### Alterado
- **Layout (Header):** Removido o cabeçalho (`Header`) na versão mobile do aplicativo (telas menores que `lg`), envolvendo-o em um contêiner responsivo `hidden lg:block` no [MainLayout.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/MainLayout.tsx). Isso otimiza o espaço vertical em smartphones, já que o app utiliza a barra inferior (`MobileNavBar`) para navegação móvel.

## [2.12.50] - 2026-07-06

### Alterado
- **UX/UI (Modal Cartão):** Refatorada a responsividade do `CreditCardModal` para utilizar classes responsivas do Tailwind CSS nativo (evitando bugs com hooks de resize do React). Agora, em telas móveis, o modal se posiciona obrigatoriamente no rodapé (Bottom Sheet) com cantos superiores arredondados pronunciados (`rounded-t-[2.5rem]`) em todas as camadas (incluindo o contêiner do header para evitar vazamentos visuais), e o botão `X` de fechar é ocultado (`hidden sm:flex`), confiando estritamente no gesto de arrastar para fechar.

## [2.12.49] - 2026-07-06

### Alterado
- **UX/UI (Modal / Bottom Sheet):** Refinado o comportamento responsivo de modais no mobile no [Modal.tsx](file:///f:/CURSOR/fincontrol/src/components/common/Modal.tsx). Aumentamos o arredondamento dos cantos superiores para `rounded-t-[2.5rem]` (e aplicamos no próprio contêiner do cabeçalho para evitar vazamento visual de cores nos cantos), e removemos a exibição do botão `X` de fechar em telas móveis (`hidden sm:flex`), priorizando a navegação gestual nativa (deslizar para baixo/drag-to-close) já presente no app.

## [2.12.48] - 2026-07-06

### Alterado
- **UX/UI (Mobile NavBar):** Remodelado o formato do botão central de "Nova Transação" na barra inferior móvel. Abandonamos o círculo padrão e adotamos um **diamante/losango arredondado flutuante (`rotate-45 rounded-xl`)**, que remete a moedas, joias e ao nicho de finanças/investimentos. O botão foi posicionado ligeiramente suspenso e o ícone centralizado de forma correta (`-rotate-45`).

## [2.12.47] - 2026-07-06

### Alterado
- **UX/UI (Mobile NavBar):** Alterado o fundo do bottom sheet "Mais" de vidro fosco translúcido (`backdrop-blur-lg`) para fundo sólido (`bg-white` no light mode e `bg-neutral-950` no dark mode), garantindo maior consistência visual, privacidade e contraste do conteúdo quando aberto sobre o dashboard.

## [2.12.46] - 2026-07-06

### Corrigido
- **UX/UI (Mobile NavBar):** Corrigido o corte do conteúdo na base do bottom sheet "Mais". Elevamos o z-index do sheet para `z-50` para que ele sobreponha corretamente a barra de navegação inferior (`z-40`), e aumentamos o padding inferior (`pb-[calc(2rem+env(safe-area-inset-bottom))]`) para garantir que botões na base do sheet (como "Sair do App") fiquem totalmente visíveis e clicáveis em qualquer aparelho móvel.

## [2.12.45] - 2026-07-06

### Alterado
- **UX/UI (Mobile NavBar):** Redesenhado o seletor ativo da barra de navegação móvel (`MobileNavBar`) com base no design de abas clássico. O item selecionado agora recebe uma linha azul sólida na borda inferior (`border-b-2 border-primary-600`) e um preenchimento translúcido sutil (`bg-primary-500/5 dark:bg-white/5`) no fundo do bloco correspondente, idêntico aos padrões de aplicativos premium.

## [2.12.44] - 2026-07-06

### Alterado
- **UX/UI (Mobile NavBar):** Adicionados cantos superiores arredondados (`rounded-t-[2rem]`) na barra de navegação móvel (`MobileNavBar`), suavizando a transição com o conteúdo superior e mantendo a base e laterais 100% unificadas com as bordas da tela.

## [2.12.43] - 2026-07-06

### Alterado
- **UX/UI (Mobile NavBar):** Removido o visual flutuante da barra de navegação móvel (`MobileNavBar`) e do painel de opções deslizante ("Mais"). Ambos agora são **unificados com o fundo e colados** na borda inferior da tela, estendendo-se por toda a largura, exatamente como o padrão de aplicativos nativos mobile. A animação do painel "Mais" foi ajustada para nascer e deslizar verticalmente a partir de 100% da base (`y: '100%'`).

## [2.12.42] - 2026-07-06

### Alterado
- **UX/UI (Sidebar Toggle):** Retornado o formato do botão de toggle da Sidebar para o design redondo original (`rounded-full` com diâmetro `w-7 h-7`), mantendo a cor de fundo azul e o ícone branco destacados e a correção de z-index para evitar que seja sobreposto pelo Header sticky.

## [2.12.41] - 2026-07-06

### Corrigido
- **UX/UI (Layout):** Corrigida a sobreposição do botão de toggle da Sidebar pelo Header sticky da página. Elevamos o z-index do contêiner da Sidebar no [MainLayout.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/MainLayout.tsx) para `z-40`, o que supera o `z-30` do Header, garantindo que o puxador do toggle fique visível e acessível a todo momento.

## [2.12.40] - 2026-07-06

### Alterado
- **UX/UI (Sidebar Toggle):** Redesenhado o formato do botão de toggle de recolhimento da Sidebar. Em vez de uma bolinha flutuante solta, ele agora é uma **aba/puxador vertical alongado (Pill/Tab)** com cantos arredondados na direita (`rounded-r-xl`) encostada na borda da Sidebar. Posicionado estrategicamente em `top-10` para evitar conflito com a curvatura do topo da Sidebar, possui também uma micro-animação de expansão suave ao passar o mouse (`hover:w-6`).

## [2.12.39] - 2026-07-06

### Corrigido
- **UX/UI (Layout):** Corrigido o bug onde o botão de toggle de recolhimento da Sidebar ficava coberto ou oculto pela área de conteúdo principal da direita (Header/Main). Adicionamos posicionamento relativo e z-index superior (`relative z-20`) ao contêiner pai da Sidebar no [MainLayout.tsx](file:///f:/CURSOR/fincontrol/src/components/layout/MainLayout.tsx), garantindo que ela e seu botão de toggle flutuem livremente sobre as outras seções do dashboard.

## [2.12.38] - 2026-07-06

### Corrigido
- **UX/UI (Sidebar):** Resolvido o problema de corte (clipping) do botão de toggle da Sidebar, que era causado pela renderização de `backdrop-filter` combinada com o `border-radius` do elemento pai. O efeito de Glassmorphism e cantos arredondados foram movidos para uma camada de background absoluto independente, garantindo que o botão de toggle flutue livremente e permaneça 100% redondo e visível.

## [2.12.37] - 2026-07-06

### Alterado
- **UX/UI (Sidebar):** Ajustada a `Sidebar` para alinhar-se perfeitamente à lateral esquerda da tela (removido o recuo `ml-4` e cantos arredondados na esquerda), mantendo apenas as bordas do topo, fundo e lateral direita arredondadas (`rounded-r-[2rem]`).
- **UX/UI (Sidebar Toggle):** Corrigido o contraste do botão de toggle de recolhimento da Sidebar. A cor de fundo foi alterada de branco para azul (`bg-primary-600 dark:bg-primary-500`) e o ícone Chevron para branco (`text-white`), garantindo destaque perfeito em relação ao fundo claro do dashboard.

## [2.12.36] - 2026-07-06

### Alterado
- **UX/UI (Layout):** Redesenhada a `Sidebar` no desktop para o modelo flutuante premium com cantos altamente arredondados (`rounded-[2rem]`), margem lateral/superior (`my-4 ml-4`) e borda contínua, abandonando o formato de barra reta colada.

## [2.12.35] - 2026-07-06

### Adicionado
- **UX/UI (Dashboard):** Implementada a assinatura visual **Saúde Financeira (FinancialHealthRing)**: um indicador radial animado que resume a saúde das finanças do mês em tempo real, baseando-se no saldo, receitas, despesas e limites de orçamentos configurados.
- **Tipografia:** Integrada a fonte de exibição premium **Outfit** do Google Fonts para títulos e displays numéricos de saldos em destaque.
- **Navegação (Glassmorphism):** Refinamento visual da `Sidebar`, `MobileNavBar` e `Header` com fundos translúcidos (efeito vidro fosco) e micro-animações de hover suaves nos itens.
- **Transições:** Ativadas as animações globais de transição de página (`PageTransition`) entre as telas do dashboard.

### Corrigido
- **UX/UI (Layout):** Ajustado o grid de cards de resumos no topo do Dashboard para resolver o espaço vazio ("buraco") ao lado do card de Despesas, configurando o card de Saldo do Mês para ocupar a largura total do sub-grid (2 colunas) em harmonia com as receitas e despesas.
- **Visualização de Dados (Recharts):** Corrigido o visual dos Tooltips dos gráficos de linha, área, barras e pizza no Dark Mode (agora adaptam-se ao tema escuro com fundo cinza translúcido e bordas sutis).

## [2.12.34] - 2026-07-06

### Adicionado
- **Ambiente de Desenvolvimento:** Instalada a ferramenta Impeccable Skills e adicionada a skill `frontend-design` no projeto para aprimoramento e verificação das diretrizes visuais do frontend.

## [2.12.33] - 2026-05-12

### Corrigido
- **UI (IconPicker):** Resolvido problema onde a barra de rolagem não funcionava na aba de Marcas devido a restrições de overflow e layout flexbox.

## [2.12.32] - 2026-05-12

### Alterado
- **UI (IconPicker):** Unificada a barra de busca no topo do modal para as abas de ícones e marcas.
- **UX:** Adicionado indicador de carregamento proeminente ("Buscando ícones...") na aba de marcas para fornecer feedback visual claro durante a busca assíncrona.

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
