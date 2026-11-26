import { lazy, Suspense, useMemo, useState, useEffect, useCallback } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { useAuthStore } from '@/store/authStore'
import {
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Target,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  FolderOpen,
  CreditCard,
  CalendarClock,
  Percent,
  LogOut,
  Sun,
  Moon,
  Wallet,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks'
import PageHeader from '@/components/common/PageHeader'
import TransactionLimitBanner from '@/components/common/TransactionLimitBanner'
import TransactionFormModal from '@/components/transactions/TransactionFormModal'
const Calculator = lazy(() => import('@/components/Calculator'))
const SetSavingsGoalModal = lazy(() => import('@/components/modals/SetSavingsGoalModal'))
const ConfirmDeleteGoalModal = lazy(() => import('@/components/modals/ConfirmDeleteGoalModal'))
const TransactionLimitModal = lazy(() => import('@/components/modals/TransactionLimitModal'))
const MonthTransactionsListModal = lazy(() => import('@/components/dashboard/MonthTransactionsListModal'))
const MobileDashboardSections = lazy(() => import('@/components/dashboard/MobileDashboardSections'))
const DesktopAnalyticsColumn = lazy(() => import('@/components/dashboard/DesktopAnalyticsColumn'))
import Footer from '@/components/layout/Footer'
import savingsGoalService, { SavingsGoal } from '@/services/savingsGoal.service'
import analyticsService, { type AnalyticsData } from '@/services/analytics.service'
import dashboardService, { type DashboardCard } from '@/services/dashboard.service'
import { useTransactionLimit } from '@/hooks/useTransactionLimit'
import { toast } from 'react-hot-toast'
import { format, startOfMonth, endOfMonth, subMonths, getMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import CategoryIcon from '@/components/common/CategoryIcon'
import { type IconName } from '@/utils/iconMapping'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { haptics } from '@/utils/haptics'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import {
  MobileCategoryBreakdown,
  MobileBudgetsCarousel,
  MobileMonthlyHistoryCard,
  MobileYearlyAccumulatedCard,
} from '@/components/dashboard/mobile'



const Dashboard = () => {
  const transactions = useFinancialStore((s) => s.transactions)
  const categories = useFinancialStore((s) => s.categories)
  const budgets = useFinancialStore((s) => s.budgets)
  const syncWithBackend = useFinancialStore((s) => s.syncWithBackend)
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [quickAddType, setQuickAddType] = useState<'income' | 'expense'>('expense')
  const isMobile = useIsMobile()
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([])

  const [showCalculator, setShowCalculator] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false)
  const [currentGoal, setCurrentGoal] = useState<SavingsGoal | null>(null)
  const [isLoadingGoal, setIsLoadingGoal] = useState(true)
  const [isDeletingGoal, setIsDeletingGoal] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true)
  const [analyticsEmpty, setAnalyticsEmpty] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { usage, refreshUsage } = useTransactionLimit()
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [desktopAnalyticsOpen, setDesktopAnalyticsOpen] = useState(false)

  // Estado para controlar mês/ano selecionado
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date()
    return { month: now.getMonth() + 1, year: now.getFullYear() }
  })

  // Carregar dados de analytics
  const loadAnalytics = async () => {
    try {
      setIsLoadingAnalytics(true)
      setAnalytics(null)
      setAnalyticsEmpty(false)

      const data = await analyticsService.getAll(selectedDate.month, selectedDate.year)

      const hasSavingsData =
        !!data?.savingsRate &&
        (data.savingsRate.income > 0 || data.savingsRate.expense > 0 || data.savingsRate.savings > 0 || data.savingsRate.savingsRate > 0)

      const hasChartsData = Boolean(
        data?.dailyCashFlow?.length ||
        data?.topExpenses?.length ||
        data?.expensesByWeekday?.length ||
        data?.budgetVsActual?.length ||
        hasSavingsData
      )

      if (hasChartsData) {
        setAnalytics(data)
        setAnalyticsEmpty(false)
      } else {
        setAnalytics(null)
        setAnalyticsEmpty(true)
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
      setAnalytics(null)
      setAnalyticsEmpty(true)
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  // Sincronizar com backend ao carregar o dashboard
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([syncWithBackend(), loadCurrentGoal()])
    }
    loadData()
  }, [syncWithBackend])

  // Recarregar analytics quando mudar o mês/ano selecionado
  useEffect(() => {
    loadAnalytics()
  }, [selectedDate])

  // Carregar cards de aviso dinâmicos apenas na versão mobile
  useEffect(() => {
    if (!isMobile) return

    const loadCards = async () => {
      try {
        const cards = await dashboardService.getCards()
        setDashboardCards(cards)
      } catch (error) {
        console.error('Erro ao carregar cards do dashboard:', error)
      }
    }
    loadCards()
  }, [isMobile])

  // Recarregar meta quando mudar o mês/ano selecionado
  useEffect(() => {
    loadCurrentGoal()
  }, [selectedDate])

  // Funções de navegação de mês/ano
  const goToPreviousMonth = () => {
    setSelectedDate(prev => {
      if (prev.month === 1) {
        return { month: 12, year: prev.year - 1 }
      }
      return { month: prev.month - 1, year: prev.year }
    })
  }

  const goToNextMonth = () => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // Não permitir navegar para o futuro
    if (selectedDate.year === currentYear && selectedDate.month === currentMonth) {
      return
    }

    setSelectedDate(prev => {
      if (prev.month === 12) {
        return { month: 1, year: prev.year + 1 }
      }
      return { month: prev.month + 1, year: prev.year }
    })
  }

  const goToCurrentMonth = () => {
    const now = new Date()
    setSelectedDate({ month: now.getMonth() + 1, year: now.getFullYear() })
  }

  const isCurrentMonth = () => {
    const now = new Date()
    return selectedDate.month === now.getMonth() + 1 && selectedDate.year === now.getFullYear()
  }

  // Carregar meta do mês/ano selecionado
  const loadCurrentGoal = async () => {
    try {
      setIsLoadingGoal(true)
      const goal = await savingsGoalService.getGoalByMonthYear(selectedDate.month, selectedDate.year)
      setCurrentGoal(goal)
    } catch (error) {
      console.error('Erro ao carregar meta:', error)
    } finally {
      setIsLoadingGoal(false)
    }
  }

  // Abrir modal de confirmação de exclusão
  const handleDeleteGoal = () => {
    if (!currentGoal) return
    setShowDeleteGoalModal(true)
  }

  // Confirmar exclusão da meta
  const confirmDeleteGoal = async () => {
    if (!currentGoal) return

    setIsDeletingGoal(true)

    try {
      await savingsGoalService.deleteGoal(currentGoal.id)
      setCurrentGoal(null)
      toast.success('Meta excluída com sucesso!')
    } catch (error: any) {
      console.error('Erro ao deletar meta:', error)
      toast.error(error.response?.data?.message || 'Erro ao deletar meta')
    } finally {
      setIsDeletingGoal(false)
    }
  }

  const openQuickAdd = useCallback((type: 'income' | 'expense' = 'expense') => {
    setQuickAddType(type)
    setShowQuickAdd(true)
  }, [])

  useEffect(() => {
    const quickAddParam = searchParams.get('quickAdd')
    if (quickAddParam) {
      const type = quickAddParam === 'income' ? 'income' : 'expense'
      openQuickAdd(type)
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('quickAdd')
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams, openQuickAdd])

  const closeQuickAdd = useCallback(() => {
    setShowQuickAdd(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignorar se estiver digitando em um input, textarea ou modal aberto
      const target = e.target as HTMLElement
      const isTyping = target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Não executar atalhos se estiver digitando ou se algum modal estiver aberto
      if (isTyping || showQuickAdd || showCalculator) {
        return
      }

      // Atalho: + para adicionar receita
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        openQuickAdd('income')
      }

      // Atalho: - para adicionar despesa
      if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        openQuickAdd('expense')
      }

      // Atalho: C para abrir calculadora
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        setShowCalculator(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showQuickAdd, showCalculator])

  // Filtrar transações pelo mês/ano selecionado
  const selectedMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.date) return false
      const tDate = parseISO(t.date)
      return tDate.getFullYear() === selectedDate.year && tDate.getMonth() + 1 === selectedDate.month
    })
  }, [transactions, selectedDate])

  const financialSummary = useMemo(() => {
    const monthIncome = selectedMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthExpense = selectedMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthBalance = monthIncome - monthExpense

    return {
      monthIncome,
      monthExpense,
      monthBalance,
    }
  }, [selectedMonthTransactions])


  const incomeTransactions = useMemo(() => {
    return [...selectedMonthTransactions]
      .filter((t) => t.type === 'income')
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
  }, [selectedMonthTransactions])

  const expenseTransactions = useMemo(() => {
    return [...selectedMonthTransactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
  }, [selectedMonthTransactions])

  const monthlyData = useMemo(() => {
    const data = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)

      const monthTransactions = transactions.filter((t) => {
        const tDate = parseISO(t.date)
        return tDate >= monthStart && tDate <= monthEnd
      })

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      data.push({
        month: format(date, 'MMM', { locale: ptBR }),
        receitas: income,
        despesas: expense,
      })
    }
    return data
  }, [transactions])

  // Novo: Dados para o grafico de barras mensal completo
  const yearlyMonthlyData = useMemo(() => {
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

    // Agrupar transacoes por mes
    const monthlyTotals: { [key: number]: { income: number; expense: number } } = {}

    // Inicializar todos os meses com 0
    for (let i = 0; i < 12; i++) {
      monthlyTotals[i] = { income: 0, expense: 0 }
    }

    // Calcular totais de cada mes usando o ano selecionado
    transactions.forEach((t) => {
      const tDate = parseISO(t.date)
      if (tDate.getFullYear() !== selectedDate.year) {
        return
      }
      const tMonth = getMonth(tDate)

      // Agrupar apenas meses do ano selecionado
      if (t.type === 'income') {
        monthlyTotals[tMonth].income += t.amount
      } else {
        monthlyTotals[tMonth].expense += t.amount
      }
    })

    // Transformar em array para o grafico
    return monthNames.map((name, index) => ({
      month: name,
      receitas: monthlyTotals[index].income,
      despesas: monthlyTotals[index].expense,
      saldo: monthlyTotals[index].income - monthlyTotals[index].expense
    }))
  }, [transactions, selectedDate.year])

  const categoryData = useMemo(() => {
    const allCategories = categories.map((cat) => {
      const transactions_by_category = selectedMonthTransactions.filter(
        (t) => t.categoryId === cat.id && t.type === cat.type
      )

      const total = transactions_by_category.reduce((sum, t) => sum + t.amount, 0)

      return {
        name: cat.name,
        value: total,
        color: cat.color,
        type: cat.type, // 'income' ou 'expense'
      }
    }).filter((item) => item.value > 0)

    return allCategories
  }, [selectedMonthTransactions, categories])

  const recentTransactions = useMemo(() => {
    const sorted = [...selectedMonthTransactions].sort(
      (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
    )

    const grouped: any[] = []
    const seen = new Set<string>()

    sorted.forEach((transaction) => {
      const isPartOfRecurrence = transaction.isRecurring || !!transaction.parentTransactionId
      if (isPartOfRecurrence) {
        const groupId = transaction.parentTransactionId || transaction.id
        if (seen.has(groupId)) {
          return
        }

        const installments = sorted.filter(
          (t) =>
            (t.parentTransactionId === groupId || t.id === groupId) &&
            t.description === transaction.description &&
            t.amount === transaction.amount &&
            t.type === transaction.type
        )

        grouped.push({
          ...transaction,
          recurrenceInstallments: installments.length,
        })
        seen.add(groupId)
      } else if (!transaction.parentTransactionId) {
        grouped.push(transaction)
      }
    })

    const listToDisplay = grouped.length > 0 ? grouped : sorted
    const limit = Math.min(selectedMonthTransactions.length, 6)

    return listToDisplay.slice(0, limit || 5)
  }, [selectedMonthTransactions])


  // Dados para o Line Chart (Saldo Acumulado)
  const accumulatedBalanceData = useMemo(() => {
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    let accumulated = 0

    return monthNames.map((name, index) => {
      const monthData = yearlyMonthlyData[index]
      accumulated += monthData.saldo

      return {
        month: name,
        saldoAcumulado: accumulated,
        saldoMensal: monthData.saldo
      }
    })
  }, [yearlyMonthlyData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (value: string) => {
    try {
      return format(parseISO(value), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return value
    }
  }

  const lastMonthSummary = useMemo(() => {
    let prevMonth = selectedDate.month - 1
    let prevYear = selectedDate.year
    if (prevMonth === 0) {
      prevMonth = 12
      prevYear = selectedDate.year - 1
    }

    const prevTransactions = transactions.filter((t) => {
      const date = parseISO(t.date)
      return date.getFullYear() === prevYear && (date.getMonth() + 1) === prevMonth
    })

    const income = prevTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = prevTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = income - expense

    return { income, expense, balance }
  }, [transactions, selectedDate])


  const incomeTrendPercent = useMemo(() => {
    if (!lastMonthSummary.income) return financialSummary.monthIncome > 0 ? 100 : 0
    const diff = financialSummary.monthIncome - lastMonthSummary.income
    return Math.round((diff / lastMonthSummary.income) * 100)
  }, [financialSummary.monthIncome, lastMonthSummary.income])

  const expenseTrendPercent = useMemo(() => {
    if (!lastMonthSummary.expense) return financialSummary.monthExpense > 0 ? 100 : 0
    const diff = financialSummary.monthExpense - lastMonthSummary.expense
    return Math.round((diff / lastMonthSummary.expense) * 100)
  }, [financialSummary.monthExpense, lastMonthSummary.expense])


  return (
    <div className="responsive-page">

      {/* Cabeçalho Desktop Limpo + Seletor de Período */}
      <div className="hidden sm:block mb-6">
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral do seu mês financeiro"
          actions={
            <div className="bg-white dark:bg-neutral-900 rounded-full px-3 py-1.5 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  goToPreviousMonth()
                }}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.92] rounded-full text-neutral-600 dark:text-neutral-300 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-2">
                <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-semibold capitalize tracking-wide text-neutral-900 dark:text-white font-display whitespace-nowrap">
                  {format(new Date(selectedDate.year, selectedDate.month - 1), 'MMMM yyyy', { locale: ptBR })}
                </span>
              </div>

              {!isCurrentMonth() && (
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    goToCurrentMonth()
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 active:scale-[0.95] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
                >
                  Hoje
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  goToNextMonth()
                }}
                disabled={isCurrentMonth()}
                className={`p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  isCurrentMonth() ? 'opacity-30 cursor-not-allowed' : 'active:scale-[0.92] cursor-pointer'
                }`}
                title="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          }
        />
      </div>

      {/* Header Premium Mobile (Inspirado no estilo nativo de referência) */}
      {isMobile && (
        <div className="block sm:hidden -mx-4 mb-6 !mt-0 select-none">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#025ec2] via-[#0284c7] to-[#0369a1] dark:from-[#090d16] dark:via-[#0e1726] dark:to-[#050811] rounded-b-[36px] pt-[calc(1.25rem+env(safe-area-inset-top))] px-4 pb-6 text-white shadow-xl shadow-primary-950/25 dark:shadow-2xl dark:shadow-black/70 border-b border-white/10 dark:border-white/5">
            {/* Elementos de Fundo com Mesh Aurora Glow e Micro-animações Orgânicas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              {/* Orb 1: Luz Ciano / Celeste no topo direito */}
              <motion.div
                initial={false}
                animate={{
                  x: [0, 16, 0],
                  y: [0, -10, 0],
                  scale: [1, 1.12, 1],
                  opacity: [0.35, 0.5, 0.35],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-300/80 dark:bg-cyan-500/20 blur-3xl transform-gpu pointer-events-none"
              />

              {/* Orb 2: Luz Índigo profundo no canto inferior esquerdo */}
              <motion.div
                initial={false}
                animate={{
                  x: [0, -12, 0],
                  y: [0, 12, 0],
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.45, 0.3],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-700/80 dark:bg-indigo-600/25 blur-3xl transform-gpu pointer-events-none"
              />

              {/* Orb 3: Luz central suave para respiro do saldo */}
              <motion.div
                initial={false}
                animate={{
                  scale: [0.95, 1.08, 0.95],
                  opacity: [0.15, 0.28, 0.15],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-sky-200/60 dark:bg-sky-400/10 blur-2xl transform-gpu pointer-events-none"
              />

              {/* Camada de Gradiente Angular de Vidro / Shimmer Sutil (opacidade direta sem blend mode pesado) */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/[0.04] via-transparent to-black/10 dark:to-black/30 pointer-events-none" />

              {/* Linha de reflexo especular na base do cartão */}
              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Conteúdo em primeiro plano */}
            <div className="relative z-10">
              {/* 1. Barra Superior: Usuário / Saudação e Notificações */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    navigate('/app/settings')
                  }}
                  className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 dark:border-white/20 bg-white/20 dark:bg-white/10 flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm"
                  title="Perfil e Configurações"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </button>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs text-white/80 dark:text-neutral-400 font-normal truncate">
                    {(() => {
                      const hour = new Date().getHours()
                      if (hour < 12) return 'Bom dia'
                      if (hour < 18) return 'Boa tarde'
                      return 'Boa noite'
                    })()}
                  </span>
                  <span className="text-base font-bold text-white leading-tight font-display tracking-tight truncate">
                    {user?.name || 'Usuário'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Centro: Saldo do Mês e Cápsula de Período */}
            <div className="text-center my-4">
              <span className="text-xs text-white/80 dark:text-neutral-400 font-medium tracking-wide">
                Saldo do Mês
              </span>
              <div className="my-1.5 flex items-center justify-center">
                <AnimatedCounter
                  value={financialSummary.monthBalance}
                  prefix="R$ "
                  className="text-4xl sm:text-5xl font-black tracking-tight font-display text-white leading-none drop-shadow-sm"
                />
              </div>

              {/* Cápsula de Navegação de Período (Posicionada exatamente abaixo do saldo como no design de referência) */}
              <div className="flex items-center justify-center mt-2.5">
                <div className="bg-white/15 dark:bg-white/[0.08] backdrop-blur-md rounded-full px-3 py-1 border border-white/20 dark:border-white/10 flex items-center gap-1.5 shadow-sm text-white">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light()
                      goToPreviousMonth()
                    }}
                    className="p-1 hover:bg-white/20 dark:hover:bg-white/10 active:scale-90 rounded-full text-white transition-all focus:outline-none"
                    title="Mês anterior"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 px-1.5">
                    <Calendar className="w-3 h-3 text-white/80 dark:text-neutral-300" />
                    <span className="text-xs font-semibold capitalize tracking-wide text-white font-display">
                      {format(new Date(selectedDate.year, selectedDate.month - 1), 'MMMM yyyy', { locale: ptBR })}
                    </span>
                  </div>

                  {!isCurrentMonth() && (
                    <button
                      type="button"
                      onClick={() => {
                        haptics.light()
                        goToCurrentMonth()
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white dark:bg-neutral-800 text-primary-700 dark:text-neutral-200 border border-transparent dark:border-white/10 shadow-sm active:scale-95 transition-transform"
                    >
                      Hoje
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      haptics.light()
                      goToNextMonth()
                    }}
                    disabled={isCurrentMonth()}
                    className={`p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded-full text-white transition-all focus:outline-none ${
                      isCurrentMonth() ? 'opacity-30 cursor-not-allowed' : 'active:scale-90'
                    }`}
                    title="Próximo mês"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Atalhos Rápidos Mobile (Estilo Nubank) */}
      {isMobile && (
        <div className="block sm:hidden -mx-4 px-4 overflow-x-auto flex gap-4 py-3 mb-4 scrollbar-none">
          {[
            { label: 'Nova Trans.', icon: Plus, onClick: () => openQuickAdd('expense'), bg: 'bg-primary-50 dark:bg-primary-950/20', iconColor: 'text-primary-600 dark:text-primary-400' },
            { label: 'Nova Cat.', icon: FolderOpen, onClick: () => navigate('/app/categories?add=true'), bg: 'bg-gray-100 dark:bg-neutral-800', iconColor: 'text-gray-700 dark:text-neutral-300' },
            { label: 'Cartões', icon: CreditCard, onClick: () => navigate('/app/cards'), bg: 'bg-gray-100 dark:bg-neutral-800', iconColor: 'text-gray-700 dark:text-neutral-300' },
            { label: 'Assinaturas', icon: CalendarClock, onClick: () => navigate('/app/subscriptions'), bg: 'bg-gray-100 dark:bg-neutral-800', iconColor: 'text-gray-700 dark:text-neutral-300' },
            { label: 'Categorias', icon: FolderOpen, onClick: () => navigate('/app/categories'), bg: 'bg-gray-100 dark:bg-neutral-800', iconColor: 'text-gray-700 dark:text-neutral-300' },
            { label: 'Calc. Juros', icon: TrendingUp, onClick: () => navigate('/app/calculadora-juros'), bg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400' },
            { label: 'Calc. %', icon: Percent, onClick: () => navigate('/app/calculadora-porcentagem'), bg: 'bg-gray-100 dark:bg-neutral-800', iconColor: 'text-gray-700 dark:text-neutral-300' },
            {
              label: 'Tema',
              icon: theme === 'dark' ? Sun : Moon,
              onClick: () => {
                haptics.light()
                toggleTheme()
              },
              bg: theme === 'dark' ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-indigo-50 dark:bg-indigo-950/30',
              iconColor: theme === 'dark' ? 'text-amber-500 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
            },
            { label: 'Sair', icon: LogOut, onClick: () => { logout() }, bg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-500' }
          ].map((action, idx) => {
            const Icon = action.icon
            return (
              <button
                key={idx}
                onClick={action.onClick}
                className="flex flex-col items-center flex-shrink-0 focus:outline-none active:scale-95 transition-transform"
              >
                <div className={`w-12 h-12 ${action.bg} rounded-full flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <span className="text-[10px] font-semibold text-gray-700 dark:text-neutral-300 mt-2 text-center whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Banner de Limite de Transações */}
      <TransactionLimitBanner />

      {/* ========================================================================= */}
      {/* VISÃO MOBILE DEDICADA (Lazy-loaded apenas quando isMobile)                */}
      {/* ========================================================================= */}
      {isMobile && (
        <Suspense fallback={null}>
          <MobileDashboardSections
            dashboardCards={dashboardCards}
            budgets={budgets}
            categories={categories}
            transactions={transactions}
            recentTransactions={recentTransactions}
            selectedDate={selectedDate}
            categoryData={categoryData}
            monthlyData={monthlyData}
            yearlyMonthlyData={yearlyMonthlyData}
            accumulatedBalanceData={accumulatedBalanceData}
            currentGoal={currentGoal}
            isLoadingGoal={isLoadingGoal}
            analytics={analytics}
            isLoadingAnalytics={isLoadingAnalytics}
            analyticsEmpty={analyticsEmpty}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onManageBudgets={() => navigate('/app/categories?manageBudgets=true')}
            onManageCategories={() => navigate('/app/categories')}
            onEditGoal={() => setShowGoalModal(true)}
            onDeleteGoal={handleDeleteGoal}
          />
        </Suspense>
      )}

      {/* ========================================================================= */}
      {/* VISÃO DESKTOP COMPLETA (Telas Grandes sm: e acima)                    */}
      {/* ========================================================================= */}
      <div className="hidden sm:block space-y-6 mb-8">
        {/* 1. Grid Único de 4 Cards no Topo: Saldo, Receitas, Despesas, Meta de Economia */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card Saldo do Mês */}
          <div className="bg-gradient-to-br from-[#025ec2] via-[#0284c7] to-[#0369a1] dark:from-[#0c1424] dark:via-[#111c33] dark:to-[#090f1d] text-white border border-white/10 dark:border-neutral-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white/95 tabular-figures">
                  {financialSummary.monthIncome > 0
                    ? `Poupança ${Math.max(Math.round(((financialSummary.monthIncome - financialSummary.monthExpense) / financialSummary.monthIncome) * 100), 0)}%`
                    : 'Resumo mensal'}
                </span>
              </div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider font-display">
                Saldo do Mês
              </span>
              <div className="mt-1">
                <AnimatedCounter
                  value={financialSummary.monthBalance}
                  prefix="R$ "
                  className="text-2xl lg:text-3xl font-black tracking-[-0.02em] tabular-figures font-display text-white"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/85">
              <span>Balanço líquido</span>
              <Link
                to="/app/transactions"
                className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 active:scale-[0.96] transition-[transform,background-color] duration-150 font-semibold text-white flex items-center gap-0.5"
              >
                <span>Extrato</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card Receitas */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowIncomeModal(true)}
                  className="px-2.5 py-1 rounded-full text-xs text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-950/30 active:scale-[0.97] transition-[transform,background-color] duration-150 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Ver todas</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display">
                Receitas do Mês
              </span>
              <div className="mt-1">
                <AnimatedCounter
                  value={financialSummary.monthIncome}
                  prefix="R$ "
                  className="text-2xl lg:text-3xl font-black tracking-[-0.02em] tabular-figures font-display text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 tabular-figures">
                {incomeTransactions.length} {incomeTransactions.length === 1 ? 'lançamento' : 'lançamentos'}
              </span>
              <span className={`font-semibold px-2 py-0.5 rounded-full tabular-figures ${
                incomeTrendPercent >= 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}>
                {incomeTrendPercent >= 0 ? '+' : ''}{incomeTrendPercent}% vs mês anterior
              </span>
            </div>
          </div>

          {/* Card Despesas */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(true)}
                  className="px-2.5 py-1 rounded-full text-xs text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-950/30 active:scale-[0.97] transition-[transform,background-color] duration-150 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Ver todas</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display">
                Despesas do Mês
              </span>
              <div className="mt-1">
                <AnimatedCounter
                  value={financialSummary.monthExpense}
                  prefix="R$ "
                  className="text-2xl lg:text-3xl font-black tracking-[-0.02em] tabular-figures font-display text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 tabular-figures">
                {expenseTransactions.length} {expenseTransactions.length === 1 ? 'saída' : 'saídas'}
              </span>
              <span className={`font-semibold px-2 py-0.5 rounded-full tabular-figures ${
                expenseTrendPercent <= 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {expenseTrendPercent >= 0 ? '+' : ''}{expenseTrendPercent}% vs mês anterior
              </span>
            </div>
          </div>

          {/* Card Meta de Economia */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      haptics.light()
                      setShowGoalModal(true)
                    }}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.94] rounded-full text-neutral-500 dark:text-neutral-400 transition-[transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
                    title={currentGoal ? 'Editar meta' : 'Definir meta'}
                  >
                    {currentGoal ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                  {currentGoal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        haptics.light()
                        handleDeleteGoal()
                      }}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-[0.94] rounded-full text-rose-500 dark:text-rose-400 transition-[transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                      title="Excluir meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display">
                Meta de Economia
              </span>

              {currentGoal ? (
                <>
                  <div className="mt-1">
                    <AnimatedCounter
                      value={currentGoal.targetAmount}
                      prefix="R$ "
                      className="text-2xl lg:text-3xl font-black tracking-[-0.02em] tabular-figures font-display text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium">Progresso</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 font-mono tabular-figures">
                        {formatCurrency(currentGoal.currentAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`w-full h-full rounded-full origin-left transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          currentGoal.currentAmount >= currentGoal.targetAmount
                            ? 'bg-emerald-500'
                            : 'bg-primary-500'
                        }`}
                        style={{
                          transform: `scaleX(${Math.min(Math.max(currentGoal.currentAmount / currentGoal.targetAmount, 0), 1)})`,
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setShowGoalModal(true)
                  }}
                  className="mt-2 py-2 text-left w-full rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 active:scale-[0.98] transition-[transform,background-color] duration-150 px-2 -mx-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <p className="text-base font-bold text-neutral-500 dark:text-neutral-400 font-display">
                    Sem meta definida
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-1">
                    Definir meta de economia para o mês
                  </p>
                </button>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">
                {currentGoal ? (currentGoal.currentAmount >= currentGoal.targetAmount ? 'Meta atingida!' : 'Em andamento') : 'Planejamento'}
              </span>
              {currentGoal && (
                <span className={`font-semibold px-2 py-0.5 rounded-full tabular-figures ${
                  currentGoal.currentAmount >= currentGoal.targetAmount
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                }`}>
                  {Math.round((currentGoal.currentAmount / currentGoal.targetAmount) * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Seções Centrais em Grid Balanceado Desktop (2 Colunas com os Mesmos Widgets Refinados) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Coluna 1: Categorias, Orçamentos e Transações Recentes */}
          <div className="space-y-6">
            {/* Gastos por Categoria (Estilo MobileCategoryBreakdown com barra multi-segmentada) */}
            <MobileCategoryBreakdown
              data={categoryData}
              formatCurrency={formatCurrency}
              onManageCategories={() => navigate('/app/categories')}
            />

            {/* Meus Limites / Orçamentos em Grid Responsivo */}
            <MobileBudgetsCarousel
              budgets={budgets}
              categories={categories}
              transactions={transactions}
              selectedDate={selectedDate}
              formatCurrency={formatCurrency}
              onManageBudgets={() => navigate('/app/categories?manageBudgets=true')}
            />

            {/* Transações Recentes Desktop no Estilo Mobile */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Transações Recentes
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Últimas movimentações no período
                  </p>
                </div>
                <Link
                  to="/app/transactions"
                  className="px-2.5 py-1 rounded-full text-xs text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-950/30 active:scale-[0.97] transition-[transform,background-color] duration-150 flex items-center gap-0.5"
                >
                  <span>Ver todas</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentTransactions.length > 0 ? (
                <div className="space-y-2.5">
                  {recentTransactions.slice(0, 6).map((transaction) => {
                    const category = categories.find((c) => c.id === transaction.categoryId);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              transaction.type === 'income'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {category ? (
                              <CategoryIcon
                                icon={category.icon as IconName}
                                color={category.color}
                                size="sm"
                              />
                            ) : transaction.type === 'income' ? (
                              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                              {transaction.description}
                            </p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                              {transaction.category} • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-bold font-mono text-xs tabular-figures shrink-0 ml-3 ${
                            transaction.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-neutral-400 dark:text-neutral-500">
                  Nenhuma transação registrada no período
                </div>
              )}
            </div>

            {/* Cards de Análises & Insights Avançados distribuídos na Coluna 1 quando expandido */}
            <AnimatePresence>
              {desktopAnalyticsOpen && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-6"
                >
                  <Suspense fallback={null}>
                    <DesktopAnalyticsColumn
                      column="left"
                      analytics={analytics}
                      isLoading={isLoadingAnalytics}
                      isEmpty={analyticsEmpty}
                      formatCurrency={formatCurrency}
                    />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Coluna 2: Histórico Mensal, Resumo Anual e Análises Avançadas */}
          <div className="space-y-6">
            {/* Histórico Mensal Touch com Alternador Saldo / Fluxo */}
            <MobileMonthlyHistoryCard
              data={monthlyData}
              formatCurrency={formatCurrency}
            />

            {/* Resumo Anual e Curva Patrimonial Acumulada */}
            <MobileYearlyAccumulatedCard
              yearlyData={yearlyMonthlyData}
              accumulatedData={accumulatedBalanceData}
              formatCurrency={formatCurrency}
            />

            {/* Card de Controle de Análises & Insights Avançados Desktop */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setDesktopAnalyticsOpen(!desktopAnalyticsOpen)
                }}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 active:scale-[0.99] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Análises & Insights Avançados
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Fluxo diário, taxa de poupança e projeções
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 tabular-figures">
                    {desktopAnalyticsOpen ? 'Ocultar' : 'Explorar (5)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      desktopAnalyticsOpen ? 'rotate-180 text-primary-500' : ''
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Cards de Análises & Insights Avançados distribuídos na Coluna 2 quando expandido */}
            <AnimatePresence>
              {desktopAnalyticsOpen && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-6"
                >
                  <Suspense fallback={null}>
                    <DesktopAnalyticsColumn
                      column="right"
                      analytics={analytics}
                      isLoading={isLoadingAnalytics}
                      isEmpty={analyticsEmpty}
                      formatCurrency={formatCurrency}
                    />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <TransactionFormModal
        isOpen={showQuickAdd}
        onClose={closeQuickAdd}
        initialType={quickAddType}
        showQuickAmountPresets={true}
        onSaved={refreshUsage}
        onLimitReached={() => setShowLimitModal(true)}
      />
      <Suspense fallback={null}>
      {/* Calculator Modal */}
      <Calculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />

      {/* Savings Goal Modal */}
      <SetSavingsGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSuccess={loadCurrentGoal}
        currentGoal={currentGoal}
      />

      {/* Confirm Delete Goal Modal */}
      <ConfirmDeleteGoalModal
        isOpen={showDeleteGoalModal}
        onClose={() => setShowDeleteGoalModal(false)}
        onConfirm={confirmDeleteGoal}
        goalAmount={currentGoal?.targetAmount || 0}
        isLoading={isDeletingGoal}
      />
      </Suspense>

      {/* Modais de Receitas e Despesas do Mês (Unificado e Lazy) */}
      <Suspense fallback={null}>
        <MonthTransactionsListModal
          isOpen={showIncomeModal}
          onClose={() => setShowIncomeModal(false)}
          type="income"
          transactions={incomeTransactions}
          categories={categories}
          totalAmount={financialSummary.monthIncome}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
        <MonthTransactionsListModal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          type="expense"
          transactions={expenseTransactions}
          categories={categories}
          totalAmount={financialSummary.monthExpense}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </Suspense>

      <Suspense fallback={null}>
      {/* Transaction Limit Modal */}
      <TransactionLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        usage={usage}
      />
      </Suspense>

      {/* Footer (Apenas Desktop) */}
      <div className="mt-12 hidden md:block">
        <Footer />
      </div>
    </div >
  )
}

export default Dashboard
