import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinancialStore } from '@/store/financialStore'
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
  Info,
  Wallet,
  Activity,
  CreditCard as CreditCardIcon,
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, parseISO, isToday, isYesterday } from 'date-fns'
import { motion } from 'framer-motion'
import { ptBR } from 'date-fns/locale'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import ConfirmCancelRecurrenceModal from '@/components/modals/ConfirmCancelRecurrenceModal'
import RecurrenceDetailsModal from '@/components/modals/RecurrenceDetailsModal'
import TransactionLimitBanner from '@/components/common/TransactionLimitBanner'
import TransactionLimitModal from '@/components/modals/TransactionLimitModal'
import PageTransition from '@/components/common/PageTransition'
import CategoryIcon from '@/components/common/CategoryIcon'
import CustomSelect from '@/components/common/CustomSelect'
import TransactionFormModal from '@/components/transactions/TransactionFormModal'
import { Transaction } from '@/types'
import { useDebounce } from '@/hooks'
import { useTransactionLimit } from '@/hooks/useTransactionLimit'
import { haptics } from '@/utils/haptics'
import MobileTransactionsSummary from '@/components/transactions/mobile/MobileTransactionsSummary'

const Transactions = () => {
  const transactions = useFinancialStore((s) => s.transactions)
  const categories = useFinancialStore((s) => s.categories)
  const deleteTransaction = useFinancialStore((s) => s.deleteTransaction)
  const syncWithBackend = useFinancialStore((s) => s.syncWithBackend)
  const isLoading = useFinancialStore((s) => s.isLoading)

  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelRecurrenceModal, setShowCancelRecurrenceModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string; amount: number } | null>(null)
  const [transactionToCancelRecurrence, setTransactionToCancelRecurrence] = useState<{ id: string; description: string } | null>(null)
  const [showRecurrenceDetailsModal, setShowRecurrenceDetailsModal] = useState(false)
  const [selectedRecurrenceTransaction, setSelectedRecurrenceTransaction] = useState<Transaction | null>(null)

  // Sincronizar com backend ao carregar a página (deduplicado pelo store)
  useEffect(() => {
    syncWithBackend()
  }, [syncWithBackend])
  const [searchParams, setSearchParams] = useSearchParams()

  // Abre o modal se a URL tiver ?add=true (botão + da navbar mobile ou Header desktop)
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setEditingTransaction(null)
      setShowModal(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 200)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null)
  const { usage } = useTransactionLimit()
  const [showLimitModal, setShowLimitModal] = useState(false)

  const categoryIconMap = useMemo(() => {
    const map = new Map<string, { icon: string; name: string; color?: string }>()
    categories.forEach((cat) => {
      map.set(cat.id, { icon: cat.icon, name: cat.name, color: cat.color })
    })
    return map
  }, [categories])

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredTransactions = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth)
    const monthEnd = endOfMonth(selectedMonth)
    const normalizedQuery = debouncedSearchTerm.trim().toLowerCase()

    return transactions
      .filter((t) => {
        const transactionDate = parseISO(t.date)
        const isInSelectedMonth = transactionDate >= monthStart && transactionDate <= monthEnd

        const matchesSearch =
          !normalizedQuery ||
          t.description.toLowerCase().includes(normalizedQuery) ||
          t.category.toLowerCase().includes(normalizedQuery)

        const matchesType = filterType === 'all' || t.type === filterType
        const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory

        return isInSelectedMonth && matchesSearch && matchesType && matchesCategory
      })
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
  }, [transactions, debouncedSearchTerm, filterType, filterCategory, selectedMonth])

  const monthSummary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

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

  const handleOpenModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTransaction(null)
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

  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

  // Agrupa transações por data para a lista mobile (estilo Nubank)
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof filteredTransactions> = {}
    filteredTransactions.forEach(t => {
      const dateKey = t.date.split('T')[0]
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(t)
    })
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filteredTransactions])

  const formatGroupLabel = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    return format(date, "dd 'de' MMM", { locale: ptBR })
  }

  return (
    <PageTransition>
      <div className="responsive-page">
        {/* Título mobile - estilo compacto FinControl */}
        <h1 className="sm:hidden text-xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight mb-2">Transações</h1>

        {/* Header com Navegação de Mês */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Título visível apenas no desktop */}
          <div className="hidden sm:block">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight leading-none">Transações</h1>
            <p className="text-gray-550 dark:text-neutral-400 mt-2 text-sm">
              {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Controle de mês - estilo Pill nativo */}
            <div className="flex items-center flex-1 sm:flex-none justify-between sm:justify-start gap-1.5 bg-white dark:bg-neutral-900/95 border border-gray-200/60 dark:border-neutral-800/80 rounded-full px-2.5 py-1.5 shadow-sm">
              <button
                onClick={handlePreviousMonth}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-all duration-200 active:scale-90 flex-shrink-0 cursor-pointer"
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-neutral-300" />
              </button>

              <div className="flex items-center gap-1.5 flex-1 justify-center px-2">
                <Calendar className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-900 dark:text-white capitalize whitespace-nowrap font-display">
                  {format(selectedMonth, 'MMM yyyy', { locale: ptBR })}
                </span>
              </div>

              {!isCurrentMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="px-2.5 py-1 text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border border-primary-100/60 dark:border-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                >
                  Hoje
                </button>
              )}
              <button
                onClick={handleNextMonth}
                disabled={isCurrentMonth}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 flex-shrink-0 cursor-pointer ${
                  isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
                title="Próximo mês"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-neutral-300" />
              </button>
            </div>

            {/* Botão Nova Transação - desktop only */}
            <button
              onClick={() => handleOpenModal()}
              className="hidden sm:flex btn-primary items-center justify-center gap-2 rounded-full shadow-md h-[42px] px-6 transition-all duration-250 hover:scale-102 active:scale-98 font-semibold font-display"
            >
              <Plus className="w-5 h-5" />
              Nova Transação
            </button>
          </div>
        </div>


        {/* Banner de Limite de Transações */}
        <TransactionLimitBanner />

        {/* Month Summary - Mobile Dedicado vs Desktop */}
        {/* 1. Versão Mobile (< sm): Cards Nativos */}
        <div className="sm:hidden mb-6">
          <MobileTransactionsSummary
            balance={monthSummary.balance}
            income={monthSummary.income}
            expense={monthSummary.expense}
            count={monthSummary.count}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* 2. Versão Desktop (>= sm): Grid de 4 Colunas */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Saldo do Mês */}
          <div className="relative bg-white dark:bg-neutral-900/95 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 overflow-hidden shadow-md p-5 transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-display">Saldo do Mês</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 truncate font-display tracking-[-0.02em] tabular-figures">
                  {formatCurrency(monthSummary.balance)}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/20 ring-4 ring-primary-100/50 dark:ring-primary-900/10 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            {/* Barra de progresso simplificada */}
            {(monthSummary.income > 0 || monthSummary.expense > 0) && (
              <div className="mt-2">
                <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary-600 dark:bg-primary-500 rounded-full h-1.5 transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ width: `${Math.min(monthSummary.income > 0 ? (monthSummary.expense / monthSummary.income) * 100 : 0, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lançamentos no Mês */}
          <div className="relative bg-white dark:bg-neutral-900/95 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 overflow-hidden shadow-md p-5 transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-display">Lançamentos</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 truncate font-display tracking-[-0.02em] tabular-figures">
                  {monthSummary.count}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-neutral-800 ring-4 ring-gray-100/50 dark:ring-neutral-800/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 dark:text-neutral-500 truncate">Este mês</span>
            </div>
          </div>

          {/* Receitas do Mês */}
          <div className="relative bg-white dark:bg-neutral-900/95 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 overflow-hidden shadow-md p-5 transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-display">Receitas</p>
                <h3 className="text-2xl font-extrabold text-success-600 dark:text-success-400 mt-1 truncate font-display tracking-[-0.02em] tabular-figures">
                  {formatCurrency(monthSummary.income)}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-success-50 dark:bg-success-900/20 ring-4 ring-success-100/50 dark:ring-success-900/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-success-600 dark:text-success-400 font-bold truncate">Recebido</span>
            </div>
          </div>

          {/* Despesas do Mês */}
          <div className="relative bg-white dark:bg-neutral-900/95 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 overflow-hidden shadow-md p-5 transition-[border-color,box-shadow] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-display">Despesas</p>
                <h3 className="text-2xl font-extrabold text-danger-600 dark:text-danger-400 mt-1 truncate font-display tracking-[-0.02em] tabular-figures">
                  {formatCurrency(monthSummary.expense)}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-danger-50 dark:bg-danger-900/20 ring-4 ring-danger-100/50 dark:ring-danger-900/10 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-danger-600 dark:text-danger-400 font-bold truncate">Gasto</span>
            </div>
          </div>
        </div>

        {/* Filters - desktop only */}
        <div className="hidden sm:block bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 shadow-md rounded-2xl p-4 sm:p-5 mb-6">
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
                     <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-neutral-800" style={{ color: cat.color }}>
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

        {/* Transactions list/table area */}
        {filteredTransactions.length > 0 ? (
          <>
            {/* Desktop Table Wrapper */}
            <div className="hidden md:block bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 shadow-md rounded-2xl overflow-hidden mb-6 table-wrapper">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/70 dark:border-neutral-800/60 bg-gray-50/70 dark:bg-neutral-800/40 text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-400 font-display font-bold">
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
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="group border-b border-gray-100 dark:border-neutral-800/60 hover:bg-gray-50/60 dark:hover:bg-neutral-800/30 transition-colors duration-150 relative"
                    >
                      <td className="py-3.5 px-6 text-gray-600 dark:text-neutral-400 font-sans">
                        {format(parseISO(transaction.date), 'dd/MM/yyyy')}
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
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-100/50 dark:border-purple-900/10">
                              <CreditCardIcon className="w-3 h-3" />
                              {transaction.creditCard?.name || 'Cartão'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700/40">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lista mobile agrupada por data — estilo Nubank */}
            <div className="md:hidden space-y-4 mb-6">
              {groupedTransactions.map(([dateKey, dayTransactions]) => (
                <div key={dateKey}>
                  {/* Cabeçalho de data */}
                  <div className="px-1 pt-2 pb-2 flex items-center gap-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-neutral-500 whitespace-nowrap">
                      {formatGroupLabel(dateKey)}
                    </span>
                    <div className="flex-1 h-px bg-gray-200/60 dark:bg-neutral-800/40" />
                  </div>

                  {/* Transações do dia agrupadas em card */}
                  <div className="bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 shadow-sm rounded-2xl overflow-hidden divide-y divide-gray-50 dark:divide-neutral-800/30">
                    {dayTransactions.map((transaction) => {
                      const catInfo = categoryIconMap.get(transaction.categoryId)
                      const isRecurringTrans = transaction.isRecurring || transaction.parentTransactionId
                      const maxDrag = isRecurringTrans ? -232 : -112
                      return (
                        <div key={transaction.id} className="relative overflow-hidden">
                          {/* Ações reveladas pelo swipe */}
                          <div className="absolute inset-y-0 right-0 flex items-center justify-end px-4 gap-2 z-0">
                            {(transaction.isRecurring || transaction.parentTransactionId) && (
                              <>
                                <button
                                  onClick={() => handleViewRecurrenceDetails(transaction)}
                                  className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center transition-transform active:scale-95"
                                  title="Ver detalhes"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCancelRecurrence(transaction)}
                                  className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center transition-transform active:scale-95"
                                  title="Cancelar recorrência"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleOpenModal(transaction)}
                              className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center transition-transform active:scale-95"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction)}
                              className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center transition-transform active:scale-95"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Card deslizável */}
                          <motion.div
                            drag="x"
                            dragConstraints={{ left: maxDrag, right: 0 }}
                            dragElastic={0.05}
                            animate={{ x: activeSwipeId === transaction.id ? maxDrag : 0 }}
                            onDragEnd={(_event, info) => {
                              if (info.offset.x < -30) {
                                setActiveSwipeId(transaction.id)
                              } else if (info.offset.x > 30) {
                                setActiveSwipeId(null)
                              }
                            }}
                            onTap={() => {
                              if (activeSwipeId === transaction.id) {
                                setActiveSwipeId(null)
                              }
                            }}
                            whileTap={{ cursor: 'grabbing' }}
                            className="relative z-10 flex items-center gap-3.5 px-4 py-3.5 bg-white dark:bg-neutral-900/95 cursor-grab touch-pan-y"
                          >
                            {/* Ícone circular de categoria */}
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: (catInfo?.color || '#6366f1') + '22' }}
                            >
                              {catInfo ? (
                                <CategoryIcon icon={catInfo.icon} color={catInfo.color} size="md" />
                              ) : (
                                <Wallet className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                              )}
                            </div>

                            {/* Informações */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
                                {transaction.description}
                                {transaction.totalInstallments && transaction.totalInstallments > 0 && (
                                  <span className="ml-1.5 text-xs text-gray-400 dark:text-neutral-500 font-normal">
                                    {(!transaction.parentTransactionId && transaction.isRecurring) ? 1 : (transaction.currentInstallment || 1)}/{transaction.totalInstallments}
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-[11px] text-gray-500 dark:text-neutral-400 truncate">
                                  {transaction.category}
                                </span>
                                {(transaction.isRecurring || transaction.parentTransactionId) && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary-600 dark:text-primary-400">
                                    <Repeat className="w-2.5 h-2.5" />
                                    Recorrente
                                  </span>
                                )}
                                {transaction.creditCardId && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                                    <CreditCardIcon className="w-2.5 h-2.5" />
                                    {transaction.creditCard?.name || 'Cartão'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Valor */}
                            <div className="text-right flex-shrink-0">
                              <p className={`font-bold text-sm font-display ${
                                transaction.type === 'income'
                                  ? 'text-success-600 dark:text-success-400'
                                  : 'text-danger-600 dark:text-danger-400'
                              }`}>
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </p>
                            </div>

                            {/* Indicador de swipe */}
                            <div className="flex flex-col gap-0.5 opacity-25 flex-shrink-0">
                              <div className="w-1 h-1 rounded-full bg-gray-500" />
                              <div className="w-1 h-1 rounded-full bg-gray-500" />
                              <div className="w-1 h-1 rounded-full bg-gray-500" />
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-neutral-900/95 border border-gray-200/50 dark:border-neutral-800/60 shadow-md rounded-2xl overflow-hidden mb-6">
            <div className="flex flex-col items-center text-center py-14 px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Nenhuma transação</h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1.5 max-w-[260px] leading-normal">
                Não há lançamentos em {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => handleOpenModal()}
                  className="btn-primary flex items-center justify-center gap-2 px-5 h-10 rounded-xl text-sm font-bold shadow-sm active:scale-[0.98] transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar transação
                </button>
                {!isCurrentMonth && (
                  <button
                    onClick={handleCurrentMonth}
                    className="flex items-center justify-center gap-1.5 px-5 h-10 rounded-xl text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    Ir para mês atual
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <TransactionFormModal
          isOpen={showModal}
          onClose={handleCloseModal}
          initialDate={format(selectedMonth, 'yyyy-MM-dd')}
          editingTransaction={editingTransaction}
          onLimitReached={() => setShowLimitModal(true)}
        />

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
        {/* FAB - Nova Transação (mobile only) */}
        <button
          onClick={() => handleOpenModal()}
          className="sm:hidden fixed bottom-24 right-4 z-40 w-14 h-14 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-full shadow-xl shadow-primary-500/30 flex items-center justify-center transition-all duration-200 active:scale-90"
          title="Nova Transação"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </PageTransition>
  )
}

export default Transactions
