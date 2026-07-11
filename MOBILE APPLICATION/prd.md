# Requisitos do Produto & Escopo (PRD)

Este arquivo descreve o escopo completo de funcionalidades do FinControl, a arquitetura do cliente móvel Android e o guia de UI/UX baseada em Material Design 3 e Nubank.

---

## 1. Especificações Técnicas (Android)
- **Linguagem**: Kotlin
- **Visual**: Jetpack Compose
- **Design System**: Material Design 3 (M3) com suporte a Dynamic Color e temas Claro/Escuro
- **Arquitetura**: MVVM (Model-View-ViewModel) + Clean Architecture (Data, Domain, Presentation)
- **Cache Local (Offline-First)**: Room Database
- **Injeção de Dependências**: Dagger Hilt
- **Comunicação de Rede**: Retrofit 2 + OkHttp 3 (com interceptor de logs e interceptor de Token JWT)
- **Assincronismo**: Kotlin Coroutines + Flow (StateFlow para UI, SharedFlow para eventos de navegação/toasts)
- **Navegação**: Jetpack Compose Navigation Component (Type-safe)

---

## 2. Requisitos de Telas & Funcionalidades

### 1. Autenticação e Perfil
- **Telas**: Login e Cadastro com validações de campos.
- **Segurança**: Armazenamento seguro de tokens JWT no `EncryptedSharedPreferences`.
- **Preferências**: Menu de configurações para troca de tema (Claro, Escuro, Seguir Sistema).

### 2. Dashboard (Nubank UI)
- **Cabeçalho de Saldo**: Cabeçalho azul sólido (`#0284c7`) que se estende por trás da barra de status (full-bleed), exibindo o saldo mensal com fonte geométrica (ex: `Outfit` ou `Montserrat`) e indicador de variação percentual.
- **Carrossel de Atalhos Rápidos**: Lista horizontal de botões circulares táteis ("Nova Transação", "Nova Categoria", "Cartões de Crédito", "Metas de Economia").
- **Carrossel de Avisos**: Cards dinâmicos obtidos da API contendo alertas de segurança, status de faturas ou dicas rápidas.
- **Widgets**: Visão condensada de progresso de metas e orçamentos.

### 3. Listagem de Transações
- **Navegação**: Seletor horizontal de meses ("Anterior", "Próximo", "Hoje").
- **Agrupamento**: Transações organizadas em cartões brancos/neutros arredondados diários separados por cabeçalhos ("Hoje", "Ontem", "10 de jul").
- **Filtros**: Caixa de busca por texto com filtros de Tipo (Receita/Despesa) e Categorias.
- **Swipe Actions (Ações Rápidas)**:
  - Arrastar para a esquerda revela os botões de ação (Info, Cancelar Recorrência, Editar, Excluir).
  - O card sofre snap magnético e se mantém aberto ao atingir a largura adequada (`-112dp` para avulsas ou `-232dp` para recorrentes).
  - Tocar fora ou deslizar outro card fecha o atual de forma automática.

### 4. Modal de Nova Transação (Bottom Sheet)
- **Display de Valor**: Display central com fonte Outfit Extra-Negrito (`text-4xl`) para digitação centrada de valores.
- **Seletor de Tipo**: Dois cards grandes de Receita (Emerald) e Despesa (Red) com bordas semânticas luminosas ativas por seleção.
- **Campos**: Descrição, Data (DatePicker embutido do M3) e Categorias (BottomSheet).
- **Recorrência**: Toggle switch que, ao ser ativado, expande com animação física de mola (spring) as opções de frequência (Diária, Semanal, Mensal, Anual) e quantidade de parcelas.

### Requisito 5: Metas de Economia & Orçamentos
- **Metas**: Cadastro de objetivos financeiros com valor total, data-alvo, progresso visual (barra de progresso) e cálculo automático de quanto economizar por mês.
- **Orçamentos**: Vinculação de limites de gastos mensais por Categoria, mostrando barras de progresso que mudam de cor se atingirem 80% (Alerta - Laranja) ou 100% (Perigo - Vermelho) do orçamento.

### Requisito 6: Relatórios & Analytics (Gráficos)
- **Telas**: Tela dedicada a relatórios financeiros.
- **Gráficos**:
  - **Fluxo de Caixa (Entradas vs Saídas)**: Gráfico de linhas ou barras.
  - **Maiores Despesas**: Gráfico de rosca/pizza com as categorias mais consumidas.
  - **Gastos por Dia da Semana**: Gráfico de barras.
  - **Orçado vs Realizado**: Gráfico comparativo de barras empilhadas ou agrupadas.
