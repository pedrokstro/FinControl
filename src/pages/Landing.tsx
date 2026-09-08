import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
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
  Menu,
  X,
  Wallet,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Bell,
  Target,
  Landmark,
} from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'
import ScrollToTop from '@/components/common/ScrollToTop'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

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

// Visualizador Interativo - Passo I: Conexão e Centralização de Contas
const StepAccountsPreview = () => {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Patrimônio Consolidado</span>
          <div className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">R$ 24.850,00</div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-400 bg-success-500/10 border border-success-500/20 px-2.5 py-1 rounded-full">
          <ArrowUpRight className="w-3.5 h-3.5" /> +5.4% mês
        </span>
      </div>

      <div className="space-y-2 sm:space-y-2.5">
        <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-white">Conta Principal</div>
              <div className="text-[11px] text-neutral-400">Nubank • Conta Corrente</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-bold text-white">R$ 14.850,00</div>
            <span className="inline-flex items-center gap-1 text-[10px] text-success-400 font-medium">
              <CheckCircle2 className="w-2.5 h-2.5" /> Sincronizado
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-white">Mastercard Black</div>
              <div className="text-[11px] text-neutral-400">Limite R$ 15.000,00</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-bold text-white">R$ 3.420,00</div>
            <span className="text-[10px] text-warning-400 font-medium">Fecha em 5 dias</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-white">Reserva de Emergência</div>
              <div className="text-[11px] text-neutral-400">Rendimento 100% CDI</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-bold text-white">R$ 6.580,00</div>
            <span className="text-[10px] text-emerald-400 font-medium">+R$ 65,80 no mês</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Visualizador Interativo - Passo II: Orçamento e Regras Inteligentes
const StepBudgetPreview = () => {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Teto Mensal de Gastos</span>
            <div className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
              R$ 4.250 <span className="text-neutral-500 text-base sm:text-lg">/ R$ 6.000</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full">
            70.8% utilizado
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full" style={{ width: '70.8%' }} />
        </div>
      </div>

      <div className="space-y-3 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
        <div>
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-neutral-200">Alimentação & Supermercado</span>
            <span className="text-neutral-400">R$ 1.840 <span className="text-neutral-500">/ R$ 2.200</span></span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: '83%' }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-neutral-200">Moradia & Serviços</span>
            <span className="text-neutral-400">R$ 1.650 <span className="text-neutral-500">/ R$ 1.650</span></span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-neutral-200">Lazer & Assinaturas</span>
            <span className="text-neutral-400">R$ 760 <span className="text-neutral-500">/ R$ 1.200</span></span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-violet-400 rounded-full" style={{ width: '63%' }} />
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center gap-2.5">
        <Bell className="w-4 h-4 text-primary-400 shrink-0" />
        <p className="text-xs text-primary-200 leading-snug">
          Alerta preventivo: Você economizou R$ 350 a mais este mês em comparação com a média anterior.
        </p>
      </div>
    </div>
  )
}

// Visualizador Interativo - Passo III: Evolução e Projeção Patrimonial
const StepGrowthPreview = () => {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Meta: Reserva de Emergência</span>
            <div className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
              R$ 38.500 <span className="text-neutral-500 text-base sm:text-lg">/ R$ 50.000</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            77.0% concluído
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-primary-400 rounded-full" style={{ width: '77%' }} />
        </div>
      </div>

      {/* Mini Gráfico de Evolução */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-neutral-400 font-mono text-[11px]">Evolução Patrimonial</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% no semestre
          </span>
        </div>
        <div className="h-16 w-full flex items-end">
          <svg viewBox="0 0 300 70" className="w-full h-full text-primary-500 overflow-visible">
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 10 58 Q 60 52, 100 45 T 180 28 T 250 18 T 290 8 L 290 70 L 10 70 Z"
              fill="url(#growthGrad)"
            />
            <path
              d="M 10 58 Q 60 52, 100 45 T 180 28 T 250 18 T 290 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="290" cy="8" r="4" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5">
        <Target className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="text-xs text-emerald-200 leading-snug">
          Projeção inteligente: Mantendo os aportes mensais de R$ 2.500, você atinge o objetivo em 4 meses.
        </p>
      </div>
    </div>
  )
}

