import { useMemo, useState, useEffect } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Plus,
  X,
  Calculator as CalculatorIcon,
  Target,
  Edit3,
  Trash2,
  Repeat,
  Loader2,
} from 'lucide-react'
import Calculator from '@/components/Calculator'
import SetSavingsGoalModal from '@/components/modals/SetSavingsGoalModal'
import ConfirmDeleteGoalModal from '@/components/modals/ConfirmDeleteGoalModal'
import Footer from '@/components/layout/Footer'
import savingsGoalService, { SavingsGoal } from '@/services/savingsGoal.service'
import analyticsService, { type AnalyticsData } from '@/services/analytics.service'
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
  Bar
} from 'recharts'
import { format, startOfMonth, endOfMonth, subMonths, getMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import CategoryIcon from '@/components/common/CategoryIcon'
import { type IconName } from '@/utils/iconMapping'

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

const calculateRecurrenceMonths = (start?: string, end?: string) => {
  if (!start || !end) return null
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
    return null
  }
  const diff =
    endDate.getFullYear() * 12 + endDate.getMonth() -
    (startDate.getFullYear() * 12 + startDate.getMonth())
  const months = diff + 1
  return months > 0 ? Math.min(months, 60) : null
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
    recurrenceMode: z.enum(['date', 'installments', 'infinite']).optional(),
    recurrenceStartDate: z.string().optional(),
    recurrenceEndDate: z.string().optional(),
    recurrenceMonths: z.string().optional(),
    totalInstallments: z.string().optional(),
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
      
      // Validação baseada no modo escolhido
      if (data.recurrenceMode === 'date') {
        if (!data.recurrenceStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['recurrenceStartDate'],
            message: 'Data inicial é obrigatória',
          })
        }
        if (!data.recurrenceEndDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['recurrenceEndDate'],
            message: 'Data final é obrigatória',
          })
        }
      } else if (data.recurrenceMode === 'installments') {
        if (!data.totalInstallments) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['totalInstallments'],
            message: 'Número de parcelas é obrigatório',
          })
        } else {
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
      // Modo 'infinite' não precisa de validações adicionais
      if (data.recurrenceStartDate && data.recurrenceEndDate) {
        const months = calculateRecurrenceMonths(data.recurrenceStartDate, data.recurrenceEndDate)
        if (!months) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['recurrenceEndDate'],
            message: 'Período inválido',
          })
        } else if (months > 60) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['recurrenceEndDate'],
            message: 'Limite máximo de 60 meses',
          })
        }
      }
    }
  })

type TransactionFormData = z.infer<typeof transactionSchema>