- **Biblioteca Android Sugerida**: `patryk-gassmann/vico` para gráficos Jetpack Compose modernos.

### Requisito 7: Gestão de Assinaturas (Premium)
- **Bloqueio de Uso**: Validação local e na API (`checkTransactionLimit`) bloqueando a criação de novas transações se o usuário for do plano `free` e ultrapassar o limite padrão de transações.
- **Banner de Limite**: Banner visual no topo da lista se o usuário estiver próximo ao limite.
- **Checkout/Upgrade**: Tela para assinar o plano premium com descrição de vantagens e simulação de ativação de assinatura.

### Requisito 8: Detalhamento de Cartões & Faturas
- **Tela de Fatura**: Ao clicar em um cartão de crédito, abrir tela de detalhes contendo:
  - Limite disponível vs limite consumido.
  - Lista de transações daquela fatura (lançamentos de despesa vinculados ao `creditCardId` da fatura corrente baseando-se nas datas de fechamento).

### Requisito 9: Exportação de Lançamentos
- **Ação**: Botão de exportação na tela de transações.
- **Fluxo**: Invoca a API de exportação e gera arquivo CSV. Dispara a intent padrão de compartilhamento do Android (`Intent.createChooser`) para que o usuário possa enviar o arquivo via WhatsApp, e-mail ou salvar no Google Drive.

### Requisito 10: Painel Admin
- **Restrição**: Exibido no menu lateral ou configurações apenas se o usuário logado tiver a flag `isAdmin: true` ou `role: 'admin'`.
- **Funcionalidade**: CRUD e troca de status (`isActive`) dos avisos e notificações dinâmicas do carrossel do Dashboard (`dashboard_cards`).

---

## 3. Branding & Diretrizes de Design

### Paleta de Cores
- **Primary (Destaques)**: `#0284c7` (Primary 600)
- **Secondary (Cartões/Ações)**: `#4f46e5` (Indigo 600)
- **Success (Receitas)**: `#10b981` (Emerald 500)
- **Danger (Despesas)**: `#ef4444` (Red 500)
- **Background Light**: `#f9fafb` (Gray 50)
- **Background Dark**: `#000000` (Black)
- **Surface**: `#ffffff` / `#171717` (Neutral 900)

### Tipografia
- **Valores e Títulos**: Fonte geométrica (ex: `Outfit` ou `Montserrat`).
- **Textos Gerais**: Fonte padrão do Android (`Roboto` ou `Inter`).

---

## 4. Plano de Implementação

- [ ] **Fase 1: Configuração do Projeto e Hilt**
  - Adicionar plugins do Hilt, Room, Compose Compiler e Serialization de rotas no Gradle.
  - Implementar classe `FinControlApplication` com `@HiltAndroidApp`.

- [ ] **Fase 2: Camada de Dados Local (Room)**
  - Criar entidades Room para `User`, `Category`, `Transaction` e `CreditCard`.
  - Configurar classe `AppDatabase` e declarar DAOs com fluxos reativos (`Flow`).

- [ ] **Fase 3: Camada de Comunicação com API (Retrofit)**
  - Implementar contratos em interfaces Kotlin (ex: `AuthApi`, `TransactionApi`, `DashboardApi`).
  - Desenvolver o interceptor de rede OkHttp para adicionar o cabeçalho Bearer do Token e fluxo de renovação automática via Refresh Token no caso de erro `401 Unauthorized`.

- [ ] **Fase 4: Core Domain & Repositórios**
  - Implementar os repositórios injetados no Hilt com a lógica de decisão: "Verificar se há rede -> Se sim, bater na API, atualizar o banco local e retornar; Se não, ler diretamente do banco local".

- [ ] **Fase 5: Interface do Dashboard (Estilo Nubank)**
  - Desenvolver o Cabeçalho de Saldo dinâmico que ignora a status-bar e desenha o fundo azul.
  - Construir o carrossel horizontal de atalhos rápidos e de avisos.

- [ ] **Fase 6: Interface de Transações e Gestos de Swipe**
  - Montar a listagem agrupada por dia.
  - Criar o componente de item de transação utilizando `Modifier.anchoredDraggable` para obter o snap físico magnético nos pontos das ações.

- [ ] **Fase 7: Sincronização Automática com WorkManager**
  - Criar a classe `SyncWorker` herdada de `CoroutineWorker`.
  - Definir o agendamento de sincronização para quando o dispositivo ganhar conectividade estável com a internet.