const Landing = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [activeStep, setActiveStep] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // GSAP ScrollTrigger Animations
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Barra de Progresso do Scroll no Topo
        gsap.to('.scroll-progress-bar', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.1
          }
        })

        // 2. Parallax de Fundo na Hero Section
        gsap.to('.hero-grid-bg', {
          y: 70,
          opacity: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        })

        gsap.to('.hero-glow-1', {
          y: 100,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        })

        // 3. Revelação em Lote das Capacidades
        ScrollTrigger.batch('.capability-row', {
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out', overwrite: true }
            ),
          start: 'top 85%',
          once: true
        })

        // 4. Janela de Código / Demonstração
        gsap.fromTo(
          '.workflow-window',
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#how-it-works',
              start: 'top 75%'
            }
          }
        )

        // 5. Grid de Métricas Reais
        ScrollTrigger.batch('.metric-card', {
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 30, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: 'back.out(1.2)',
                overwrite: true
              }
            ),
          start: 'top 80%',
          once: true
        })

        // 6. Planos de Preço
        gsap.fromTo(
          '.pricing-card',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.18,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#pricing',
              start: 'top 75%'
            }
          }
        )

        // 7. CTA Final
        gsap.fromTo(
          '.cta-card',
          { opacity: 0, scale: 0.96, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.cta-section',
              start: 'top 85%'
            }
          }
        )
      })
    },
    { scope: containerRef }
  )

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
      component: <StepAccountsPreview />
    },
    {
      roman: 'II',
      title: 'Automatize e Planeje',
      desc: 'Configure limites mensais, orçamentos por categoria e receba alertas preditivos antes de estourar.',
      component: <StepBudgetPreview />
    },
    {
      roman: 'III',
      title: 'Evolua seu Patrimônio',
      desc: 'Defina metas claras, acompanhe projeções automáticas com juros compostos e conquiste sua liberdade.',
      component: <StepGrowthPreview />
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
    <div ref={containerRef} className="relative">
      {/* Barra de Progresso de Leitura GSAP ScrollTrigger */}
      <div className="scroll-progress-bar fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-primary-400 to-emerald-400 z-[60] origin-left scale-x-0 pointer-events-none" />

      <PageTransition className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white selection:bg-primary-500 selection:text-white transition-colors duration-300">
        {/* Header Fixo Minimalista com Menu Mobile */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-50/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60 transition-all">
          <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1">
                <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight">FinControl</span>
                <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 dark:text-neutral-500">v2.16</span>
              </div>
            </div>

            {/* Links Desktop */}
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

            {/* Botões e Toggle Mobile */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-2.5 sm:px-3 py-1.5 sm:py-2"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/register')}
                className="hidden sm:inline-flex items-center justify-center text-xs sm:text-sm font-medium h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 transition-all duration-200 shadow-sm"
              >
                Criar conta
              </button>

              {/* Botão Hambúrguer Mobile */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Abrir menu de navegação"
                className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Menu Dropdown Mobile com Transição */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-6 py-5 space-y-4"
              >
                <div className="flex flex-col space-y-3 font-medium text-sm text-neutral-700 dark:text-neutral-300">
                  <a
                    href="#capabilities"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 hover:text-primary-600 transition-colors"
                  >
                    Recursos
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 hover:text-primary-600 transition-colors"
                  >
                    Como Funciona
                  </a>
                  <a
                    href="#metrics"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 hover:text-primary-600 transition-colors"
                  >
                    Métricas
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 hover:text-primary-600 transition-colors"
                  >
                    Planos
                  </a>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      navigate('/register')
                    }}
                    className="w-full min-h-[48px] py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    Criar conta gratuita
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Section Monumental */}
        <section className="hero-section relative min-h-[85vh] sm:min-h-[92vh] flex flex-col justify-center pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
          {/* Grid de Fundo Geométrico Hairline */}
          <div className="hero-grid-bg absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-30">
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
          <div className="hero-glow-1 absolute -top-40 right-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 -left-40 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary-600/5 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
          {/* Eyebrow com traço fino */}
          <div className="mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              <span className="w-6 sm:w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
              A plataforma definitiva para controle financeiro
            </span>
          </div>

          {/* Título Monumental Responsivo */}
          <div className="mb-8 sm:mb-14">
            <h1 className="text-[clamp(2.15rem,7.5vw,7rem)] font-bold font-display tracking-tight leading-[0.96] sm:leading-[0.92] text-neutral-900 dark:text-white">
              <span className="block">A plataforma</span>
              <span className="block">
                para{' '}
                <span className="relative inline-block text-primary-600 dark:text-primary-400">
                  <AnimatedTextCycle
                    words={['controlar', 'prosperar', 'escalar', 'conquistar']}
                    interval={3000}
                    className="inline-block"
                  />
                  <span className="absolute -bottom-1 sm:-bottom-1.5 left-0 right-0 h-1 sm:h-1.5 bg-primary-500/20 dark:bg-primary-400/30 rounded-full" />
                </span>
              </span>
              <span className="block">suas finanças.</span>
            </h1>
          </div>

          {/* Split Inferior: Subtítulo & Ações em Pílula */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-end">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Elimine o caos das planilhas. Gerencie receitas, despesas, cartões e metas com precisão técnica e simplicidade impecável.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[52px] sm:min-h-[56px] py-3.5 sm:py-4 px-6 sm:px-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold text-sm sm:text-base transition-all duration-300 group shadow-lg shadow-neutral-900/10 dark:shadow-none active:scale-98"
              >
                Começar gratuitamente
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[52px] sm:min-h-[56px] py-3.5 sm:py-4 px-6 sm:px-8 rounded-full border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 font-semibold text-sm sm:text-base transition-all duration-300 text-neutral-800 dark:text-neutral-200 active:scale-98"
              >
                Ver demonstração
              </a>
            </div>
          </div>
        </div>

        {/* Marquee Contínuo de Métricas na Base da Hero */}
        <div className="mt-14 sm:mt-20 lg:mt-28 border-y border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-950/50 py-3.5 sm:py-5 overflow-hidden">
          <div className="animate-marquee gap-6 sm:gap-12 text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                <span className="tracking-wide uppercase">{item}</span>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 01 a 04: Capacidades & Recursos */}
      <section id="capabilities" className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-12 sm:mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
              Capacidades
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
              Tudo o que você precisa.<br />
              <span className="text-neutral-400 dark:text-neutral-600">Sem complexidade desnecessária.</span>
            </h2>
          </div>

          {/* Lista Estruturada de Recursos 01-04 */}
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-neutral-200 dark:border-neutral-800">
            {capabilities.map((cap) => (
              <div
                key={cap.num}
                className="capability-row group py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center hover:bg-neutral-100/30 dark:hover:bg-neutral-950/30 transition-colors duration-300 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-xl sm:rounded-2xl"
              >
                {/* Número */}
                <div className="lg:col-span-1">
                  <span className="font-mono text-xs sm:text-sm text-neutral-400 dark:text-neutral-600 font-semibold">
                    {cap.num}
                  </span>
                </div>

                {/* Título & Descrição */}
                <div className="lg:col-span-7">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-neutral-900 dark:text-white mb-2 sm:mb-3 group-hover:translate-x-2 transition-transform duration-300">
                    {cap.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                    {cap.description}
                  </p>
                </div>

                {/* Visualizador Vetorial SVG Interativo */}
                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                  <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 shadow-sm group-hover:border-primary-500/40 transition-colors duration-300 w-full max-w-[280px]">
                    {cap.visualizer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Como Funciona: Processo em 3 Etapas (Alto Contraste) */}
      <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-neutral-900 text-white dark:bg-neutral-950 border-y border-neutral-800 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="mb-10 sm:mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-400 uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-neutral-600" />
              Processo
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white">
              Três passos simples.<br />
              <span className="text-neutral-500">Controle financeiro duradouro.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Lado Esquerdo: Abas I, II, III */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              {workflowSteps.map((step, idx) => {
                const isActive = activeStep === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 flex items-start gap-3.5 sm:gap-5 ${
                      isActive
                        ? 'bg-neutral-800/90 border-primary-500/60 text-white shadow-xl shadow-black/40'
                        : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span className="font-display text-xl sm:text-2xl font-bold text-primary-400 shrink-0 mt-0.5">
                      {step.roman}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold font-display text-white mb-1 flex items-center justify-between">
                        {step.title}
                        {isActive && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
                      
                      {isActive && (
                        <div className="mt-3 sm:mt-4 h-1 bg-neutral-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 w-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Lado Direito: Janela de Visualização / Simulação do Painel FinControl */}
            <div className="lg:col-span-7">
              <div className="workflow-window rounded-xl sm:rounded-2xl border border-neutral-800 bg-neutral-950/90 overflow-hidden shadow-2xl backdrop-blur-sm">
                {/* Barra da Janela */}
                <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-danger-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-warning-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success-500/80" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <span>FinControl • Painel Interativo</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-success-400">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success-400 animate-pulse" />
                    Ao vivo
                  </span>
                </div>

                {/* Conteúdo Visual Interativo com Transição Suave */}
                <div className="p-4 sm:p-6 md:p-8 min-h-[290px] sm:min-h-[340px] bg-neutral-950/95 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {workflowSteps[activeStep].component}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Métricas em Tempo Real */}
      <section id="metrics" className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
            <div>
              <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
                <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
                Métricas Reais
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
                Performance e confiança<br />
                <span className="text-neutral-400 dark:text-neutral-600">comprovadas em dados.</span>
              </h2>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span>Sistemas operacionais em 100% dos nós</span>
            </div>
          </div>

          {/* Grid de 4 Métricas com Divisórias Linha Fina (2 colunas no mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {liveMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="metric-card bg-white dark:bg-black p-5 sm:p-8 lg:p-10 flex flex-col justify-between hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
              >
                <div className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-neutral-900 dark:text-white mb-2 sm:mb-4">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Planos & Precificação */}
      <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-neutral-100/50 dark:bg-neutral-950/50 border-t border-neutral-200 dark:border-neutral-800 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3 sm:mb-4">
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
              Preços Transparentes
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-neutral-900 dark:text-white mb-3 sm:mb-4">
              Escolha seu nível de controle
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400">
              Sem taxas ocultas. Cancele ou altere seu plano quando desejar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`pricing-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-neutral-900 text-white dark:bg-neutral-900 border-2 border-primary-500 shadow-2xl relative overflow-hidden'
                    : 'bg-white dark:bg-black text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider py-1 sm:py-1.5 px-3 sm:px-4 rounded-bl-xl">
                    Recomendado
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-display">{plan.name}</h3>
                  </div>
                  <p className={`text-xs sm:text-sm mb-6 ${plan.highlighted ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-6 sm:mb-8">
                    <span className="text-4xl sm:text-5xl font-bold font-display">{plan.price}</span>
                    <span className={`text-xs sm:text-sm ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
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
                  className={`w-full min-h-[48px] sm:min-h-[52px] py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 active:scale-98 ${
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
      <section className="py-16 sm:py-24 lg:py-32 relative border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
              <HelpCircle className="w-4 h-4" /> Dúvidas Frequentes
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
              Tudo o que você precisa saber.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg">
              Respostas claras sobre segurança, recursos e funcionamento da plataforma.
            </p>
          </div>

          <Accordion type="single" defaultValue="faq-1" variant="card" className="space-y-3 sm:space-y-4">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-sm sm:text-base md:text-lg">
                Os meus dados financeiros estão realmente seguros?
              </AccordionTrigger>
              <AccordionContent>
                Sim, com máxima prioridade. Utilizamos criptografia de ponta a ponta (AES-256 e SSL/TLS) com infraestrutura isolada por conta. Seus registros financeiros são estritamente confidenciais e nunca são vendidos ou compartilhados com terceiros.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-sm sm:text-base md:text-lg">
                Posso usar o FinControl no celular sem precisar baixar da App Store ou Play Store?
              </AccordionTrigger>
              <AccordionContent>
                Com certeza! O FinControl foi desenvolvido com tecnologia PWA (Progressive Web App). Você pode instalá-lo diretamente pelo navegador no iOS (Safari) ou Android (Chrome), criando um ícone na tela inicial que funciona em tela cheia com alta velocidade e suporte offline.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-sm sm:text-base md:text-lg">
                Como funciona o cancelamento do plano Pro?
              </AccordionTrigger>
              <AccordionContent>
                Você tem total liberdade. Não há contratos de fidelidade. O cancelamento pode ser feito a qualquer momento com apenas um clique diretamente na sua página de configurações, sem perguntas ou burocracia.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-sm sm:text-base md:text-lg">
                Consigo importar extratos bancários e faturas de cartão?
              </AccordionTrigger>
              <AccordionContent>
                Sim! Você pode importar arquivos nos formatos OFX, CSV e Excel gerados por qualquer instituição bancária. O sistema mapeia automaticamente os lançamentos e classifica suas categorias de forma inteligente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-sm sm:text-base md:text-lg">
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
      <section className="cta-section py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="cta-card rounded-2xl sm:rounded-3xl bg-neutral-900 dark:bg-neutral-950 text-white p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden border border-neutral-800">
            <div className="absolute inset-0 bg-radial-gradient from-primary-600/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-primary-400 uppercase tracking-widest mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4" /> Pronto para começar?
              </span>

              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 sm:mb-6 text-white">
                Assuma o comando total do seu dinheiro hoje mesmo.
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-neutral-400 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
                Crie sua conta em menos de 1 minuto e transforme sua relação com as finanças pessoais.
              </p>

              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[52px] sm:min-h-[56px] py-3.5 sm:py-4 px-8 sm:px-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm sm:text-base transition-all duration-300 shadow-xl active:scale-98"
              >
                Criar conta gratuita
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black text-sm text-neutral-600 dark:text-neutral-400">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
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
              <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white mb-3">Produto</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#capabilities" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#how-it-works" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Planos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white mb-3">Institucional</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="/support" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Suporte</a></li>
                <li><a href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white mb-3">Privacidade</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacidade</a></li>
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
      <ScrollToTop />
    </PageTransition>
    </div>
  )
}

export default Landing