const Dashboard = () => {
  const { transactions, currentMonthTransactions, categories, addTransaction, syncWithBackend, isCreatingTransaction } = useFinancialStore()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showFabMenu, setShowFabMenu] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false)
  const [currentGoal, setCurrentGoal] = useState<SavingsGoal | null>(null)
  const [isLoadingGoal, setIsLoadingGoal] = useState(true)
  const [isDeletingGoal, setIsDeletingGoal] = useState(false)
  const [isQuickAddRecurring, setIsQuickAddRecurring] = useState(false)
  const [recurrenceMode, setRecurrenceMode] = useState<'date' | 'installments' | 'infinite'>('date')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true)
  
  // Carregar dados de analytics
  const loadAnalytics = async () => {
    try {
      setIsLoadingAnalytics(true)
      const data = await analyticsService.getAll()
      setAnalytics(data)
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  // Sincronizar com backend ao carregar o dashboard
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([syncWithBackend(), loadCurrentGoal(), loadAnalytics()])
      // Pequeno delay para garantir renderização suave
      setTimeout(() => setIsInitialLoad(false), 100)
    }
    loadData()
  }, [syncWithBackend])

  // Carregar meta atual
  const loadCurrentGoal = async () => {
    try {
      setIsLoadingGoal(true)
      const goal = await savingsGoalService.getCurrentGoal()
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
      recurrenceStartDate: (() => {
        const today = new Date()
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      })(),
      recurrenceEndDate: undefined,
    },
  })

  const transactionType = watch('type')
  const recurrenceStartDate = watch('recurrenceStartDate')
  const recurrenceEndDate = watch('recurrenceEndDate')
  const computedRecurrenceMonths = useMemo(
    () => calculateRecurrenceMonths(recurrenceStartDate, recurrenceEndDate),
    [recurrenceStartDate, recurrenceEndDate]
  )

  useEffect(() => {
    if (isQuickAddRecurring && recurrenceStartDate && recurrenceEndDate) {
      const months = calculateRecurrenceMonths(recurrenceStartDate, recurrenceEndDate)
      if (months) {
        setValue('recurrenceMonths', months.toString())
      } else {
        setValue('recurrenceMonths', undefined)
      }
    } else {
      setValue('recurrenceMonths', undefined)
    }
  }, [isQuickAddRecurring, recurrenceStartDate, recurrenceEndDate, setValue])

  const openQuickAdd = (type: 'income' | 'expense' = 'expense') => {
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
      recurrenceStartDate: todayString,
      recurrenceEndDate: undefined,
    })
    setShowQuickAdd(true)
    setShowFabMenu(false)
  }

  const closeQuickAdd = () => {
    setShowQuickAdd(false)
    setIsQuickAddRecurring(false)
    
    // Obter data de hoje sem timezone
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    console.log('🔄 [DEBUG] Resetando formulário com data:', todayString);
    
    reset({
      type: 'expense',
      amount: '',
      categoryId: '',
      description: '',
      date: todayString,
      isRecurring: false,
      recurrenceType: undefined,
      recurrenceEndDate: undefined,
      recurrenceMonths: undefined,
    })
  }

  const onSubmit = (data: TransactionFormData) => {
    const category = categories.find((c) => c.id === data.categoryId)
    
    const dateValue: any = data.date;
    const recurrenceEndDateValue: any = data.recurrenceEndDate;
    
    console.log('📅 [FRONTEND DEBUG v2] Data do formulário:', dateValue)
    console.log('📅 [FRONTEND DEBUG v2] Tipo:', typeof dateValue)
    console.log('📅 [FRONTEND DEBUG v2] instanceof Date:', dateValue instanceof Date)
    
    // Garantir que a data seja sempre string no formato YYYY-MM-DD (timezone local)
    const dateString = typeof dateValue === 'string' 
      ? dateValue 
      : dateValue instanceof Date
        ? `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}-${String(dateValue.getDate()).padStart(2, '0')}`
        : dateValue;
    
    const recurrenceEndDateString = recurrenceEndDateValue
      ? (typeof recurrenceEndDateValue === 'string'
          ? recurrenceEndDateValue
          : recurrenceEndDateValue instanceof Date
            ? `${recurrenceEndDateValue.getFullYear()}-${String(recurrenceEndDateValue.getMonth() + 1).padStart(2, '0')}-${String(recurrenceEndDateValue.getDate()).padStart(2, '0')}`
            : recurrenceEndDateValue)
      : undefined;
    
    console.log('📅 [FRONTEND DEBUG] Data convertida:', dateString, typeof dateString)
    
    addTransaction({
      ...data,
      date: dateString,
      amount: parseFloat(data.amount),
      category: category?.name || '',
      userId: '1',
      // Adicionar campos de recorrência se marcado
      isRecurring: isQuickAddRecurring,
      recurrenceType: isQuickAddRecurring ? data.recurrenceType : undefined,
      recurrenceEndDate: recurrenceEndDateString,
      recurrenceMonths: isQuickAddRecurring && data.recurrenceMonths ? Number(data.recurrenceMonths) : undefined,
    })
    
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

  const financialSummary = useMemo(() => {
    const monthIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthExpense = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthBalance = monthIncome - monthExpense

    return {
      monthIncome,
      monthExpense,
      monthBalance,
    }
  }, [currentMonthTransactions])

  const incomeTransactions = useMemo(() => {
    return [...currentMonthTransactions]
      .filter((t) => t.type === 'income')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [currentMonthTransactions])

  const expenseTransactions = useMemo(() => {
    return [...currentMonthTransactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [currentMonthTransactions])

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
    const currentYear = new Date().getFullYear()
    
    // Agrupar transacoes por mes
    const monthlyTotals: { [key: number]: { income: number; expense: number } } = {}
    
    // Inicializar todos os meses com 0
    for (let i = 0; i < 12; i++) {
      monthlyTotals[i] = { income: 0, expense: 0 }
    }
    
    // Calcular totais de cada mes
    transactions.forEach((t) => {
      const tDate = parseISO(t.date)
      if (tDate.getFullYear() !== currentYear) {
        return
      }
      const tMonth = getMonth(tDate)
      
      // Agrupar apenas meses do ano atual
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
  }, [transactions])

  const categoryData = useMemo(() => {
    const allCategories = categories.map((cat) => {
      const transactions_by_category = currentMonthTransactions.filter(
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
  }, [currentMonthTransactions, categories])

  const recentTransactions = useMemo(() => {
    const sorted = [...currentMonthTransactions].sort(
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
    const limit = Math.min(currentMonthTransactions.length, 6)

    return listToDisplay.slice(0, limit || 5)
  }, [currentMonthTransactions])

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

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isInitialLoad ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Visao geral das suas financas
          </p>
        </div>
        
      </div>
      
      {/* Keyboard Shortcuts Hint - Movido para baixo */}
      <div className="hidden lg:flex items-center gap-3 bg-gray-50 dark:bg-neutral-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 w-fit">
        <span className="text-xs text-gray-600 dark:text-neutral-400 font-medium">Atalhos de teclado:</span>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 text-xs font-semibold text-success-700 dark:text-success-300 bg-success-100 dark:bg-success-900/30 border border-success-300 dark:border-success-700 rounded">+</kbd>
          <span className="text-xs text-gray-600 dark:text-neutral-400">Receita</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 text-xs font-semibold text-danger-700 dark:text-danger-300 bg-danger-100 dark:bg-danger-900/30 border border-danger-300 dark:border-danger-700 rounded">-</kbd>
          <span className="text-xs text-gray-600 dark:text-neutral-400">Despesa</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 rounded">C</kbd>
          <span className="text-xs text-gray-600 dark:text-neutral-400">Calculadora</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 dark:text-primary-200 text-sm font-medium">Saldo do Mes</p>
              <h3 className="text-3xl font-bold mt-2">
                {formatCurrency(financialSummary.monthBalance)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div
          className="card cursor-pointer hover:shadow-lg transition-all"
          onClick={() => incomeTransactions.length && setShowIncomeModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && incomeTransactions.length) {
              setShowIncomeModal(true)
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium">Receitas do Mes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(financialSummary.monthIncome)}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-success-600 dark:text-success-400" />
                <span className="text-sm text-success-600 dark:text-success-400 font-medium">
                  +12.5%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-success-50 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>

        <div
          className="card cursor-pointer hover:shadow-lg transition-all"
          onClick={() => expenseTransactions.length && setShowExpenseModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && expenseTransactions.length) {
              setShowExpenseModal(true)
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium">Despesas do Mes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(financialSummary.monthExpense)}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                <span className="text-sm text-danger-600 dark:text-danger-400 font-medium">
                  -8.2%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-danger-50 dark:bg-danger-900/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-danger-600 dark:text-danger-400" />
            </div>
          </div>
        </div>

        <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowGoalModal(true)}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium">Meta de Economia</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowGoalModal(true)
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    title={currentGoal ? 'Editar meta' : 'Definir meta'}
                  >
                    {currentGoal ? (
                      <Edit3 className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400" />
                    )}
                  </button>
                  {currentGoal && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteGoal()
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Excluir meta"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                    </button>
                  )}
                </div>
              </div>
              
              {isLoadingGoal ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
                </div>
              ) : currentGoal ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(currentGoal.targetAmount)}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-neutral-400">Progresso</span>
                      <span className="font-medium text-gray-700 dark:text-neutral-300">
                        {formatCurrency(currentGoal.currentAmount)} / {formatCurrency(currentGoal.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          currentGoal.currentAmount >= currentGoal.targetAmount
                            ? 'bg-success-500'
                            : 'bg-primary-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (currentGoal.currentAmount / currentGoal.targetAmount) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {currentGoal.currentAmount >= currentGoal.targetAmount ? 'Meta atingida! 🎉' : 
                         `${Math.round((currentGoal.currentAmount / currentGoal.targetAmount) * 100)}% concluído`}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-400 dark:text-neutral-500">
                    Sem meta
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                    Clique para definir sua meta
                  </p>
                </>
              )}
            </div>
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Novo: Card Resumo Anual */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resumo Anual
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Comparacao de receitas e despesas por mes
            </p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={yearlyMonthlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              className="dark:text-neutral-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              className="dark:text-neutral-400"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `R$ ${(value / 1000).toFixed(0)}k`
                }
                return `R$ ${value}`
              }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              animationDuration={300}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar 
              dataKey="receitas" 
              fill="#22c55e" 
              name="Receitas"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar 
              dataKey="despesas" 
              fill="#ef4444" 
              name="Despesas"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Resumo estatistico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-neutral-800">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Meses com Transacoes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {yearlyMonthlyData.filter(m => m.receitas > 0 || m.despesas > 0).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Melhor Mes</p>
            <p className="text-2xl font-bold text-success-600 dark:text-success-400">
              {yearlyMonthlyData.reduce((max, m) => m.saldo > max.saldo ? m : max, yearlyMonthlyData[0]).month}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Mes Mais Ativo</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {yearlyMonthlyData.reduce((max, m) => (m.receitas + m.despesas) > (max.receitas + max.despesas) ? m : max, yearlyMonthlyData[0]).month}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Historico Mensal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="month" stroke="#6b7280" className="dark:text-neutral-400" />
              <YAxis stroke="#6b7280" className="dark:text-neutral-400" />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                animationDuration={300}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="receitas" 
                stroke="#22c55e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorReceitas)" 
                name="Receitas"
                animationDuration={1000}
                animationBegin={0}
                animationEasing="ease-in-out"
              />
              <Area 
                type="monotone" 
                dataKey="despesas" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorDespesas)" 
                name="Despesas"
                animationDuration={1000}
                animationBegin={200}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Financas por Categoria
          </h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCategoryLabel}
                    outerRadius={100}
                    innerRadius={0}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1200}
                    animationBegin={0}
                    isAnimationActive={true}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, _name: string, props: any) => [
                      formatCurrency(value),
                      props.payload.type === 'income' ? 'Receita' : 'Despesa'
                    ]}
                    animationDuration={300}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legenda personalizada */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-neutral-300 border-b dark:border-neutral-800 pb-2">
                  <span>Categoria</span>
                  <span>Tipo</span>
                  <span>Valor</span>
                </div>
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-900 dark:text-white">{item.name}</span>
                    </div>
                    <span 
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'income' 
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300' 
                          : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300'
                      }`}
                    >
                      {item.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                    <span className={`font-semibold ml-4 ${
                      item.type === 'income' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                    }`}>
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-neutral-400">
              Nenhuma transacao registrada
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transacoes Recentes
          </h3>
          <a href="/transactions" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
            Ver todas
          </a>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = categories.find(c => c.id === transaction.categoryId)
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-success-100 dark:bg-success-900/30'
                          : 'bg-danger-100 dark:bg-danger-900/30'
                      }`}
                    >
                      {category ? (
                        <CategoryIcon
                          icon={category.icon as IconName}
                          color={category.color}
                          size="md"
                        />
                      ) : (
                        transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
                        )
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {transaction.category} • {format(new Date(transaction.date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-danger-600 dark:text-danger-400'
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
          <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
            Nenhuma transacao registrada
          </div>
        )}
      </div>

      {/* Gráficos Avançados de Analytics */}
      {!isLoadingAnalytics && analytics && (
        <>
          {/* Seção de Analytics */}
          <div className="mt-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Análises Avançadas
                </h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Insights detalhados sobre suas finanças
                </p>
              </div>
            </div>
          </div>

          {/* 1. Fluxo de Caixa Diário */}
          <CashFlowChart 
            data={analytics.dailyCashFlow} 
            formatCurrency={formatCurrency} 
          />

          {/* 2. Taxa de Poupança */}
          <SavingsRateChart 
            data={analytics.savingsRate} 
            formatCurrency={formatCurrency} 
          />

          {/* 3. Top 10 Maiores Despesas + Despesas por Dia da Semana */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopExpensesChart 
              data={analytics.topExpenses} 
              formatCurrency={formatCurrency} 
            />
            <ExpensesByWeekdayChart 
              data={analytics.expensesByWeekday} 
              formatCurrency={formatCurrency} 
            />
          </div>

          {/* 4. Orçamento vs Real */}
          <BudgetVsActualChart 
            data={analytics.budgetVsActual} 
            formatCurrency={formatCurrency} 
          />
        </>
      )}

      {/* Loading Analytics */}
      {isLoadingAnalytics && (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-neutral-400">
              Carregando análises...
            </span>
          </div>
        </div>
      )}

      {/* Quick Action Floating Button Menu */}
      <div className="fixed bottom-8 right-8 z-40">
        {/* Expandable Menu */}
        {showFabMenu && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
            <button
              onClick={() => {
                setShowCalculator(true)
                setShowFabMenu(false)
              }}
              className="flex items-center gap-3 bg-primary-600 dark:bg-primary-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all transform hover:scale-105"
            >
              <CalculatorIcon className="w-5 h-5" />
              <span className="font-semibold whitespace-nowrap">Calculadora</span>
            </button>
            <button
              onClick={() => openQuickAdd('income')}
              className="flex items-center gap-3 bg-success-600 dark:bg-success-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-success-700 dark:hover:bg-success-600 transition-all transform hover:scale-105"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold whitespace-nowrap">Adicionar Receita</span>
            </button>
            <button
              onClick={() => openQuickAdd('expense')}
              className="flex items-center gap-3 bg-danger-600 dark:bg-danger-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-danger-700 dark:hover:bg-danger-600 transition-all transform hover:scale-105"
            >
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold whitespace-nowrap">Adicionar Despesa</span>
            </button>
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className={`w-14 h-14 bg-primary-600 dark:bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all transform hover:scale-110 flex items-center justify-center ${
            showFabMenu ? 'rotate-45' : ''
          }`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Quick Add Transaction Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={closeQuickAdd}
          ></div>
          <div className="bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Nova Transacao
              </h3>
              <button 
                onClick={closeQuickAdd}
                className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Tipo de Transacao
                </label>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setValue('type', 'income')}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      transactionType === 'income' 
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 border-2 border-success-500' 
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    Receita
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setValue('type', 'expense')}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      transactionType === 'expense' 
                        ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 border-2 border-danger-500' 
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <TrendingDown className="w-5 h-5" />
                    Despesa
                  </button>
                </div>
                {errors.type && (
                  <p className="text-danger-600 dark:text-danger-400 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Categoria
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories
                    .filter(cat => cat.type === transactionType)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                {errors.categoryId && (
                  <p className="text-danger-600 dark:text-danger-400 text-sm mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Descricao
                </label>
                <input
                  {...register('description')}
                  type="text"
                  className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-neutral-500"
                  placeholder="Ex: Compra no supermercado"
                />
                {errors.description && (
                  <p className="text-danger-600 dark:text-danger-400 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Valor (R$)
                </label>
                <input
                  {...register('amount')}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-neutral-500"
                  placeholder="0,00"
                />
                {errors.amount && (
                  <p className="text-danger-600 dark:text-danger-400 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Data
                </label>
                <input
                  {...register('date', { 
                    setValueAs: (value) => {
                      // Garantir que sempre retorne string, não Date
                      if (value instanceof Date) {
                        return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
                      }
                      return value;
                    }
                  })}
                  type="date"
                  className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
                />
                {errors.date && (
                  <p className="text-danger-600 dark:text-danger-400 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Transação Recorrente */}
              <div className="border-t border-gray-200 dark:border-neutral-800 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="quickAddRecurring"
                    checked={isQuickAddRecurring}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setIsQuickAddRecurring(checked)
                      if (checked) {
                        const currentDate = watch('date')
                        setValue('recurrenceStartDate', currentDate)
                      } else {
                        setValue('recurrenceType', undefined)
                        setValue('recurrenceStartDate', undefined)
                        setValue('recurrenceEndDate', undefined)
                        setValue('recurrenceMonths', undefined)
                      }
                    }}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="quickAddRecurring" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    <Repeat className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    Transação Recorrente
                  </label>
                </div>

                {isQuickAddRecurring && (
                  <div className="space-y-3 pl-6 border-l-2 border-primary-200 dark:border-primary-800">
                    {/* Frequência */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                        Frequência
                      </label>
                      <select
                        {...register('recurrenceType')}
                        className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
                      >
                        <option value="">Selecione...</option>
                        <option value="daily">Diária</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>

                    {/* Modo de Recorrência */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                        Modo de Recorrência
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="date"
                            checked={recurrenceMode === 'date'}
                            onChange={(e) => {
                              setRecurrenceMode('date')
                              setValue('recurrenceMode', 'date')
                            }}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">Data Início/Fim</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="installments"
                            checked={recurrenceMode === 'installments'}
                            onChange={(e) => {
                              setRecurrenceMode('installments')
                              setValue('recurrenceMode', 'installments')
                            }}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">Número de Parcelas</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="infinite"
                            checked={recurrenceMode === 'infinite'}
                            onChange={(e) => {
                              setRecurrenceMode('infinite')
                              setValue('recurrenceMode', 'infinite')
                            }}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">Recorrência Infinita</span>
                        </label>
                      </div>
                    </div>

                    {/* Campos baseados no modo */}
                    {recurrenceMode === 'date' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Data Inicial
                          </label>
                          <input
                            type="date"
                            {...register('recurrenceStartDate')}
                            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all ${errors.recurrenceStartDate ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                          />
                          {errors.recurrenceStartDate && (
                            <p className="text-danger-600 dark:text-danger-400 text-xs mt-1">
                              {errors.recurrenceStartDate.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Data Final
                          </label>
                          <input
                            type="date"
                            {...register('recurrenceEndDate')}
                            className={`w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all ${errors.recurrenceEndDate ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                          />
                          {errors.recurrenceEndDate && (
                            <p className="text-danger-600 dark:text-danger-400 text-xs mt-1">
                              {errors.recurrenceEndDate.message}
                            </p>
                          )}
                        </div>
                        <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3 text-xs text-primary-700 dark:text-primary-300">
                          {computedRecurrenceMonths
                            ? <p>Serão criadas <strong>{computedRecurrenceMonths}</strong> parcelas automaticamente.</p>
                            : <p>Selecione datas válidas (máx. 60 meses).</p>
                          }
                        </div>
                      </>
                    )}

                    {recurrenceMode === 'installments' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Número de Parcelas
                          </label>
                          <input
                            type="number"
                            min="2"
                            max="360"
                            placeholder="Ex: 12"
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
                            <strong>ℹ️ Como funciona:</strong> Uma parcela será gerada automaticamente todo mês até completar o total.
                          </p>
                        </div>
                      </>
                    )}

                    {recurrenceMode === 'infinite' && (
                      <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                        <p className="text-xs text-primary-700 dark:text-primary-300">
                          <strong>ℹ️ Como funciona:</strong> Uma parcela será gerada todo mês indefinidamente até você cancelar manualmente.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuickAdd}
                  className="flex-1 px-4 py-2.5 text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTransaction}
                  className="flex-1 px-4 py-2.5 text-white bg-primary-600 dark:bg-primary-500 rounded-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingTransaction ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Adicionar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowIncomeModal(false)}>
          <div
            className="bg-white dark:bg-neutral-950 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-sm text-success-600 dark:text-success-400 font-medium">Receitas do Mês</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(financialSummary.monthIncome)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                  {incomeTransactions.length} {incomeTransactions.length === 1 ? 'receita' : 'receitas'} registradas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIncomeModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {incomeTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                  Nenhuma receita registrada neste mês.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {incomeTransactions.map((transaction) => {
                    const category = categories.find((cat) => cat.id === transaction.categoryId)
                    return (
                      <div key={transaction.id} className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-success-50 dark:bg-success-900/20 flex items-center justify-center flex-shrink-0">
                          <CategoryIcon
                            icon={(category?.icon as IconName) || 'Wallet'}
                            color={category?.color || '#22c55e'}
                            size="md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">
                            {category?.name || 'Sem categoria'} • {formatDate(transaction.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success-600 dark:text-success-400">
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIncomeModal(false)}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Transactions Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowExpenseModal(false)}>
          <div
            className="bg-white dark:bg-neutral-950 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-sm text-danger-600 dark:text-danger-400 font-medium">Despesas do Mês</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(financialSummary.monthExpense)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                  {expenseTransactions.length} {expenseTransactions.length === 1 ? 'despesa' : 'despesas'} registradas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {expenseTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                  Nenhuma despesa registrada neste mês.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {expenseTransactions.map((transaction) => {
                    const category = categories.find((cat) => cat.id === transaction.categoryId)
                    return (
                      <div key={transaction.id} className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center flex-shrink-0">
                          <CategoryIcon
                            icon={(category?.icon as IconName) || 'Wallet'}
                            color={category?.color || '#ef4444'}
                            size="md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">
                            {category?.name || 'Sem categoria'} • {formatDate(transaction.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-danger-600 dark:text-danger-400">
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  )
}

export default Dashboard
