# Changelog

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
