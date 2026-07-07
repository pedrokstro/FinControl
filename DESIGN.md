---
name: FinControl
description: Sistema de controle financeiro moderno, focado em simplicidade visual e clareza de dados.
colors:
  primary: "#0284c7"
  success: "#16a34a"
  danger: "#dc2626"
  warning: "#d97706"
  info: "#2563eb"
  neutral-bg: "#fafafa"
  neutral-surface: "#ffffff"
  neutral-dark-bg: "#000000"
  neutral-dark-surface: "#171717"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontWeight: 700
  title:
    fontFamily: "Outfit, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Inter, system-ui, sans-serif"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 500
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  3xl: "1.5rem"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  btn-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
---

# Design System: FinControl

## 1. Overview

**Creative North Star: "O Painel de Confiança"**

O design do FinControl é construído sobre os alicerces da precisão, robustez e do apuro técnico. As interfaces privilegiam o espaço em branco, linhas limpas e o agrupamento coerente da informação para minimizar a carga cognitiva. O objetivo é transmitir, em cada pixel, que as finanças do usuário estão sob absoluto controle técnico em uma ferramenta estável e imaculada. Evitamos ruídos decorativos, tabelas engessadas e densidade sufocante (típica de ERPs legados). A interface é direta e funcional, mas respira.

**Key Characteristics:**
- **Clareza Absoluta**: A visualização de dados prevalece sobre os elementos decorativos.
- **Espaçamento Intencional**: A "tranquilidade visual" é aplicada reduzindo componentes densos em prol de margens e preenchimentos generosos.
- **Interações Suaves**: Elementos interativos nunca quebram o layout e reagem de forma sutil, encorajadora e polida.

## 2. Colors

A paleta de cores é contida e ancorada na confiabilidade técnica.

