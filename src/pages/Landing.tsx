import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageTransition from '@/components/common/PageTransition'
import { useAuthStore } from '@/store/authStore'
import AnimatedTextCycle from '@/components/ui/animated-text-cycle'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight,
  HelpCircle,
} from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'

// Visualizador SVG 01: Lançamentos & Transações em Tempo Real
const RealTimeFlowVisualizer = () => {
  return (
    <div className="w-full max-w-[280px] h-[160px] flex items-center justify-center">
      <svg viewBox="0 0 240 140" className="w-full h-full text-primary-600 dark:text-primary-400">
        <defs>
          <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Linhas de grade sutis */}
        <line x1="20" y1="35" x2="220" y2="35" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
        <line x1="20" y1="70" x2="220" y2="70" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
        <line x1="20" y1="105" x2="220" y2="105" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />

        {/* Barras de fluxo animadas */}
        <g>
          <rect x="30" y="55" width="22" height="50" rx="4" fill="currentColor" opacity="0.25">
            <animate attributeName="height" values="50;75;50" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="55;30;55" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="65" y="40" width="22" height="65" rx="4" fill="currentColor" opacity="0.6">
            <animate attributeName="height" values="65;40;65" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="y" values="40;65;40" dur="3.5s" repeatCount="indefinite" />
          </rect>
          <rect x="100" y="25" width="22" height="80" rx="4" fill="currentColor" opacity="0.9">
            <animate attributeName="height" values="80;95;80" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="y" values="25;10;25" dur="2.8s" repeatCount="indefinite" />
          </rect>
          <rect x="135" y="48" width="22" height="57" rx="4" fill="currentColor" opacity="0.45">
            <animate attributeName="height" values="57;78;57" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="y" values="48;27;48" dur="3.2s" repeatCount="indefinite" />
          </rect>
          <rect x="170" y="32" width="22" height="73" rx="4" fill="currentColor" opacity="0.75">
            <animate attributeName="height" values="73;52;73" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="32;53;32" dur="4s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Linha de tendência dinâmica com nós */}
        <path
          d="M 30 75 Q 80 40, 111 25 T 192 40"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="111" cy="25" r="4" fill="currentColor">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

// Visualizador SVG 02: Categorização & IA
const CategorizationVisualizer = () => {
  return (
    <div className="w-full max-w-[280px] h-[160px] flex items-center justify-center">
      <svg viewBox="0 0 240 140" className="w-full h-full text-primary-600 dark:text-primary-400">
        {/* Nó Central */}
        <circle cx="120" cy="70" r="14" fill="currentColor" opacity="0.9">
          <animate attributeName="r" values="13;15;13" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="120" cy="70" r="28" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25">
          <animate attributeName="r" values="24;36;24" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Conexões Radiais */}
        {[
          { cx: 55, cy: 40, delay: '0s', label: 'R$' },
          { cx: 185, cy: 40, delay: '0.5s', label: 'Fixos' },
          { cx: 60, cy: 105, delay: '1s', label: 'Meta' },
          { cx: 180, cy: 105, delay: '1.5s', label: 'Invest' }
        ].map((node, i) => (
          <g key={i}>
            <line
              x1="120"
              y1="70"
              x2={node.cx}
              y2={node.cy}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.4"
            >
              <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.5s" repeatCount="indefinite" />
            </line>
            <circle cx={node.cx} cy={node.cy} r="10" fill="currentColor" opacity="0.2" />
            <circle cx={node.cx} cy={node.cy} r="6" fill="currentColor" opacity="0.8">
              <animate attributeName="r" values="5;7;5" dur="2s" begin={node.delay} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  )
}

// Visualizador SVG 03: Metas & Crescimento
const GoalsGrowthVisualizer = () => {
  return (
    <div className="w-full max-w-[280px] h-[160px] flex items-center justify-center">
      <svg viewBox="0 0 240 140" className="w-full h-full text-primary-600 dark:text-primary-400">
        <path
          d="M 25 115 Q 90 110, 130 70 T 215 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 25 115 Q 90 110, 130 70 T 215 25 L 215 125 L 25 125 Z"
          fill="currentColor"
          opacity="0.08"
        />

        {/* Marcos de meta */}
        <g transform="translate(130, 70)">
          <circle r="5" fill="currentColor" />
          <circle r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5">
            <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        <g transform="translate(215, 25)">
          <circle r="6" fill="currentColor" />
          <circle r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7">
            <animate attributeName="r" values="10;18;10" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  )
}

// Visualizador SVG 04: Segurança & Criptografia
const SecurityVaultVisualizer = () => {
  return (
    <div className="w-full max-w-[280px] h-[160px] flex items-center justify-center">
      <svg viewBox="0 0 240 140" className="w-full h-full text-primary-600 dark:text-primary-400">
        {/* Escudo Exterior */}
        <path
          d="M 120 20 L 175 42 L 175 80 Q 175 115, 120 128 Q 65 115, 65 80 L 65 42 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.85"
        />
        <path
          d="M 120 32 L 163 49 L 163 78 Q 163 105, 120 116 Q 77 105, 77 78 L 77 49 Z"
          fill="currentColor"
          opacity="0.1"
        >
          <animate attributeName="opacity" values="0.08;0.2;0.08" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Cadeado Central */}
        <rect x="106" y="68" width="28" height="22" rx="4" fill="currentColor" opacity="0.9" />
        <path
          d="M 112 68 L 112 58 Q 112 48, 120 48 Q 128 48, 128 58 L 128 68"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="120" cy="78" r="2.5" fill="white" />
        <line x1="120" y1="79" x2="120" y2="84" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

const Landing = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/transactions', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Ciclo automático para as etapas de demonstração
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const capabilities = [
    {
      num: '01',
      title: 'Lançamentos & Fluxo em Tempo Real',
      description:
        'Registre despesas, receitas e transferências em segundos. Visualize o impacto imediato no seu saldo global com conciliação automática.',
      visualizer: <RealTimeFlowVisualizer />
    },
    {
      num: '02',
      title: 'Categorização & Orçamentos Inteligentes',
      description:
        'Classifique automaticamente seus gastos com limites por categoria. Receba alertas antes de ultrapassar o orçamento planejado.',
      visualizer: <CategorizationVisualizer />
    },
    {
      num: '03',
      title: 'Metas & Projeção Patrimonial',
      description:
        'Defina objetivos claros de curto e longo prazo. Acompanhe a evolução do seu patrimônio com simulações de juros compostos integradas.',
      visualizer: <GoalsGrowthVisualizer />
    },
    {
      num: '04',
      title: 'Segurança & Criptografia Bancária',
      description:
        'Criptografia de ponta a ponta (AES-256), autenticação em duas etapas (2FA) e backups diários com isolamento total dos seus dados.',
      visualizer: <SecurityVaultVisualizer />
    }
  ]

  const workflowSteps = [
    {
      roman: 'I',
      title: 'Conecte e Centralize',
      desc: 'Cadastre suas contas bancárias, cartões de crédito e carteiras em um único painel seguro.',
      previewCode: `// 01. Centralização de Contas
const wallet = await fincontrol.accounts.sync({
  name: "Conta Principal",
  type: "checking",
  currency: "BRL",
  balance: 14850.00
});

console.log("Status:", wallet.connected ? "Ativo" : "Pendente");`
    },
    {
      roman: 'II',
      title: 'Automatize e Planeje',
      desc: 'Configure transações recorrentes, regras de categorização e tetos mensais por categoria.',
      previewCode: `// 02. Orçamento & Recorrência
const budget = await fincontrol.budgets.create({
  category: "Alimentação & Mercado",
  monthlyLimit: 2200.00,
  alertThreshold: 0.85, // Alerta aos 85%
  autoCategorize: true
});`
    },
    {
      roman: 'III',
      title: 'Evolua seu Patrimônio',
      desc: 'Monitore relatórios analíticos, atinja suas metas de economia e conquiste previsibilidade total.',
      previewCode: `// 03. Relatório & Metas
const analytics = await fincontrol.goals.project({
  goal: "Reserva de Emergência",
  targetAmount: 50000.00,
  monthlyDeposit: 2500.00,
  projectionMonths: 20
});

return analytics.successProbability; // 99.4%`
    }
  ]

  const liveMetrics = [
    { value: 'R$ 4.8M+', label: 'Volume rastreado e organizado' },
    { value: '99.9%', label: 'Disponibilidade e sincronização' },
    { value: '< 2s', label: 'Tempo médio para lançar uma despesa' },
    { value: '10K+', label: 'Usuários no controle das suas finanças' }
  ]

  const plans = [
    {
      name: 'Básico',
      price: 'Grátis',
      period: 'para sempre',
      description: 'Ideal para quem busca simplicidade no dia a dia.',
      features: [
        'Até 30 transações mensais',
        'Controle de receitas e despesas',
        'Relatórios gráficos básicos',
        'Suporte a Dark / Light Mode',
        'Acesso mobile e PWA'
      ],
      highlighted: false,
      cta: 'Começar Grátis'
    },
    {
      name: 'Premium Pro',
      price: 'R$ 14,90',
      period: '/mês',
      description: 'Poder total e inteligência financeira sem limites.',
      features: [
        'Transações e contas ilimitadas',
        'Gestão de cartões e faturas completas',
        'Exportação de relatórios em PDF e Excel',
        'Calculadora de juros compostos avançada',
        'Metas e projeções ilimitadas',
        'Notificações de vencimento e 2FA'
      ],
      highlighted: true,
      cta: 'Assinar Premium Pro'
    }
  ]

  const marqueeItems = [
    'R$ 4.8M+ geridos',
    '99.8% precisão em orçamentos',
    '< 2s por lançamento',
    'Zero planilhas manuais',
    'Multi-contas e cartões',
    'Criptografia de ponta a ponta',
    'Relatórios detalhados',
    '100% sob seu controle'
  ]

  return (
    <PageTransition className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white selection:bg-primary-500 selection:text-white transition-colors duration-300">
      {/* Header Fixo Minimalista */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-50/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60 transition-all">
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1">
              <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-2xl tracking-tight">FinControl</span>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">v2.15</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-400">
            <a href="#capabilities" className="hover:text-neutral-900 dark:hover:text-white transition-colors relative group py-1">
              Recursos
              <span className="absolute bottom-0 left-0 w-0 h-px bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#how-it-works" className="hover:text-neutral-900 dark:hover:text-white transition-colors relative group py-1">
              Como Funciona
              <span className="absolute bottom-0 left-0 w-0 h-px bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#metrics" className="hover:text-neutral-900 dark:hover:text-white transition-colors relative group py-1">
              Métricas
              <span className="absolute bottom-0 left-0 w-0 h-px bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors relative group py-1">
              Planos
              <span className="absolute bottom-0 left-0 w-0 h-px bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-3 py-2"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center text-sm font-medium h-10 px-5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 transition-all duration-200 shadow-sm"
            >
              Criar conta
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section Monumental (Sem cartão 3D) */}
      <section className="relative min-h-[92vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        {/* Grid de Fundo Geométrico Hairline */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-30">
          <div className="absolute h-px bg-neutral-400 dark:bg-neutral-700" style={{ top: '20%', left: 0, right: 0 }} />
          <div className="absolute h-px bg-neutral-400 dark:bg-neutral-700" style={{ top: '40%', left: 0, right: 0 }} />
          <div className="absolute h-px bg-neutral-400 dark:bg-neutral-700" style={{ top: '60%', left: 0, right: 0 }} />
          <div className="absolute h-px bg-neutral-400 dark:bg-neutral-700" style={{ top: '80%', left: 0, right: 0 }} />
          
          <div className="absolute w-px bg-neutral-400 dark:bg-neutral-700" style={{ left: '15%', top: 0, bottom: 0 }} />
          <div className="absolute w-px bg-neutral-400 dark:bg-neutral-700" style={{ left: '35%', top: 0, bottom: 0 }} />
          <div className="absolute w-px bg-neutral-400 dark:bg-neutral-700" style={{ left: '65%', top: 0, bottom: 0 }} />
          <div className="absolute w-px bg-neutral-400 dark:bg-neutral-700" style={{ left: '85%', top: 0, bottom: 0 }} />
        </div>

        {/* Brilho de Ambiente Suave */}
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-primary-600/5 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
          {/* Eyebrow com traço fino */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
              A plataforma definitiva para controle financeiro
            </span>
          </div>

          {/* Título Monumental */}
          <div className="mb-14">
            <h1 className="text-[clamp(2.75rem,8.5vw,7rem)] font-bold font-display tracking-tight leading-[0.92] text-neutral-900 dark:text-white">
              <span className="block">A plataforma</span>
              <span className="block">
                para{' '}
                <span className="relative inline-block text-primary-600 dark:text-primary-400">
                  <AnimatedTextCycle
                    words={['controlar', 'prosperar', 'escalar', 'conquistar']}
                    interval={3000}
                    className="inline-block"
                  />
                  <span className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-primary-500/20 dark:bg-primary-400/30 rounded-full" />
                </span>
              </span>
              <span className="block">suas finanças.</span>
            </h1>
          </div>

          {/* Split Inferior: Subtítulo & Ações em Pílula */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-end">
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Elimine o caos das planilhas. Gerencie receitas, despesas, cartões e metas com precisão técnica e simplicidade impecável.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-medium text-base transition-all duration-300 group shadow-lg shadow-neutral-900/10 dark:shadow-none"
              >
                Começar gratuitamente
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 font-medium text-base transition-all duration-300 text-neutral-800 dark:text-neutral-200"
              >
                Ver demonstração
              </a>
            </div>
          </div>
        </div>

        {/* Marquee Contínuo de Métricas na Base da Hero */}
        <div className="mt-20 lg:mt-28 border-y border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-950/50 py-5 overflow-hidden">
          <div className="animate-marquee gap-12 text-sm font-mono text-neutral-600 dark:text-neutral-400">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div key={index} className="flex items-center gap-4 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                <span className="tracking-wide uppercase">{item}</span>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 01 a 04: Capacidades & Recursos */}
      <section id="capabilities" className="py-24 lg:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
              Capacidades
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
              Tudo o que você precisa.<br />
              <span className="text-neutral-400 dark:text-neutral-600">Sem complexidade desnecessária.</span>
            </h2>
          </div>

          {/* Lista Estruturada de Recursos 01-04 */}
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-neutral-200 dark:border-neutral-800">
            {capabilities.map((cap) => (
              <div
                key={cap.num}
                className="group py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center hover:bg-neutral-100/30 dark:hover:bg-neutral-950/30 transition-colors duration-300 px-4 -mx-4 rounded-2xl"
              >
                {/* Número */}
                <div className="lg:col-span-1">
                  <span className="font-mono text-sm text-neutral-400 dark:text-neutral-600 font-semibold">
                    {cap.num}
                  </span>
                </div>

                {/* Título & Descrição */}
                <div className="lg:col-span-7">
                  <h3 className="text-2xl lg:text-3xl font-bold font-display text-neutral-900 dark:text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                    {cap.title}
                  </h3>
                  <p className="text-base lg:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                    {cap.description}
                  </p>
                </div>

                {/* Visualizador Vetorial SVG Interativo */}
                <div className="lg:col-span-4 flex justify-start lg:justify-end">
                  <div className="p-4 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 shadow-sm group-hover:border-primary-500/40 transition-colors duration-300">
                    {cap.visualizer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Como Funciona: Processo em 3 Etapas (Alto Contraste) */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-neutral-900 text-white dark:bg-neutral-950 border-y border-neutral-800 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-400 uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-neutral-600" />
              Processo
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white">
              Três passos simples.<br />
              <span className="text-neutral-500">Controle financeiro duradouro.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Lado Esquerdo: Abas I, II, III */}
            <div className="lg:col-span-5 space-y-4">
              {workflowSteps.map((step, idx) => {
                const isActive = activeStep === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-5 ${
                      isActive
                        ? 'bg-neutral-800/90 border-primary-500/60 text-white shadow-xl shadow-black/40'
                        : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span className="font-display text-2xl font-bold text-primary-400 shrink-0 mt-0.5">
                      {step.roman}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold font-display text-white mb-1.5 flex items-center justify-between">
                        {step.title}
                        {isActive && <ChevronRight className="w-5 h-5 text-primary-400" />}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
                      
                      {isActive && (
                        <div className="mt-4 h-1 bg-neutral-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 w-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Lado Direito: Janela de Visualização / Simulação Técnica */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-neutral-800 bg-black/80 overflow-hidden shadow-2xl">
                {/* Barra da Janela */}
                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-danger-500/80" />
                    <div className="w-3 h-3 rounded-full bg-warning-500/80" />
                    <div className="w-3 h-3 rounded-full bg-success-500/80" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">fincontrol_core.ts</span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-success-400">
                    <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                    Executando
                  </span>
                </div>

                {/* Código / Visualização Interativa */}
                <div className="p-6 md:p-8 font-mono text-xs md:text-sm text-neutral-300 min-h-[300px] overflow-x-auto leading-relaxed bg-neutral-950/80">
                  <AnimatePresence mode="wait">
                    <motion.pre
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="text-neutral-300"
                    >
                      {workflowSteps[activeStep].previewCode}
                    </motion.pre>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Métricas em Tempo Real */}
      <section id="metrics" className="py-24 lg:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
                <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
                Métricas Reais
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
                Performance e confiança<br />
                <span className="text-neutral-400 dark:text-neutral-600">comprovadas em dados.</span>
              </h2>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span>Sistemas operacionais em 100% dos nós</span>
            </div>
          </div>

          {/* Grid de 4 Métricas com Divisórias Linha Fina */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {liveMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-black p-8 lg:p-10 flex flex-col justify-between hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
              >
                <div className="text-4xl lg:text-5xl font-bold font-display tracking-tight text-neutral-900 dark:text-white mb-4">
                  {metric.value}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Planos & Precificação */}
      <section id="pricing" className="py-24 lg:py-32 bg-neutral-100/50 dark:bg-neutral-950/50 border-t border-neutral-200 dark:border-neutral-800 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
              Preços Transparentes
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-neutral-900 dark:text-white mb-4">
              Escolha seu nível de controle
            </h2>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
              Sem taxas ocultas. Cancele ou altere seu plano quando desejar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-3xl p-8 lg:p-10 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-neutral-900 text-white dark:bg-neutral-900 border-2 border-primary-500 shadow-2xl relative overflow-hidden'
                    : 'bg-white dark:bg-black text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider py-1.5 px-4 rounded-bl-xl">
                    Recomendado
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold font-display">{plan.name}</h3>
                  </div>
                  <p className={`text-sm mb-6 ${plan.highlighted ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-bold font-display">{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3 text-sm">
                        <Check
                          className={`w-4 h-4 shrink-0 ${
                            plan.highlighted ? 'text-primary-400' : 'text-primary-600 dark:text-primary-400'
                          }`}
                        />
                        <span className={plan.highlighted ? 'text-neutral-200' : 'text-neutral-700 dark:text-neutral-300'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-4 rounded-full font-medium text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção FAQ - Perguntas Frequentes com Accordions */}
      <section className="py-24 lg:py-32 relative border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
              <HelpCircle className="w-4 h-4" /> Dúvidas Frequentes
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
              Tudo o que você precisa saber.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base md:text-lg">
              Respostas claras sobre segurança, recursos e funcionamento da plataforma.
            </p>
          </div>

          <Accordion type="single" defaultValue="faq-1" variant="card" className="space-y-4">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-base md:text-lg">
                Os meus dados financeiros estão realmente seguros?
              </AccordionTrigger>
              <AccordionContent>
                Sim, com máxima prioridade. Utilizamos criptografia de ponta a ponta (AES-256 e SSL/TLS) com infraestrutura isolada por conta. Seus registros financeiros são estritamente confidenciais e nunca são vendidos ou compartilhados com terceiros.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-base md:text-lg">
                Posso usar o FinControl no celular sem precisar baixar da App Store ou Play Store?
              </AccordionTrigger>
              <AccordionContent>
                Com certeza! O FinControl foi desenvolvido com tecnologia PWA (Progressive Web App). Você pode instalá-lo diretamente pelo navegador no iOS (Safari) ou Android (Chrome), criando um ícone na tela inicial que funciona em tela cheia com alta velocidade e suporte offline.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-base md:text-lg">
                Como funciona o cancelamento do plano Pro?
              </AccordionTrigger>
              <AccordionContent>
                Você tem total liberdade. Não há contratos de fidelidade. O cancelamento pode ser feito a qualquer momento com apenas um clique diretamente na sua página de configurações, sem perguntas ou burocracia.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-base md:text-lg">
                Consigo importar extratos bancários e faturas de cartão?
              </AccordionTrigger>
              <AccordionContent>
                Sim! Você pode importar arquivos nos formatos OFX, CSV e Excel gerados por qualquer instituição bancária. O sistema mapeia automaticamente os lançamentos e classifica suas categorias de forma inteligente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-base md:text-lg">
                Qual é a principal vantagem do Bento Grid em relação a painéis tradicionais?
              </AccordionTrigger>
              <AccordionContent>
                O Bento Grid organiza suas informações mais críticas em blocos visuais dinâmicos e assimétricos, permitindo que você arraste e reorganize os cartões exatamente de acordo com suas prioridades e rotina de análise financeira.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="rounded-3xl bg-neutral-900 dark:bg-neutral-950 text-white p-12 lg:p-20 text-center relative overflow-hidden border border-neutral-800">
            <div className="absolute inset-0 bg-radial-gradient from-primary-600/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-primary-400 uppercase tracking-widest mb-6">
                <Sparkles className="w-4 h-4" /> Pronto para começar?
              </span>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6 text-white">
                Assuma o comando total do seu dinheiro hoje mesmo.
              </h2>

              <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
                Crie sua conta em menos de 1 minuto e transforme sua relação com as finanças pessoais.
              </p>

              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-base transition-all duration-300 shadow-xl"
              >
                Criar conta gratuita
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black text-sm text-neutral-600 dark:text-neutral-400">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold font-display text-neutral-900 dark:text-white">FinControl</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                Plataforma técnica de gestão financeira pessoal e controle patrimonial.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Produto</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#capabilities" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#how-it-works" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Planos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Institucional</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="/support" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Suporte</a></li>
                <li><a href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Privacidade & Segurança</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><span className="text-neutral-400 dark:text-neutral-600">Criptografia AES-256</span></li>
                <li><span className="text-neutral-400 dark:text-neutral-600">Conformidade LGPD</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-500">
            <p>© {new Date().getFullYear()} FinControl. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-500" />
              <span>Status: Operacional</span>
            </div>
          </div>
        </div>
      </footer>
    </PageTransition>
  )
}

export default Landing
