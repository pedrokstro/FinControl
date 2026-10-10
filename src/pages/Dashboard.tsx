import { useMemo, useState, useEffect, useCallback } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { useAuthStore } from '@/store/authStore'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  Loader2,
  Repeat,
  Edit3,
  Trash2,
  BarChart3,
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
  Moon
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks'
import Calculator from '@/components/Calculator'
import SetSavingsGoalModal from '@/components/modals/SetSavingsGoalModal'
import ConfirmDeleteGoalModal from '@/components/modals/ConfirmDeleteGoalModal'
import TransactionLimitBanner from '@/components/common/TransactionLimitBanner'
import TransactionLimitModal from '@/components/modals/TransactionLimitModal'
import Footer from '@/components/layout/Footer'
import savingsGoalService, { SavingsGoal } from '@/services/savingsGoal.service'
import analyticsService, { type AnalyticsData } from '@/services/analytics.service'
import dashboardService, { type DashboardCard } from '@/services/dashboard.service'
import { useTransactionLimit } from '@/hooks/useTransactionLimit'
import * as LucideIcons from 'lucide-react'
import {
  CashFlowChart,
  TopExpensesChart,
  SavingsRateChart,
  ExpensesByWeekdayChart,
  BudgetVsActualChart,
} from '@/components/charts/AdvancedCharts'
import { toast } from 'react-hot-toast'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line
} from 'recharts'
import { format, startOfMonth, endOfMonth, subMonths, getMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import CategoryIcon from '@/components/common/CategoryIcon'
import CategorySelect from '@/components/common/CategorySelect'
import CustomDatePicker from '@/components/common/CustomDatePicker'
import CustomSelect from '@/components/common/CustomSelect'
import { type IconName } from '@/utils/iconMapping'
import Modal from '@/components/common/Modal'
import NativeBottomSheet from '@/components/common/NativeBottomSheet'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import BudgetProgressBar from '@/components/common/BudgetProgressBar'
import { motion, AnimatePresence } from 'framer-motion'
import BrandIcon from '@/components/common/BrandIcon'
import { haptics } from '@/utils/haptics'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import InteractiveDataCard from '@/components/dashboard/InteractiveDataCard'
import {
  MobileCategoryBreakdown,
  MobileBudgetsCarousel,
  MobileMonthlyHistoryCard,
  MobileYearlyAccumulatedCard,
  MobileSavingsGoalCard,
  MobileAnalyticsAccordion,
  MobileCashFlowCard,
  MobileSavingsRateCard,
  MobileTopExpensesCard,
  MobileWeekdayExpensesCard,
  MobileBudgetVsActualCard,
} from '@/components/dashboard/mobile'

const RADIAN = Math.PI / 180

type PieLabelProps = {
  cx: number
  cy: number
  midAngle: number
  outerRadius: number
  percent?: number
  name?: string
  fill?: string
  payload?: {
    name?: string
    color?: string
  }
}

const renderCategoryLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent = 0,
  name = '',
  fill = '#111827',
  payload,
}: PieLabelProps) => {
  const resolvedName = payload?.name ?? name
  const textColor = payload?.color ?? fill
  const radius = outerRadius + (percent < 0.08 ? 28 : 18)
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const isRightSide = x > cx
  const anchor = isRightSide ? 'start' : 'end'
  const percentLabel = percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''

  return (
    <text
      x={x}
      y={y}
      fill={textColor}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontSize={12}
      fontWeight={600}
    >
      <tspan x={x} dy="-0.3em">
        {resolvedName}
      </tspan>
      {percentLabel && (
        <tspan x={x} dy="1.2em" fill="#111827">
          {percentLabel}
        </tspan>
      )}
    </text>
  )
}

const transactionSchema = z
  .object({
    type: z.enum(['income', 'expense']),
    amount: z.string().min(1, 'Valor e obrigatorio'),
    categoryId: z.string().min(1, 'Categoria e obrigatoria'),
    description: z.string().min(3, 'Descricao deve ter no minimo 3 caracteres'),
    date: z.string().min(1, 'Data e obrigatoria'),
    isRecurring: z.boolean().optional(),
    recurrenceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    totalInstallments: z.string().optional(),
    creditCardId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      if (!data.recurrenceType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['recurrenceType'],
          message: 'Selecione a frequência',
        })
      }

      // Validação do número de parcelas (opcional para tempo indeterminado)
      if (data.totalInstallments) {
        const installments = parseInt(data.totalInstallments)
        if (isNaN(installments) || installments < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['totalInstallments'],
            message: 'Mínimo de 2 parcelas',
          })
        } else if (installments > 360) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['totalInstallments'],
            message: 'Máximo de 360 parcelas',
          })
        }
      }
    }
  })