### Primary
- **Azul Confiança Profundo** (#0284c7): O centro da estabilidade da marca. Utilizado para direcionar ações principais (Call to Action), links vitais e estados ativos (selected). 

### Secondary
- **Verde Sucesso Limpo** (#16a34a): Utilizado estritamente para indicar entradas (receitas), tendências positivas ou o sucesso de uma transação.
- **Vermelho Alerta Dinâmico** (#dc2626): Utilizado estritamente para indicar saídas (despesas), tendências negativas ou ações destrutivas (exclusões).

### Neutral
- **Fundo Papel Frio** (#fafafa / Dark: #000000): O tom de fundo base da aplicação. Não compete com os painéis.
- **Superfície Imaculada** (#ffffff / Dark: #171717): Utilizado para separar áreas de foco (cards) contra o fundo.

### Named Rules
**The Strict Semantic Rule.** Cores de sucesso (verde), erro (vermelho) e alerta (laranja/amarelo) são *puramente funcionais*. Elas não podem ser utilizadas como decoração ou em fundos de áreas genéricas que não possuam significado inerente a estes estados.

## 3. Typography

**Display Font:** Outfit, sans-serif (com fallback para system-ui)
**Body Font:** Inter, system-ui (com fallback para sans-serif)

**Character:** A tipografia combina o rigor geométrico do Outfit (Display/Headlines) com a clareza máxima de leitura do Inter (Corpo/Labels). Cria um ambiente ao mesmo tempo amigável, técnico e estritamente legível.

### Hierarchy
- **Display** (bold, text-5xl+): Utilizado apenas em Hero sections, totais financeiros agregados em dashboards ou estados vazios gigantes.
- **Headline** (bold, text-3xl a text-4xl): Títulos de páginas e chamadas importantes dentro dos painéis.
- **Title** (semibold, text-xl a text-2xl): Títulos de seções, modais e rótulos de áreas internas (Cards).
- **Body** (normal, text-base a text-lg): Textos longos, parágrafos de explicação e descrições de tabelas.
- **Label** (medium, text-sm): Elementos de formulário, navegação lateral e badges de dados pequenos.

### Named Rules
**The Data Contrast Rule.** Valores monetários, especialmente o balanço geral, não precisam apenas ser "grandes". Devem possuir peso (bold/extrabold) e forte contraste com o elemento pai, além de se valerem da cor semântica caso denotem receita ou despesa de maneira inerente.

## 4. Elevation

O modelo de profundidade é predominantemente **Plano e Suave**. Elementos da interface repousam harmoniosamente sobre a superfície de fundo. Camadas não existem para ostentar, mas para demarcar agrupamento de dados. 

### Shadow Vocabulary
- **Card Shadow** (`shadow-sm`): Utilizado globalmente nos painéis em Light Mode apenas para uma distinção nanométrica (border é preferida em vez de grandes sombras). Em Dark mode, prefere-se o uso estrito de bordas finas com cores neutras (e sem sombras emitidas).
- **Dark Shadow** (`shadow-dark / shadow-dark-lg`): Sombras aplicadas pontualmente a elementos elevados flutuantes, como tooltips, menus suspensos (dropdowns) e popovers, apenas para retirá-los do fluxo normal.

### Named Rules
**The Flat-By-Default Rule.** Superfícies são planas em repouso. Sombras espalhadas não devem ser o mecanismo primário de separação. A estrutura deve se manter legível através de bordas sutis e contraste de tons de fundo em primeiro lugar.

## 5. Components

Os componentes são a fundação do "Painel de Confiança" e transmitem solidez refinada.

### Buttons
- **Shape:** Cantos arredondados (rounded-lg: 0.5rem), mantendo consistência orgânica.
- **Primary:** Background Azul Confiança (primary-600) em modo claro; cor do texto branco. Padding de 8px 16px. Sem bordas.
- **Hover / Focus:** Transição suave e sutil (escurecendo ligeiramente o fundo para primary-700), sem solavancos bruscos na estrutura ou "pulos".

### Cards / Containers
- **Corner Style:** Rounded-xl (0.75rem) a Rounded-3xl para áreas de super-ênfase (como cartões estilo telegram).
- **Background:** Branco absoluto no claro (Neutral Surface) e Cinza Escuro (Neutral-900) no escuro.
- **Shadow Strategy:** Quase imperceptível em Light mode (shadow-sm), ausente em Dark mode (substituído por border-neutral-800).
- **Internal Padding:** Confortável (p-6, ou 1.5rem), com espaçamento generoso que permite aos dados "respirarem".

### Inputs / Fields
- **Style:** Bordas neutras (gray-300 / neutral-700), cantos (rounded-lg) que combinam perfeitamente com os botões.
- **Focus:** O anel de foco (focus ring) é elegante e inconfundível. Uma borda em primary-500 combinada com um `ring` suave, mas inequívoco.
- **Error:** Reação visual rápida com borda danger-500 e anel do mesmo tom. O feedback para o usuário é direto.

## 6. Do's and Don'ts

As salvaguardas para proteger o "Painel de Confiança" contra a diluição visual.

### Do:
- **Do** utilizar espaços em branco abundantes ao redor de valores financeiros para realçar a importância e legibilidade do dado.
- **Do** reservar o uso do **Outfit** estritamente para cabeçalhos e números totais/destaques; garantindo o impacto sem comprometer os pequenos textos onde o **Inter** brilha.
- **Do** manter a elevação restrita: bordas suaves de 1px definem as regiões muito melhor que sombras pesadas.

### Don't:
- **Don't** utilizar painéis corporativos densos, confusos e repletos de tabelas engessadas (ERPs legados). Tabelas no FinControl devem ter ar fresco, borders horizontais delicadas (ou inexistentes) e espaçamento farto.
- **Don't** utilizar excesso de linhas de grade rígidas em volta de todos os elementos da interface.
- **Don't** usar cores berrantes simultâneas sem propósito semântico ou layouts congestionados. Não decore com cores aleatórias os cartões de informação vital.
- **Don't** adicionar sombras "Ghost" largas e pesadas (e.g. blur maior que 16px) como mera decoração nas bordas de blocos centrais; a superfície plana é regra.
