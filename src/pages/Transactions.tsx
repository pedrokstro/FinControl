import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinancialStore } from '@/store/financialStore'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/config/api'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Repeat,
  XCircle,
  Loader2,
  Info,
  Wallet,
  Activity,
  CreditCard as CreditCardIcon,
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { ptBR } from 'date-fns/locale'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import ConfirmCancelRecurrenceModal from '@/components/modals/ConfirmCancelRecurrenceModal'
import RecurrenceDetailsModal from '@/components/modals/RecurrenceDetailsModal'
import TransactionLimitBanner from '@/components/common/TransactionLimitBanner'
import TransactionLimitModal from '@/components/modals/TransactionLimitModal'
import PageTransition from '@/components/common/PageTransition'
import CategoryIcon from '@/components/common/CategoryIcon'
import CategorySelect from '@/components/common/CategorySelect'
import CustomSelect from '@/components/common/CustomSelect'
import CustomDatePicker from '@/components/common/CustomDatePicker'
import BrandIcon from '@/components/common/BrandIcon'
import Modal from '@/components/common/Modal'
import { Transaction } from '@/types'
import { useTransactionLimit } from '@/hooks/useTransactionLimit'
import { haptics } from '@/utils/haptics'

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 22,
    },
  },
}

const Transactions = () => {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    syncWithBackend,
    isLoading,
    isCreatingTransaction,
    creditCards,
    fetchCreditCards,
  } = useFinancialStore()

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelRecurrenceModal, setShowCancelRecurrenceModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string; amount: number } | null>(null)
  const [transactionToCancelRecurrence, setTransactionToCancelRecurrence] = useState<{ id: string; description: string } | null>(null)
  const [showRecurrenceDetailsModal, setShowRecurrenceDetailsModal] = useState(false)
  const [selectedRecurrenceTransaction, setSelectedRecurrenceTransaction] = useState<Transaction | null>(null)

  // Sincronizar com backend ao carregar a página
  useEffect(() => {
    syncWithBackend()
  }, [])
  const [searchParams, setSearchParams] = useSearchParams()

  // Abre o modal se a URL tiver ?add=true (botão + da navbar mobile)
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowModal(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [isRecurring, setIsRecurring] = useState(false)
  const { usage, checkLimit, refreshUsage } = useTransactionLimit()
  const [showLimitModal, setShowLimitModal] = useState(false)

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
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const transactionType = watch('type')

  const categoryIconMap = useMemo(() => {
    const map = new Map<string, { icon: string; name: string; color?: string }>()
    categories.forEach((cat) => {
      map.set(cat.id, { icon: cat.icon, name: cat.name, color: cat.color })
    })
    return map
  }, [categories])

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1))
  }

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date())
  }

  const filteredTransactions = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth)
    const monthEnd = endOfMonth(selectedMonth)

    console.log('🔍 Filtrando transações:')
    console.log('  Total no store:', transactions.length)
    console.log('  Mês selecionado:', format(selectedMonth, 'MMMM yyyy', { locale: ptBR }))
    console.log('  Período:', monthStart, 'até', monthEnd)

    const filtered = transactions
      .filter((t) => {
        // Usar parseISO para garantir parsing correto de datas ISO
        const transactionDate = parseISO(t.date)
        const isInSelectedMonth = transactionDate >= monthStart && transactionDate <= monthEnd

        // Debug detalhado
        if (transactions.length > 0 && transactions.indexOf(t) === 0) {
          console.log('  Exemplo de transação:')
          console.log('    Data original:', t.date)
          console.log('    Data parseada:', transactionDate)
          console.log('    monthStart:', monthStart)
          console.log('    monthEnd:', monthEnd)
          console.log('    Está no mês?', isInSelectedMonth)
        }

        const matchesSearch =
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filterType === 'all' || t.type === filterType
        const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory

        return isInSelectedMonth && matchesSearch && matchesType && matchesCategory
      })
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())

    console.log('  Transações filtradas:', filtered.length)

    return filtered
  }, [transactions, searchTerm, filterType, filterCategory, selectedMonth])

  const monthSummary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    // IMPORTANTE: Excluir transações de cartão de crédito do total de despesas para evitar bitributação/redundância (solicitação do usuário)
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
      count: filteredTransactions.length
    }
  }, [filteredTransactions])

  const handleOpenModal = (transaction?: any) => {
    if (transaction) {
      setEditingId(transaction.id)
      // Buscar cartões ao abrir modal
      fetchCreditCards()
      // Atualizar estado de recorrência
      setIsRecurring(transaction.isRecurring || false)

      // Formatar data para yyyy-MM-dd (sem timezone)
      const transactionDate = transaction.date.includes('T')
        ? transaction.date.split('T')[0]
        : transaction.date



      reset({
        type: transaction.type,
        amount: transaction.amount.toString(),
        categoryId: transaction.categoryId,
        description: transaction.description,
        date: transactionDate,
        isRecurring: transaction.isRecurring || false,
        recurrenceType: transaction.recurrenceType || undefined,
        totalInstallments: transaction.totalInstallments?.toString() || '',
        creditCardId: transaction.creditCardId || '',
      })
    } else {
      setEditingId(null)
      setIsRecurring(false)
      // Buscar cartões ao abrir modal
      fetchCreditCards()
      reset({
        type: 'expense',
        amount: '',
        categoryId: '',
        description: '',
        date: format(selectedMonth, 'yyyy-MM-dd'),
        isRecurring: false,
        recurrenceType: undefined,
        totalInstallments: '',
        creditCardId: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setIsRecurring(false)
    reset()
  }

  const onSubmit = async (data: TransactionFormData) => {
    // Verificar limite de transações antes de criar (apenas para novas transações)
    if (!editingId) {
      const canCreate = await checkLimit()
      if (!canCreate) {
        haptics.warning()
        setShowLimitModal(true)
        return
      }
    }

    const category = categories.find((c) => c.id === data.categoryId)

    const transactionData = {
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      date: data.date,
      categoryId: data.categoryId,
      isRecurring: isRecurring,
      recurrenceType: isRecurring ? data.recurrenceType : undefined,
      recurrenceMonths: isRecurring && data.totalInstallments ? Number(data.totalInstallments) : undefined,
      creditCardId: (data.type === 'expense' && data.creditCardId) ? data.creditCardId : null,
    }

    try {
      if (editingId) {
        // ✅ Ao editar, enviar apenas os campos necessários
        await updateTransaction(editingId, transactionData)
      } else {
        // ✅ Ao criar, adicionar category name e userId
        await addTransaction({
          ...transactionData,
          category: category?.name || '',
          userId: '1',
        })
        // Atualizar uso após criar transação
        await refreshUsage()
      }
      haptics.success()
      handleCloseModal()
      setIsRecurring(false) // Reset recorrência
    } catch (error) {
      haptics.error()
      console.error('Erro na transação', error)
    }
  }

  const handleDelete = (transaction: any) => {
    haptics.warning()
    setTransactionToDelete({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount
    })
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id)
      haptics.success()
      setTransactionToDelete(null)
    }
  }

  const handleCancelRecurrence = (transaction: any) => {
    haptics.warning()
    setTransactionToCancelRecurrence({
      id: transaction.parentTransactionId || transaction.id,
      description: transaction.description
    })
    setShowCancelRecurrenceModal(true)
  }

  const confirmCancelRecurrence = async () => {
    if (!transactionToCancelRecurrence) return

    try {
      await api.patch(`/transactions/${transactionToCancelRecurrence.id}/cancel-recurrence`)

      haptics.success()
      toast.success('Recorrência cancelada com sucesso!')

      // Recarregar transações
      syncWithBackend()

      setTransactionToCancelRecurrence(null)
    } catch (error: any) {
      console.error('Erro ao cancelar recorrência:', error)
      toast.error(error.response?.data?.message || 'Erro ao cancelar recorrência')
    }
  }

  const handleViewRecurrenceDetails = async (transaction: Transaction) => {
    try {
      if (!transaction.isRecurring && transaction.parentTransactionId) {
        toast.loading('Carregando...', { id: 'loadingParent' })
        const parentRes = await api.get(`/transactions/${transaction.parentTransactionId}`)
        toast.dismiss('loadingParent')
        setSelectedRecurrenceTransaction(parentRes.data.data)
      } else {
        setSelectedRecurrenceTransaction(transaction)
      }
      setShowRecurrenceDetailsModal(true)
    } catch (e) {
      toast.dismiss('loadingParent')
      toast.error('Erro ao carregar os detalhes da recorrência')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleSafeModalClose = () => {
    if (isCreatingTransaction) return
    handleCloseModal()
  }

  const availableCategories = categories.filter(
    (c) => c.type === transactionType
  )

  // Debug: verificar categorias
  console.log('📋 Total de categorias no store:', categories.length)
  console.log('📋 Categorias disponíveis para', transactionType, ':', availableCategories.length)

  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

  return (
    <PageTransition>
      <div className="responsive-page">
        {/* Header com Navegação de Mês integrada */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="hidden sm:block">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight leading-none">Transações</h1>
            <p className="text-gray-550 dark:text-neutral-400 mt-2 text-sm">
              {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Controle de mês - compacto e elegante */}
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 rounded-2xl px-3 py-2 shadow-md w-full sm:w-auto">
              <button
                onClick={handlePreviousMonth}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200 active:scale-90"
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-neutral-300" />
              </button>

              <div className="flex items-center gap-2 flex-1 justify-center px-2">
                <Calendar className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize whitespace-nowrap font-display">
                  {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
                </span>
              </div>

              {!isCurrentMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="px-2.5 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 border border-primary-100/50 dark:border-primary-900/10 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors whitespace-nowrap"
                >
                  Hoje
                </button>
              )}
              <button
                onClick={handleNextMonth}
                disabled={isCurrentMonth}
                className={`p-1.5 rounded-xl transition-all duration-200 active:scale-90 ${isCurrentMonth
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                  }`}
                title="Próximo mês"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-neutral-300" />
              </button>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto rounded-2xl shadow-md h-[42px] px-6 transition-all duration-250 hover:scale-102 active:scale-98 font-semibold font-display"
            >
              <Plus className="w-5 h-5" />
              Nova Transação
            </button>
          </div>
        </div>


        {/* Banner de Limite de Transações */}
        <TransactionLimitBanner />

        {/* Month Summary */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {/* Saldo do Mês - DEVE SER O PRIMEIRO NO MOBILE */}
          <div className="relative col-span-3 lg:col-span-1 order-first bg-primary-600 text-white rounded-2xl border-0 shadow-lg shadow-primary-500/10 dark:shadow-primary-950/20 overflow-hidden p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/15">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-primary-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-display">Saldo do Mês</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 sm:mt-2 truncate font-display tracking-tight">
                  {formatCurrency(monthSummary.balance)}
                </h3>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Barra de progresso simplificada */}
            {(monthSummary.income > 0 || monthSummary.expense > 0) && (
              <div className="mt-2">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-white rounded-full h-1.5 transition-all duration-500"
                    style={{ width: `${Math.min(monthSummary.income > 0 ? (monthSummary.expense / monthSummary.income) * 100 : 0, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lançamentos no Mês */}
          <div className="relative col-span-1 bg-white dark:bg-neutral-900/95 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 overflow-hidden shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-4">
              <div className="flex flex-col">
                <p className="text-[9px] sm:text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-display">Lançamentos</p>
                <h3 className="text-base sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5 sm:mt-1 truncate font-display tracking-tight">
                  {monthSummary.count}
                </h3>
              </div>
              <div className="hidden sm:flex w-11 h-11 rounded-xl bg-gray-50 dark:bg-neutral-800 ring-4 ring-gray-100/50 dark:ring-neutral-800/10 items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] sm:text-xs text-gray-400 dark:text-neutral-500 truncate">Este mês</span>
            </div>
          </div>

          {/* Receitas do Mês */}
          <div className="relative col-span-1 bg-white dark:bg-neutral-900/95 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 overflow-hidden shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success-400 to-success-600" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-4">
              <div className="flex flex-col">
                <p className="text-[9px] sm:text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-display">Receitas</p>
                <h3 className="text-base sm:text-2xl font-extrabold text-success-600 dark:text-success-400 mt-0.5 sm:mt-1 truncate font-display tracking-tight">
                  {formatCurrency(monthSummary.income).replace('R$', '').trim()}
                </h3>
              </div>
              <div className="hidden sm:flex w-11 h-11 rounded-xl bg-success-50 dark:bg-success-900/20 ring-4 ring-success-100/50 dark:ring-success-900/10 items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] sm:text-xs text-success-600 dark:text-success-400 font-bold truncate">Recebido</span>
            </div>
          </div>

          {/* Despesas do Mês */}
          <div className="relative col-span-1 bg-white dark:bg-neutral-900/95 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 overflow-hidden shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-danger-400 to-danger-600" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-4">
              <div className="flex flex-col">
                <p className="text-[9px] sm:text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-display">Despesas</p>
                <h3 className="text-base sm:text-2xl font-extrabold text-danger-600 dark:text-danger-400 mt-0.5 sm:mt-1 truncate font-display tracking-tight">
                  {formatCurrency(monthSummary.expense).replace('R$', '').trim()}
                </h3>
              </div>
              <div className="hidden sm:flex w-11 h-11 rounded-xl bg-danger-50 dark:bg-danger-900/20 ring-4 ring-danger-100/50 dark:ring-danger-900/10 items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] sm:text-xs text-danger-600 dark:text-danger-400 font-bold truncate">Gasto</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 shadow-md rounded-2xl p-4 sm:p-5 mb-6">
          <div className="filter-grid">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-11 rounded-xl font-sans"
              />
            </div>

            <CustomSelect
              options={[
                { value: 'all', label: 'Todos os tipos' },
                { value: 'income', label: 'Receitas', icon: <TrendingUp className="w-4 h-4 text-success-500" /> },
                { value: 'expense', label: 'Despesas', icon: <TrendingDown className="w-4 h-4 text-danger-500" /> }
              ]}
              value={filterType}
              onChange={(value) => setFilterType(value as any)}
              dropdownTitle="Filtrar por Tipo"
              className="w-full sm:w-auto min-w-[180px]"
            />

            <CustomSelect
              options={[
                { value: 'all', label: 'Todas as categorias' },
                ...categories.map(cat => ({
                  value: cat.id,
                  label: cat.name,
                  icon: (
                     <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-neutral-850" style={{ color: cat.color }}>
                      <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                    </div>
                  )
                }))
              ]}
              value={filterCategory}
              onChange={setFilterCategory}
              dropdownTitle="Filtrar por Categoria"
              className="w-full sm:w-auto min-w-[200px]"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 shadow-md rounded-2xl overflow-hidden mb-6">
          {filteredTransactions.length > 0 ? (
            <>
              <div className="hidden md:block table-wrapper">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200/50 dark:border-neutral-800/60 bg-gray-50/50 dark:bg-neutral-850/30 text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-400 font-display font-bold">
                      <th className="text-left py-4 px-6 font-bold font-display rounded-tl-xl">
                        Data
                      </th>
                      <th className="text-left py-4 px-4 font-bold font-display">
                        Descrição
                      </th>
                      <th className="text-left py-4 px-4 font-bold font-display">
                        Categoria
                      </th>
                      <th className="text-left py-4 px-4 font-bold font-display">
                        Tipo
                      </th>
                      <th className="text-right py-4 px-4 font-bold font-display">
                        Valor
                      </th>
                      <th className="text-right py-4 px-6 font-bold rounded-tr-xl font-display">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <motion.tbody
                    key={selectedMonth.toISOString() + searchTerm + filterType + filterCategory}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredTransactions.map((transaction) => (
                      <motion.tr
                        key={transaction.id}
                        variants={itemVariants}
                        className="group border-b border-gray-150 dark:border-neutral-800/60 hover:bg-gray-50/40 dark:hover:bg-neutral-850/20 transition-all duration-300 relative"
                      >
                        <td className="py-3.5 px-6 relative text-gray-600 dark:text-neutral-400 font-sans">
                          {/* Indicador de Tipo Lateral (estilo Sidebar) */}
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 group-hover:h-10 rounded-r-full transition-all duration-300 ${
                            transaction.type === 'income'
                              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                              : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                          }`} />
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {transaction.description}
                              {transaction.totalInstallments && transaction.totalInstallments > 0 && (
                                <span className="ml-2 text-sm text-gray-400 dark:text-gray-500 font-normal">
                                  {(!transaction.parentTransactionId && transaction.isRecurring) ? 1 : (transaction.currentInstallment || 1)}/{transaction.totalInstallments}
                                </span>
                              )}
                            </p>
                            {(transaction.isRecurring || transaction.parentTransactionId) && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 border border-primary-100/50 dark:border-primary-900/10">
                                <Repeat className="w-3 h-3" />
                                Recorrente
                              </span>
                            )}
                            {transaction.creditCardId && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-750 dark:text-purple-300 border border-purple-100/50 dark:border-purple-900/10">
                                <CreditCardIcon className="w-3 h-3" />
                                {transaction.creditCard?.name || 'Cartão'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300 border border-gray-150 dark:border-neutral-700/40">
                            {categoryIconMap.get(transaction.categoryId) && (
                              <CategoryIcon
                                icon={categoryIconMap.get(transaction.categoryId)!.icon}
                                color={categoryIconMap.get(transaction.categoryId)!.color}
                                size="sm"
                              />
                            )}
                            <span>{transaction.category}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === 'income'
                              ? 'bg-success-50 dark:bg-success-950/20 text-success-700 dark:text-success-300 border border-success-100/50 dark:border-success-900/10'
                              : 'bg-danger-50 dark:bg-danger-950/20 text-danger-700 dark:text-danger-300 border border-danger-100/50 dark:border-danger-900/10'
                              }`}
                          >
                            {transaction.type === 'income' ? (
                              <>
                                <TrendingUp className="w-3.5 h-3.5 animate-arrow-up" />
                                Receita
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-3.5 h-3.5 animate-arrow-down" />
                                Despesa
                              </>
                            )}
                          </span>
                        </td>
                        <td
                          className={`py-3.5 px-4 text-right font-bold font-sans ${transaction.type === 'income'
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-danger-600 dark:text-danger-400'
                            }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3.5 px-6 font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            {(transaction.isRecurring || transaction.parentTransactionId) && (
                              <>
                                <button
                                  onClick={() => handleViewRecurrenceDetails(transaction)}
                                  className="w-8.5 h-8.5 rounded-xl transition-all duration-200 hover:scale-115 active:scale-90 flex items-center justify-center text-gray-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 cursor-pointer"
                                  title="Ver detalhes da recorrência"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCancelRecurrence(transaction)}
                                  className="w-8.5 h-8.5 rounded-xl transition-all duration-200 hover:scale-115 active:scale-90 flex items-center justify-center text-gray-400 dark:text-neutral-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 cursor-pointer"
                                  title="Cancelar recorrência"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleOpenModal(transaction)}
                              className="w-8.5 h-8.5 rounded-xl transition-all duration-200 hover:scale-115 active:scale-90 flex items-center justify-center text-gray-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 cursor-pointer"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction)}
                              className="w-8.5 h-8.5 rounded-xl transition-all duration-200 hover:scale-115 active:scale-90 flex items-center justify-center text-gray-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4 pb-24 overflow-x-hidden">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="relative rounded-2xl bg-red-50/20 dark:bg-red-950/10 overflow-hidden border border-gray-200/50 dark:border-neutral-800/60"
                  >
                    {/* Background actions */}
                    <div className="absolute inset-y-0 right-0 flex items-center justify-end px-3 gap-3 z-0">
                      {(transaction.isRecurring || transaction.parentTransactionId) && (
                        <>
                          <button
                            onClick={() => handleViewRecurrenceDetails(transaction)}
                            className="p-3 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 transition-transform active:scale-95 shadow-sm"
                            title="Ver detalhes da recorrência"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCancelRecurrence(transaction)}
                            className="p-3 rounded-full bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300 transition-transform active:scale-95 shadow-sm"
                            title="Cancelar recorrência"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleOpenModal(transaction)}
                        className="p-3 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 transition-transform active:scale-95 shadow-sm"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="p-3 rounded-full bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-300 transition-transform active:scale-95 shadow-sm"
                        title="Deletar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Foreground draggable card */}
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: (transaction.isRecurring || transaction.parentTransactionId) ? -240 : -130, right: 0 }}
                      dragElastic={0.05}
                      whileTap={{ cursor: "grabbing" }}
                      className="relative z-10 w-full rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/95 p-4 shadow-sm space-y-4 cursor-grab touch-pan-y pl-5"
                    >
                      {/* Indicador de Tipo Lateral (estilo Sidebar) */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${
                        transaction.type === 'income'
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                          : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      }`} />

                      {/* Swipe Handle Hint */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-20 dark:opacity-45">
                        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                      </div>

                      <div className="flex items-start justify-between gap-3 pr-4">
                        <div>
                          <p className="text-xs text-gray-400 dark:text-neutral-500 font-sans">
                            {format(new Date(transaction.date), 'dd/MM/yyyy')}
                          </p>
                          <p className="text-base font-bold text-gray-900 dark:text-white mt-1 font-sans" style={{ wordBreak: 'break-word', paddingRight: '1rem' }}>
                            {transaction.description}
                            {transaction.totalInstallments && transaction.totalInstallments > 0 && (
                              <span className="ml-2 text-sm text-gray-450 dark:text-gray-500 font-normal">
                                {(!transaction.parentTransactionId && transaction.isRecurring) ? 1 : (transaction.currentInstallment || 1)}/{transaction.totalInstallments}
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(transaction.isRecurring || transaction.parentTransactionId) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-300 border border-primary-100/50 dark:border-primary-900/10">
                                <Repeat className="w-2.5 h-2.5" />
                                Recorrente
                              </span>
                            )}
                            {transaction.creditCardId && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border border-purple-100/50 dark:border-purple-900/10">
                                <CreditCardIcon className="w-2.5 h-2.5" />
                                {transaction.creditCard?.name || 'Cartão'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`text-right font-extrabold whitespace-nowrap font-display ${transaction.type === 'income'
                            ? 'text-success-600 dark:text-success-300'
                            : 'text-danger-600 dark:text-danger-300'
                            }`}
                        >
                          <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-neutral-500 font-bold font-display">
                            Valor
                          </span>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs pr-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-150 dark:border-neutral-700/40">
                          {categoryIconMap.get(transaction.categoryId) && (
                            <CategoryIcon
                              icon={categoryIconMap.get(transaction.categoryId)!.icon}
                              color={categoryIconMap.get(transaction.categoryId)!.color}
                              size="sm"
                            />
                          )}
                          {transaction.category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${transaction.type === 'income'
                            ? 'bg-success-50 text-success-700 dark:bg-success-950/20 dark:text-success-300 border-success-100/50 dark:border-success-900/10'
                            : 'bg-danger-50 text-danger-700 dark:bg-danger-950/20 dark:text-danger-300 border-danger-100/50 dark:border-danger-900/10'
                            }`}
                        >
                          {transaction.type === 'income' ? (
                            <>
                              <TrendingUp className="w-3.5 h-3.5 animate-arrow-up" />
                              Receita
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3.5 h-3.5 animate-arrow-down" />
                              Despesa
                            </>
                          )}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-neutral-500" />
              <p className="text-lg font-medium">Nenhuma transacao encontrada</p>
              <p className="text-sm mt-2">
                Nao ha transacoes para {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
              </p>
              {!isCurrentMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="mt-4 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 px-4 py-2 rounded-full font-medium transition-colors inline-block"
                >
                  Voltar para mes atual
                </button>
              )}
            </div>
          )}
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleSafeModalClose}
          title={editingId ? 'Editar Transação' : 'Nova Transação'}
          size="md"
          closeOnBackdrop={!isCreatingTransaction}
          contentClassName="space-y-5"
          footer={
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 btn-secondary rounded-full"
                disabled={isCreatingTransaction}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="transaction-form"
                className="flex-1 btn-primary flex items-center justify-center gap-2 rounded-full shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isCreatingTransaction}
              >
                {isCreatingTransaction ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  editingId ? 'Atualizar' : 'Salvar'
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

            <form id="transaction-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
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
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Categoria</label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <CategorySelect
                      categories={availableCategories}
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
                isRecurring
                  ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10 shadow-sm'
                  : 'border-gray-200 dark:border-neutral-800/85 bg-white dark:bg-neutral-900/40'
              }`}>
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isRecurring 
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
                      id="isRecurring"
                      checked={isRecurring}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const checked = e.target.checked
                        setIsRecurring(checked)
                        if (!checked) {
                          setValue('recurrenceType', undefined)
                          setValue('totalInstallments', '')
                        }
                        haptics.light()
                      }}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors duration-300 relative ${isRecurring ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-800'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${isRecurring ? 'left-5' : 'left-1'}`} />
                    </div>
                  </div>
                </label>

                {isRecurring && (
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
                            onChange={(val) => {
                              field.onChange(val)
                              haptics.light()
                            }}
                            placeholder="Selecione a frequência..."
                            dropdownTitle="Frequência"
                            className="w-full"
                          />
                        )}
                      />
                      {errors.recurrenceType && (
                        <p className="error-message">{errors.recurrenceType.message}</p>
                      )}
                    </div>

                    {/* Número de Parcelas */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block font-display">Número de Parcelas</label>
                      <input
                        type="number"
                        min="2"
                        max="360"
                        placeholder="Ex: 12 (vazio para tempo indeterminado)"
                        {...register('totalInstallments')}
                        className={`input-field rounded-xl ${errors.totalInstallments ? 'input-error' : ''}`}
                      />
                      {errors.totalInstallments && (
                        <p className="error-message">{errors.totalInstallments.message}</p>
                      )}
                    </div>

                    <div className="bg-primary-500/5 border border-primary-500/15 rounded-xl p-3">
                      <p className="text-[11px] text-primary-750 dark:text-primary-300 font-sans leading-relaxed">
                        <strong>ℹ️ Como funciona:</strong> As parcelas serão geradas automaticamente pelo sistema. Deixe o campo "Número de Parcelas" vazio para uma transação recorrente fixa por tempo indeterminado.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setTransactionToDelete(null)
          }}
          onConfirm={confirmDelete}
          title="Excluir Transação"
          description="Tem certeza que deseja excluir esta transação?"
          itemName={transactionToDelete ? `${transactionToDelete.description} - ${formatCurrency(transactionToDelete.amount)}` : ''}
          isLoading={isLoading}
        />

        {/* Modal de Confirmação de Cancelar Recorrência */}
        <ConfirmCancelRecurrenceModal
          isOpen={showCancelRecurrenceModal}
          onClose={() => {
            setShowCancelRecurrenceModal(false)
            setTransactionToCancelRecurrence(null)
          }}
          onConfirm={confirmCancelRecurrence}
          transactionDescription={transactionToCancelRecurrence?.description}
          isLoading={isLoading}
        />

        {/* Modal de Detalhes da Recorrência */}
        <RecurrenceDetailsModal
          isOpen={showRecurrenceDetailsModal}
          onClose={() => {
            setShowRecurrenceDetailsModal(false)
            setSelectedRecurrenceTransaction(null)
          }}
          transaction={selectedRecurrenceTransaction}
        />

        {/* Transaction Limit Modal */}
        <TransactionLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          usage={usage}
        />
      </div>
    </PageTransition>
  )
}

export default Transactions