type TransactionFormData = z.infer<typeof transactionSchema>

const Dashboard = () => {
  const {
    transactions,
    categories,
    budgets,
    addTransaction,
    syncWithBackend,
    isCreatingTransaction,
    creditCards,
    fetchCreditCards
  } = useFinancialStore()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const isMobile = useIsMobile()
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([])

  useEffect(() => {
    fetchCreditCards()
  }, [fetchCreditCards])
  const [showCalculator, setShowCalculator] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false)
  const [currentGoal, setCurrentGoal] = useState<SavingsGoal | null>(null)
  const [isLoadingGoal, setIsLoadingGoal] = useState(true)
  const [isDeletingGoal, setIsDeletingGoal] = useState(false)
  const [isQuickAddRecurring, setIsQuickAddRecurring] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true)
  const [analyticsEmpty, setAnalyticsEmpty] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { usage, checkLimit, refreshUsage } = useTransactionLimit()
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

  // Carregar cards de aviso dinâmicos do banco de dados
  useEffect(() => {
    const loadCards = async () => {
      try {
        const cards = await dashboardService.getCards()
        setDashboardCards(cards)
      } catch (error) {
        console.error('Erro ao carregar cards do dashboard:', error)
      }
    }
    loadCards()
  }, [])

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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: (() => {
        const today = new Date()
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      })(),
    },
  })

  const transactionType = watch('type')

  const openQuickAdd = useCallback((type: 'income' | 'expense' = 'expense') => {
    // Obter data de hoje sem timezone
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    console.log('🔄 [DEBUG] Abrindo Quick Add com data:', todayString, 'tipo:', type);

    reset({
      type: type,
      amount: '',
      categoryId: '',
      description: '',
      date: todayString,
      creditCardId: '',
    })
    setShowQuickAdd(true)
  }, [reset])

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

  const quickAmountPresets = [50, 100, 250, 500]

  const closeQuickAdd = () => {
    setShowQuickAdd(false)
    setIsQuickAddRecurring(false)

    const today = new Date()
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    reset({
      type: 'expense',
      amount: '',
      categoryId: '',
      description: '',
      date: todayString,
      isRecurring: false,
      recurrenceType: undefined,
      totalInstallments: '',
      creditCardId: '',
    })
  }

  const handleQuickAddSafeClose = () => {
    if (isCreatingTransaction) return
    closeQuickAdd()
  }

  const handlePresetAmount = (value: number) => {
    setValue('amount', value.toString(), { shouldDirty: true, shouldValidate: true })
  }

  const onSubmit = async (data: TransactionFormData) => {
    // Verificar limite de transações antes de criar
    const canCreate = await checkLimit()
    if (!canCreate) {
      setShowLimitModal(true)
      return
    }

    const category = categories.find((c) => c.id === data.categoryId)

    const dateValue: any = data.date;

    console.log('📅 [FRONTEND DEBUG v2] Data do formulário:', dateValue)
    console.log('📅 [FRONTEND DEBUG v2] Tipo:', typeof dateValue)
    console.log('📅 [FRONTEND DEBUG v2] instanceof Date:', dateValue instanceof Date)

    // Garantir que a data seja sempre string no formato YYYY-MM-DD (timezone local)
    const dateString = typeof dateValue === 'string'
      ? dateValue
      : dateValue instanceof Date
        ? `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}-${String(dateValue.getDate()).padStart(2, '0')}`
        : dateValue;

    console.log('📅 [FRONTEND DEBUG] Data convertida:', dateString, typeof dateString)

    await addTransaction({
      ...data,
      date: dateString,
      amount: parseFloat(data.amount),
      category: category?.name || '',
      userId: '1',
      // Adicionar campos de recorrência se marcado
      isRecurring: isQuickAddRecurring,
      recurrenceType: isQuickAddRecurring ? data.recurrenceType : undefined,
      totalInstallments: isQuickAddRecurring && data.totalInstallments ? Number(data.totalInstallments) : undefined,
    })

    // Atualizar uso após criar transação
    await refreshUsage()

    closeQuickAdd()
    setIsQuickAddRecurring(false) // Reset recorrência
  }

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

  // Calcular as 3 maiores despesas do mês selecionado
  const topExpensesCurrentMonth = useMemo(() => {
    if (!transactions.length || !categories.length) return []

    // 1. Filtrar transações de despesa do mês selecionado
    const expenses = transactions.filter((t) => {
      if (t.type !== 'expense') return false
      const date = parseISO(t.date)
      return date.getFullYear() === selectedDate.year && (date.getMonth() + 1) === selectedDate.month
    })

    // 2. Agrupar por categoria
    const categoryTotals: { [key: string]: number } = {}
    expenses.forEach((t) => {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount
    })

    // 3. Mapear para array e enriquecer com dados da categoria
    const sorted = Object.keys(categoryTotals)
      .map((catId) => {
        const category = categories.find((c) => c.id === catId)
        return {
          categoryId: catId,
          name: category?.name || 'Outros',
          color: category?.color || '#9ca3af',
          icon: category?.icon || 'FolderOpen',
          amount: categoryTotals[catId],
          percentage: financialSummary.monthExpense > 0
            ? (categoryTotals[catId] / financialSummary.monthExpense) * 100
            : 0
        }
      })
      .sort((a, b) => b.amount - a.amount)

    return sorted.slice(0, 3) // Pegar as top 3
  }, [transactions, categories, selectedDate, financialSummary.monthExpense])

  const incomeTransactions = useMemo(() => {
    return [...selectedMonthTransactions]
      .filter((t) => t.type === 'income')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [selectedMonthTransactions])

  const expenseTransactions = useMemo(() => {
    return [...selectedMonthTransactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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

  // Dados para o Radial Bar Chart (Meta de Economia)
  const savingsGoalData = useMemo(() => {
    if (!currentGoal) return []

    const currentAmount = currentGoal.currentAmount || 0
    const targetAmount = currentGoal.targetAmount || 1
    const percentage = Math.min((currentAmount / targetAmount) * 100, 100)

    return [
      {
        name: 'Meta',
        value: percentage,
        fill: percentage >= 100 ? '#22c55e' : percentage >= 50 ? '#3b82f6' : '#f59e0b'
      }
    ]
  }, [currentGoal])

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

  // Sparklines diárias para os Interactive Data Cards
  const dailySparklineMetrics = useMemo(() => {
    const daysInMonth = new Date(selectedDate.year, selectedDate.month, 0).getDate()
    const pointsCount = 7
    const step = Math.max(Math.floor(daysInMonth / pointsCount), 1)

    const incomePoints: number[] = []
    const expensePoints: number[] = []
    const balancePoints: number[] = []

    for (let day = 1; day <= daysInMonth; day += step) {
      const txUpToDay = selectedMonthTransactions.filter((t) => {
        if (!t.date) return false
        const tDay = parseISO(t.date).getDate()
        return tDay <= day
      })

      const inc = txUpToDay.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const exp = txUpToDay.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

      incomePoints.push(inc)
      expensePoints.push(exp)
      balancePoints.push(inc - exp)
    }

    return { incomePoints, expensePoints, balancePoints }
  }, [selectedMonthTransactions, selectedDate])

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

  // Permite alternar perfeitamente entre o Bottom Sheet nativo mobile e o Modal desktop
  const QuickAddSheet = isMobile ? NativeBottomSheet : Modal

  return (
    <div className="responsive-page">

      {/* Header Premium Desktop (Aurora Glow, Saudação & Cápsula de Período) */}
      <div className="hidden sm:block mb-6 select-none">
        <h1 className="sr-only">Dashboard</h1>
        <div className="relative overflow-hidden bg-gradient-to-br from-[#025ec2] via-[#0284c7] to-[#0369a1] dark:from-[#090d16] dark:via-[#0e1726] dark:to-[#050811] rounded-3xl p-6 lg:p-7 text-white shadow-xl shadow-primary-950/20 dark:shadow-2xl dark:shadow-black/70 border border-white/10 dark:border-white/5">
          {/* Elementos de Fundo com Mesh Aurora Glow e Micro-animações Orgânicas */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Orb 1: Luz Ciano / Celeste no topo direito */}
            <motion.div
              initial={false}
              animate={{
                x: [0, 20, 0],
                y: [0, -15, 0],
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.5, 0.35],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-300/80 dark:bg-cyan-500/20 blur-3xl transform-gpu pointer-events-none"
            />

            {/* Orb 2: Luz Índigo profundo no canto inferior esquerdo */}
            <motion.div
              initial={false}
              animate={{
                x: [0, -15, 0],
                y: [0, 15, 0],
                scale: [1, 1.18, 1],
                opacity: [0.3, 0.45, 0.3],
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/80 dark:bg-indigo-600/20 blur-3xl transform-gpu pointer-events-none"
            />

            {/* Orb 3: Pulso de Realce Central */}
            <motion.div
              initial={false}
              animate={{
                scale: [0.95, 1.1, 0.95],
                opacity: [0.15, 0.28, 0.15],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-sky-200/60 dark:bg-sky-400/10 blur-2xl transform-gpu pointer-events-none"
            />

            {/* Camada de Gradiente Angular de Vidro */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/[0.04] via-transparent to-black/10 dark:to-black/30 pointer-events-none" />

            {/* Linha de reflexo especular na base do cartão */}
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Conteúdo em primeiro plano */}
          <div className="relative z-10">
            {/* Linha Superior: Usuário e Cápsula de Controle de Mês */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs text-white/80 dark:text-neutral-400 font-medium">
                    {(() => {
                      const hour = new Date().getHours()
                      if (hour < 12) return 'Bom dia'
                      if (hour < 18) return 'Boa tarde'
                      return 'Boa noite'
                    })()}
                  </span>
                  <span className="text-lg font-bold text-white leading-tight font-display tracking-tight truncate">
                    {user?.name || 'Usuário'}
                  </span>
                </div>

              {/* Cápsula de Navegação de Período Integrada */}
              <div className="bg-white/15 dark:bg-white/[0.08] backdrop-blur-md rounded-full px-3.5 py-1.5 border border-white/20 dark:border-white/10 flex items-center gap-2 shadow-sm text-white">
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    goToPreviousMonth()
                  }}
                  className="p-1 hover:bg-white/20 dark:hover:bg-white/10 active:scale-90 rounded-full text-white transition-all focus:outline-none"
                  title="Mês anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 px-2">
                  <Calendar className="w-3.5 h-3.5 text-white/80 dark:text-neutral-300" />
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
                    className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white dark:bg-neutral-800 text-primary-700 dark:text-neutral-200 border border-transparent dark:border-white/10 shadow-sm hover:scale-105 active:scale-95 transition-all"
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
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Linha Principal: Saldo do Mês com Badges de Destaque */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
              <div>
                <span className="text-xs text-white/80 dark:text-neutral-400 font-medium tracking-wider uppercase">
                  Saldo do Mês
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <AnimatedCounter
                    value={financialSummary.monthBalance}
                    prefix="R$ "
                    className="text-4xl lg:text-5xl font-black tracking-tight font-display text-white leading-none drop-shadow-sm"
                  />
                </div>
              </div>

              {/* Badges de Destaque no Hero */}
              {financialSummary.monthIncome > 0 && (
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 dark:bg-white/[0.08] text-white border border-white/20 dark:border-white/10 backdrop-blur-md">
                    Poupança: {Math.max(Math.round(((financialSummary.monthIncome - financialSummary.monthExpense) / financialSummary.monthIncome) * 100), 0)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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

      {/* Carrossel de Avisos/Notificações (Estilo Nubank) */}
      {dashboardCards.length > 0 && (
        <div className="w-full overflow-x-auto flex gap-4 py-2 mb-6 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon ? (LucideIcons as any)[card.icon] : null
            return (
              <button
                key={card.id}
                onClick={() => {
                  if (card.actionPath.startsWith('http')) {
                    window.open(card.actionPath, '_blank')
                  } else {
                    navigate(card.actionPath)
                  }
                }}
                className={`flex-shrink-0 w-[250px] sm:w-[270px] p-4 ${card.bg} rounded-2xl flex flex-col justify-between text-left active:scale-[0.98] hover:scale-[1.01] transition-all focus:outline-none h-[120px]`}
              >
                <div className="flex items-center justify-between w-full">
                  {card.imageSrc ? (
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200/30">
                      <img src={card.imageSrc} alt={card.title} className="w-full h-full object-cover" />
                    </div>
                  ) : IconComponent ? (
                    <div className={`w-8 h-8 rounded-lg ${card.iconBg || 'bg-primary-50 dark:bg-primary-950/20'} flex items-center justify-center`}>
                      <IconComponent className={`w-4.5 h-4.5 ${card.iconColor || 'text-primary-600 dark:text-primary-400'}`} />
                    </div>
                  ) : null}
                  <span className={`text-[9px] font-bold uppercase tracking-widest opacity-40 ${card.textColor}`}>
                    FinControl
                  </span>
                </div>
                <div className="mt-2">
                  <p className={`text-xs font-bold ${card.textColor} line-clamp-1`}>
                    {card.title}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${card.descColor} line-clamp-2 leading-relaxed`}>
                    {card.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISÃO MOBILE DEDICADA (Cards e Widgets Próprios para Smartphones)     */}
      {/* ========================================================================= */}
      <div className="block sm:hidden space-y-4 mb-8">
        {/* 1. Meus Limites / Orçamentos em Carrossel Horizontal */}
        <MobileBudgetsCarousel
          budgets={budgets}
          categories={categories}
          transactions={transactions}
          selectedDate={selectedDate}
          formatCurrency={formatCurrency}
          onManageBudgets={() => navigate('/app/categories?manageBudgets=true')}
        />

        {/* 2. Finanças por Categoria com Barra Multi-Segmentada e Feed */}
        <MobileCategoryBreakdown
          data={categoryData}
          formatCurrency={formatCurrency}
          onManageCategories={() => navigate('/app/categories')}
        />

        {/* 3. Histórico Mensal Touch com Alternador Saldo / Fluxo */}
        <MobileMonthlyHistoryCard
          data={monthlyData}
          formatCurrency={formatCurrency}
        />

        {/* 4. Meta de Economia com Progresso Visual */}
        <MobileSavingsGoalCard
          goal={currentGoal}
          formatCurrency={formatCurrency}
          onEditGoal={() => setShowGoalModal(true)}
          onDeleteGoal={currentGoal ? handleDeleteGoal : undefined}
          isLoading={isLoadingGoal}
        />

        {/* 5. Resumo Anual e Curva Patrimonial Acumulada */}
        <MobileYearlyAccumulatedCard
          yearlyData={yearlyMonthlyData}
          accumulatedData={accumulatedBalanceData}
          formatCurrency={formatCurrency}
        />

        {/* 6. Transações Recentes Mobile */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Transações Recentes
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Últimas movimentações
              </p>
            </div>
            <Link
              to="/app/transactions"
              className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.slice(0, 5).map((transaction) => {
                const category = categories.find((c) => c.id === transaction.categoryId)
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                          {transaction.category} • {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-bold font-mono text-xs shrink-0 ml-2 ${
                        transaction.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-neutral-400">
              Nenhuma transação registrada
            </div>
          )}
        </div>

        {/* 7. Análises Avançadas Expansíveis (Accordion) */}
        <MobileAnalyticsAccordion
          analytics={analytics}
          isLoading={isLoadingAnalytics}
          isEmpty={analyticsEmpty}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* ========================================================================= */}
      {/* VISÃO DESKTOP COMPLETA (Telas Grandes sm: e acima)                    */}
      {/* ========================================================================= */}
      <div className="hidden sm:block space-y-6 mb-8">
        {/* 1. Grid de Cards de Topo no Estilo Mobile Clean: Receitas, Despesas, Meta de Economia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card Receitas */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowIncomeModal(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-0.5"
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
                  className="text-2xl lg:text-3xl font-black font-display text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">
                {incomeTransactions.length} {incomeTransactions.length === 1 ? 'lançamento' : 'lançamentos'}
              </span>
              <span className={`font-semibold px-2 py-0.5 rounded-full ${
                incomeTrendPercent >= 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}>
                {incomeTrendPercent >= 0 ? '+' : ''}{incomeTrendPercent}% vs mês anterior
              </span>
            </div>
          </div>

          {/* Card Despesas */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-0.5"
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
                  className="text-2xl lg:text-3xl font-black font-display text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">
                {expenseTransactions.length} {expenseTransactions.length === 1 ? 'saída' : 'saídas'}
              </span>
              <span className={`font-semibold px-2 py-0.5 rounded-full ${
                expenseTrendPercent <= 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {expenseTrendPercent >= 0 ? '+' : ''}{expenseTrendPercent}% vs mês anterior
              </span>
            </div>
          </div>

          {/* Card Meta de Economia */}
          <div
            onClick={() => {
              haptics.light()
              setShowGoalModal(true)
            }}
            className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
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
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 dark:text-neutral-400 transition-colors"
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
                      className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-rose-500 dark:text-rose-400 transition-colors"
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
                      className="text-2xl lg:text-3xl font-black font-display text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium">Progresso</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 font-mono">
                        {formatCurrency(currentGoal.currentAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          currentGoal.currentAmount >= currentGoal.targetAmount
                            ? 'bg-emerald-500'
                            : 'bg-primary-500'
                        }`}
                        style={{
                          width: `${Math.min(Math.round((currentGoal.currentAmount / currentGoal.targetAmount) * 100), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-2 py-2">
                  <p className="text-base font-bold text-neutral-400 dark:text-neutral-500 font-display">
                    Sem meta definida
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    Clique aqui para planejar sua economia do mês
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">
                {currentGoal ? (currentGoal.currentAmount >= currentGoal.targetAmount ? 'Meta atingida!' : 'Em andamento') : 'Planejamento'}
              </span>
              {currentGoal && (
                <span className={`font-semibold px-2 py-0.5 rounded-full ${
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
                  className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-0.5"
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
                              {transaction.category} • {format(new Date(transaction.date), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-bold font-mono text-xs shrink-0 ml-3 ${
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {!isLoadingAnalytics && !analyticsEmpty && analytics && (
                    <>
                      <MobileTopExpensesCard
                        data={analytics.topExpenses}
                        formatCurrency={formatCurrency}
                      />
                      <MobileBudgetVsActualCard
                        data={analytics.budgetVsActual}
                        formatCurrency={formatCurrency}
                      />
                    </>
                  )}
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
                className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
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
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {desktopAnalyticsOpen ? 'Ocultar' : 'Explorar (5)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                      desktopAnalyticsOpen ? 'transform rotate-180 text-primary-500' : ''
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Cards de Análises & Insights Avançados distribuídos na Coluna 2 quando expandido */}
            <AnimatePresence>
              {desktopAnalyticsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {isLoadingAnalytics ? (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-8 flex items-center justify-center text-neutral-400 text-xs shadow-sm">
                      <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary-500" />
                      <span>Carregando análises detalhadas...</span>
                    </div>
                  ) : analyticsEmpty || !analytics ? (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-8 text-center text-xs text-neutral-400 shadow-sm">
                      Nenhum dado analítico disponível para este mês.
                    </div>
                  ) : (
                    <>
                      <MobileCashFlowCard
                        data={analytics.dailyCashFlow}
                        formatCurrency={formatCurrency}
                      />
                      <MobileSavingsRateCard
                        data={analytics.savingsRate}
                        formatCurrency={formatCurrency}
                      />
                      <MobileWeekdayExpensesCard
                        data={analytics.expensesByWeekday}
                        formatCurrency={formatCurrency}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <QuickAddSheet
        isOpen={showQuickAdd}
        onClose={handleQuickAddSafeClose}
        title="Nova Transação"
        size="md"
        closeOnBackdrop={!isCreatingTransaction}
        contentClassName="space-y-5"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleQuickAddSafeClose}
              className="flex-1 btn-secondary rounded-full"
              disabled={isCreatingTransaction}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="quick-add-form"
              className="flex-1 btn-primary flex items-center justify-center gap-2 rounded-full shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isCreatingTransaction}
            >
              {isCreatingTransaction ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        }
      >
        <div className="relative">
          {isCreatingTransaction && (
            <div className="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 z-10 rounded-xl">
              <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
              <p className="text-sm font-medium text-primary-700 dark:text-primary-300 text-center px-6">
                Criando transação e gerando parcelas...
              </p>
            </div>
          )}

          <form id="quick-add-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block font-display">Tipo de Lançamento</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex items-center justify-center p-5 border rounded-2xl cursor-pointer transition-all duration-300 border-gray-200 dark:border-neutral-800/80 hover:border-success-400/60 has-[:checked]:border-success-500 has-[:checked]:bg-success-50/20 dark:has-[:checked]:bg-success-950/15 has-[:checked]:shadow-md has-[:checked]:shadow-success-500/5 active:scale-[0.97] select-none">
                  <input
                    type="radio"
                    value="income"
                    {...register('type')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-success-50/60 dark:bg-success-950/20 flex items-center justify-center mx-auto mb-2 transition-colors">
                      <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white font-display">Receita</span>
                  </div>
                </label>
                <label className="relative flex items-center justify-center p-5 border rounded-2xl cursor-pointer transition-all duration-300 border-gray-200 dark:border-neutral-800/80 hover:border-danger-400/60 has-[:checked]:border-danger-500 has-[:checked]:bg-danger-50/20 dark:has-[:checked]:bg-danger-950/15 has-[:checked]:shadow-md has-[:checked]:shadow-danger-500/5 active:scale-[0.97] select-none">
                  <input
                    type="radio"
                    value="expense"
                    {...register('type')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-danger-50/60 dark:bg-danger-950/20 flex items-center justify-center mx-auto mb-2 transition-colors">
                      <TrendingDown className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white font-display">Despesa</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Valor do Lançamento FinTech Style */}
            <div className="flex flex-col items-center justify-center py-6 bg-gray-50/40 dark:bg-neutral-850/20 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 relative overflow-hidden">
              <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 font-display">Valor do Lançamento</span>
              <div className="flex items-baseline justify-center gap-1.5 w-full px-4">
                <span className="text-xl font-bold text-gray-400 dark:text-neutral-500 font-display">R$</span>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0,00"
                  {...register('amount')}
                  className={`w-full max-w-[220px] text-center text-4xl font-extrabold font-display bg-transparent border-none outline-none focus:ring-0 p-0 text-gray-900 dark:text-white ${errors.amount ? 'text-danger-500 dark:text-danger-400' : ''}`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-danger-500 dark:text-danger-400 font-semibold mt-2 font-sans">{errors.amount.message}</p>
              )}
              {isMobile && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center px-4">
                  {quickAmountPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetAmount(preset)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full border border-primary-200 text-primary-700 bg-primary-50 dark:text-primary-200 dark:border-primary-800 dark:bg-primary-950/40 transition-colors"
                    >
                      R$ {preset.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Categoria</label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <CategorySelect
                    categories={categories.filter((cat) => cat.type === transactionType)}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.categoryId?.message}
                  />
                )}
              />
              {errors.categoryId && (
                <p className="error-message">{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Compra no supermercado"
                {...register('description')}
                className={`input-field rounded-xl ${errors.description ? 'input-error' : ''}`}
              />
              {errors.description && (
                <p className="error-message">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Data</label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.date?.message}
                      align="top"
                    />
                  )}
                />
                {errors.date && (
                  <p className="error-message">{errors.date.message}</p>
                )}
              </div>

              {transactionType === 'expense' ? (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Cartão de Crédito (Opcional)</label>
                  <Controller
                    name="creditCardId"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { value: '', label: 'Nenhum cartão' },
                          ...creditCards.map(card => ({
                            value: card.id,
                            label: card.name,
                            icon: <BrandIcon brand={card.brand} className="w-5 h-5" />
                          }))
                        ]}
                        value={field.value || ''}
                        onChange={field.onChange}
                        dropdownTitle="Selecione um Cartão"
                        className="w-full"
                      />
                    )}
                  />
                  <p className="text-[9px] text-gray-400 dark:text-neutral-500 mt-1 leading-tight">
                    Se marcado, a despesa não será somada ao total mensal para evitar redundância com a fatura.
                  </p>
                </div>
              ) : (
                <div className="hidden sm:block opacity-0 pointer-events-none" />
              )}
            </div>

            {/* Transação Recorrente */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${
              isQuickAddRecurring
                ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10 shadow-sm'
                : 'border-gray-200 dark:border-neutral-800/85 bg-white dark:bg-neutral-900/40'
            }`}>
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    isQuickAddRecurring 
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
                      : 'bg-gray-50 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 border border-gray-200/40 dark:border-neutral-700/40'
                  }`}>
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block font-sans">Transação Recorrente</span>
                    <span className="text-[10px] text-gray-400 dark:text-neutral-500">Repetir automaticamente este lançamento</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="quickAddRecurring"
                    checked={isQuickAddRecurring}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const checked = e.target.checked
                      setIsQuickAddRecurring(checked)
                      if (!checked) {
                        setValue('recurrenceType', undefined)
                        setValue('totalInstallments', '')
                      }
                      haptics.light()
                    }}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors duration-300 relative ${isQuickAddRecurring ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${isQuickAddRecurring ? 'left-5' : 'left-1'}`} />
                  </div>
                </div>
              </label>

              {isQuickAddRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="mt-4 pt-4 border-t border-primary-100/50 dark:border-primary-900/10 space-y-4"
                >
                  {/* Frequência */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Frequência</label>
                    <Controller
                      name="recurrenceType"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          options={[
                            { value: 'daily', label: 'Diária', icon: '📅' },
                            { value: 'weekly', label: 'Semanal', icon: '📆' },
                            { value: 'monthly', label: 'Mensal', icon: '🗓️' },
                            { value: 'yearly', label: 'Anual', icon: '🎯' }
                          ]}
                          value={field.value || ''}
                          onChange={field.onChange}
                          dropdownTitle="Frequência de Recorrência"
                          className="w-full"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Número de Parcelas</label>
                    <input
                      type="number"
                      min="2"
                      max="360"
                      placeholder="Ex: 12 (vazio para tempo indeterminado)"
                      {...register('totalInstallments')}
                      className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all ${errors.totalInstallments ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                    />
                    {errors.totalInstallments && (
                      <p className="text-danger-600 dark:text-danger-400 text-xs mt-1">
                        {errors.totalInstallments.message}
                      </p>
                    )}
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                    <p className="text-xs text-primary-700 dark:text-primary-300">
                      <strong>ℹ️ Como funciona:</strong> As parcelas serão geradas automaticamente. Deixe o campo "Número de Parcelas" vazio para uma transação recorrente fixa (tempo indeterminado).
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </QuickAddSheet>

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

      {/* Income Transactions Modal */}
      <Modal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        title="Receitas do Mês"
        description={`${incomeTransactions.length} ${incomeTransactions.length === 1 ? 'receita' : 'receitas'} • ${formatCurrency(financialSummary.monthIncome)}`}
        size="lg"
        footer={
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => setShowIncomeModal(false)}
              className="px-5 py-2.5 rounded-xl text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors font-medium text-sm"
            >
              Fechar
            </button>
          </div>
        }
      >
        <div>
          {incomeTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
              Nenhuma receita registrada neste mês.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {incomeTransactions.map((transaction) => {
                const category = categories.find((cat) => cat.id === transaction.categoryId)
                return (
                  <div key={transaction.id} className="py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-900/20 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon
                        icon={(category?.icon as IconName) || 'Wallet'}
                        color={category?.color || '#22c55e'}
                        size="md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{transaction.description}</p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        {category?.name || 'Sem categoria'} • {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-success-600 dark:text-success-400">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Expense Transactions Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Despesas do Mês"
        description={`${expenseTransactions.length} ${expenseTransactions.length === 1 ? 'despesa' : 'despesas'} • ${formatCurrency(financialSummary.monthExpense)}`}
        size="lg"
        footer={
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => setShowExpenseModal(false)}
              className="px-5 py-2.5 rounded-xl text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors font-medium text-sm"
            >
              Fechar
            </button>
          </div>
        }
      >
        <div>
          {expenseTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
              Nenhuma despesa registrada neste mês.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {expenseTransactions.map((transaction) => {
                const category = categories.find((cat) => cat.id === transaction.categoryId)
                return (
                  <div key={transaction.id} className="py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon
                        icon={(category?.icon as IconName) || 'Wallet'}
                        color={category?.color || '#ef4444'}
                        size="md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{transaction.description}</p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        {category?.name || 'Sem categoria'} • {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-danger-600 dark:text-danger-400">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Transaction Limit Modal */}
      <TransactionLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        usage={usage}
      />

      {/* Footer (Apenas Desktop) */}
      <div className="mt-12 hidden md:block">
        <Footer />
      </div>
    </div >
  )
}

export default Dashboard
