import { useMemo, useState } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { useAuthStore } from '@/store/authStore'
import {
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  BarChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts'
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachMonthOfInterval,
  parseISO,
  isValid,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  FileSpreadsheet,
  FileDown,
  Calendar,
  CalendarRange,
  Filter,
  Loader2,
  BarChart3,
} from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { exportService } from '@/services/exportService'
import { toast } from 'react-hot-toast'

// ─── Tipos de filtro ──────────────────────────────────────────────────────────
type FilterMode = 'month' | 'period' | 'custom'

const PERIODS = [
  { value: '3', label: '3 meses' },
  { value: '6', label: '6 meses' },
  { value: '12', label: '12 meses' },
] as const

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`

// ─────────────────────────────────────────────────────────────────────────────

const Reports = () => {
  const { transactions, categories } = useFinancialStore()
  const { user } = useAuthStore()

  // ── Filtros ────────────────────────────────────────────────────────────────
  const [filterMode, setFilterMode] = useState<FilterMode>('period')
  const [selectedPeriod, setSelectedPeriod] = useState<'3' | '6' | '12'>('6')
  // mês único (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))
  // intervalo personalizado
  const [customFrom, setCustomFrom] = useState<string>(format(subMonths(new Date(), 1), 'yyyy-MM-dd'))
  const [customTo, setCustomTo] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const [isExporting, setIsExporting] = useState(false)

  // ── Intervalo de datas ativo ───────────────────────────────────────────────
  const dateRange = useMemo(() => {
    if (filterMode === 'month') {
      const d = parseISO(`${selectedMonth}-01`)
      return { start: startOfMonth(d), end: endOfMonth(d) }
    }
    if (filterMode === 'custom') {
      const s = parseISO(customFrom)
      const e = parseISO(customTo)
      return { start: isValid(s) ? s : subMonths(new Date(), 1), end: isValid(e) ? e : new Date() }
    }
    // period
    const months = parseInt(selectedPeriod)
    return { start: startOfMonth(subMonths(new Date(), months - 1)), end: endOfMonth(new Date()) }
  }, [filterMode, selectedMonth, selectedPeriod, customFrom, customTo])

  const periodLabel = useMemo(() => {
    if (filterMode === 'month') {
      return format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy', { locale: ptBR })
    }
    if (filterMode === 'custom') {
      return `${format(dateRange.start, 'dd/MM/yyyy')} – ${format(dateRange.end, 'dd/MM/yyyy')}`
    }
    return `Últimos ${selectedPeriod} meses`
  }, [filterMode, selectedMonth, selectedPeriod, dateRange, customFrom, customTo])

  // ── Transações filtradas ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const d = parseISO(t.date)
      return d >= dateRange.start && d <= dateRange.end
    })
  }, [transactions, dateRange])

  // ── Resumo do período ──────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, balance: income - expense, count: filtered.length }
  }, [filtered])

  // ── Comparação com período anterior ───────────────────────────────────────
  const comparison = useMemo(() => {
    const span = dateRange.end.getTime() - dateRange.start.getTime()
    const prevEnd = new Date(dateRange.start.getTime() - 1)
    const prevStart = new Date(prevEnd.getTime() - span)

    const prev = transactions.filter(t => {
      const d = parseISO(t.date)
      return d >= prevStart && d <= prevEnd
    })

    const prevIncome = prev.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const prevExpense = prev.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const prevBalance = prevIncome - prevExpense

    const chg = (cur: number, pre: number) => (pre !== 0 ? ((cur - pre) / pre) * 100 : 0)

    return {
      income: { current: summary.income, prev: prevIncome, change: chg(summary.income, prevIncome) },
      expense: { current: summary.expense, prev: prevExpense, change: chg(summary.expense, prevExpense) },
      balance: { current: summary.balance, prev: prevBalance, change: chg(summary.balance, prevBalance) },
    }
  }, [filtered, summary, transactions, dateRange])

  // ── Evolução mensal (linha) ────────────────────────────────────────────────
  const monthlyEvolution = useMemo(() => {
    const months = eachMonthOfInterval({ start: dateRange.start, end: dateRange.end })
    return months.map(month => {
      const ms = startOfMonth(month)
      const me = endOfMonth(month)
      const mt = transactions.filter(t => { const d = parseISO(t.date); return d >= ms && d <= me })
      const income = mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expense = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      return {
        month: format(month, 'MMM/yy', { locale: ptBR }),
        receitas: income,
        despesas: expense,
        saldo: income - expense,
      }
    })
  }, [transactions, dateRange])

  // ── Por categoria (período ativo) ─────────────────────────────────────────
  const categoryData = useMemo(() => {
    const expCats = categories
      .filter(c => c.type === 'expense')
      .map(cat => ({
        name: cat.name,
        despesas: filtered.filter(t => t.categoryId === cat.id && t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        receitas: 0,
        color: cat.color,
        type: 'expense' as const,
      }))
      .filter(c => c.despesas > 0)

    const incCats = categories
      .filter(c => c.type === 'income')
      .map(cat => ({
        name: cat.name,
        receitas: filtered.filter(t => t.categoryId === cat.id && t.type === 'income').reduce((s, t) => s + t.amount, 0),
        despesas: 0,
        color: cat.color,
        type: 'income' as const,
      }))
      .filter(c => c.receitas > 0)

    return {
      expenses: expCats.sort((a, b) => b.despesas - a.despesas),
      income: incCats.sort((a, b) => b.receitas - a.receitas),
    }
  }, [filtered, categories])

  // ── Comparação por categoria (barras horizontais) ─────────────────────────
  const categoryComparison = useMemo(() => {
    const all = new Set<string>([
      ...categories.filter(c => c.type === 'expense').map(c => c.name),
      ...categories.filter(c => c.type === 'income').map(c => c.name),
    ])
    return Array.from(all).map(name => {
      const ec = categories.find(c => c.name === name && c.type === 'expense')
      const ic = categories.find(c => c.name === name && c.type === 'income')
      const exp = ec ? filtered.filter(t => t.categoryId === ec.id && t.type === 'expense').reduce((s, t) => s + t.amount, 0) : 0
      const inc = ic ? filtered.filter(t => t.categoryId === ic.id && t.type === 'income').reduce((s, t) => s + t.amount, 0) : 0
      return { category: name, receitas: inc, despesas: exp, total: inc + exp }
    })
      .filter(i => i.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
  }, [filtered, categories])

  // ── Top categorias despesas ────────────────────────────────────────────────
  const topExpense = useMemo(() => {
    const map = new Map<string, { name: string; total: number; color: string }>()
    filtered.filter(t => t.type === 'expense').forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId)
      if (cat) {
        const cur = map.get(cat.id) || { name: cat.name, total: 0, color: cat.color }
        cur.total += t.amount
        map.set(cat.id, cur)
      }
    })
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 5)
  }, [filtered, categories])

  // ── Despesas Fixas vs Variáveis ─────────────────────────────────────────────
  const fixedVsVariable = useMemo(() => {
    let fixed = 0
    let variable = 0
    filtered.filter(t => t.type === 'expense').forEach(t => {
      if (t.isRecurring || t.parentTransactionId) {
        fixed += t.amount
      } else {
        variable += t.amount
      }
    })
    return [
      { name: 'Despesas Fixas', value: fixed, color: '#f59e0b' },
      { name: 'Despesas Variáveis', value: variable, color: '#3b82f6' }
    ].filter(i => i.value > 0)
  }, [filtered])

  // ── Métricas Avançadas ─────────────────────────────────────────────────────
  const savingsRate = summary.income > 0 ? ((summary.income - summary.expense) / summary.income) * 100 : 0
  const daysInPeriod = useMemo(() => {
    const diffTime = Math.abs(dateRange.end.getTime() - dateRange.start.getTime())
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }, [dateRange])
  const avgDailySpend = summary.expense > 0 ? summary.expense / daysInPeriod : 0

  // ── Gastos por Dia da Semana ────────────────────────────────────────────────
  const spendByDayOfWeek = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const data = days.map(day => ({ day, total: 0 }))
    filtered.filter(t => t.type === 'expense').forEach(t => {
      // Ajuste de fuso horário local
      const d = parseISO(t.date)
      const date = new Date(d.getTime() + d.getTimezoneOffset() * 60000)
      data[date.getDay()].total += t.amount
    })
    return data
  }, [filtered])

  // ── Exportação ────────────────────────────────────────────────────────────
  const buildExportData = () => {
    const expCategoryMap = new Map<string, number>()
    const incCategoryMap = new Map<string, number>()

    filtered.forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId)
      const name = cat?.name || 'Sem categoria'
      if (t.type === 'expense') expCategoryMap.set(name, (expCategoryMap.get(name) || 0) + t.amount)
      else incCategoryMap.set(name, (incCategoryMap.get(name) || 0) + t.amount)
    })

    const totalAll = filtered.reduce((s, t) => s + t.amount, 0)

    const breakdown = [
      ...Array.from(expCategoryMap.entries()).map(([category, amount]) => ({
        category,
        type: 'expense' as const,
        amount,
        percentage: totalAll > 0 ? (amount / totalAll) * 100 : 0,
      })),
      ...Array.from(incCategoryMap.entries()).map(([category, amount]) => ({
        category,
        type: 'income' as const,
        amount,
        percentage: totalAll > 0 ? (amount / totalAll) * 100 : 0,
      })),
    ].sort((a, b) => b.amount - a.amount)

    return {
      transactions: filtered.map(t => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: categories.find(c => c.id === t.categoryId)?.name || 'Sem categoria',
        date: t.date,
      })),
      period: `${format(dateRange.start, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} – ${format(dateRange.end, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
      periodLabel,
      totalIncome: summary.income,
      totalExpense: summary.expense,
      balance: summary.balance,
      userName: user?.name || 'Usuário',
      categoryBreakdown: breakdown,
    }
  }

  const handleExport = async (type: 'pdf' | 'excel' | 'csv') => {
    if (!user?.isPremium) {
      toast.error('Exportação é exclusiva do plano Premium')
      return
    }
    try {
      setIsExporting(true)
      const data = buildExportData()
      if (type === 'pdf') exportService.exportToPDF(data)
      else if (type === 'excel') exportService.exportToExcel(data)
      else exportService.exportToCSV(data)
      toast.success(`Relatório ${type.toUpperCase()} gerado com sucesso!`)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao gerar relatório.')
    } finally {
      setIsExporting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageTransition>
      <div className="responsive-page">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="responsive-header">
          <div className="hidden sm:block">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">Análise detalhada das suas finanças</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              Excel
            </button>
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              CSV
            </button>
          </div>
        </div>

        {/* ── FILTROS ──────────────────────────────────────────────────────── */}
        <div className="card border border-primary-100 dark:border-primary-900/40 bg-primary-50/40 dark:bg-primary-950/20">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Filtrar Período</h2>
            <span className="ml-auto text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
              {periodLabel}
            </span>
          </div>

          {/* Modos */}
          <div className="flex gap-2 flex-wrap mb-4">
            {([
              { mode: 'month', label: 'Mês', icon: Calendar },
              { mode: 'period', label: 'Período', icon: BarChart3 },
              { mode: 'custom', label: 'Personalizado', icon: CalendarRange },
            ] as const).map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${filterMode === mode
                  ? 'bg-primary-600 dark:bg-primary-500 text-white border-primary-600 dark:border-primary-500 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Controles dinâmicos */}
          <div className="flex items-center flex-wrap gap-3">
            {filterMode === 'month' && (
              <input
                type="month"
                value={selectedMonth}
                max={format(new Date(), 'yyyy-MM')}
                onChange={e => setSelectedMonth(e.target.value)}
                className="input-field max-w-[220px]"
              />
            )}

            {filterMode === 'period' && (
              <div className="flex gap-2 flex-wrap">
                {PERIODS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setSelectedPeriod(p.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${selectedPeriod === p.value
                      ? 'bg-primary-600 dark:bg-primary-500 text-white border-transparent'
                      : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {filterMode === 'custom' && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-neutral-400 font-medium">De</label>
                  <input
                    type="date"
                    value={customFrom}
                    max={customTo}
                    onChange={e => setCustomFrom(e.target.value)}
                    className="input-field max-w-[180px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-neutral-400 font-medium">Até</label>
                  <input
                    type="date"
                    value={customTo}
                    min={customFrom}
                    max={format(new Date(), 'yyyy-MM-dd')}
                    onChange={e => setCustomTo(e.target.value)}
                    className="input-field max-w-[180px]"
                  />
                </div>
              </div>
            )}

            <span className="text-xs text-gray-400 dark:text-neutral-500 ml-auto">
              {summary.count} transação{summary.count !== 1 ? 'ões' : ''} no período
            </span>
          </div>
        </div>

        {/* ── CARDS DE RESUMO ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Receitas */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Receitas</h3>
              <div className="w-9 h-9 bg-success-50 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400 animate-arrow-up" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{fmtCurrency(summary.income)}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${comparison.income.change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {fmtPct(comparison.income.change)}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400">vs período anterior</span>
            </div>
          </div>

          {/* Despesas */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Despesas</h3>
              <div className="w-9 h-9 bg-danger-50 dark:bg-danger-900/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400 animate-arrow-down" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{fmtCurrency(summary.expense)}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${comparison.expense.change <= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {fmtPct(comparison.expense.change)}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400">vs período anterior</span>
            </div>
          </div>

          {/* Saldo */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Saldo do Período</h3>
              <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <p className={`text-2xl font-bold mb-1 ${summary.balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-danger-600 dark:text-danger-400'}`}>
              {fmtCurrency(summary.balance)}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${comparison.balance.change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {fmtPct(comparison.balance.change)}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400">vs período anterior</span>
            </div>
          </div>
        </div>

        {/* ── MÉTRICAS PREMIUM INDICATORS ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="card p-5 flex flex-col justify-center items-center text-center min-w-0">
            <span className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider block truncate w-full">Taxa de Poupança</span>
            <p className={`text-xl md:text-2xl font-bold truncate w-full ${savingsRate >= 20 ? 'text-success-600 dark:text-success-400' : savingsRate > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-danger-600 dark:text-danger-400'}`}>
              {savingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="card p-5 flex flex-col justify-center items-center text-center min-w-0">
            <span className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider block truncate w-full">Gasto Diário</span>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate w-full">
              {fmtCurrency(avgDailySpend)}
            </p>
          </div>
          <div className="card p-5 flex flex-col justify-center items-center text-center min-w-0">
            <span className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider block truncate w-full">Maior Despesa</span>
            <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate w-full px-1" title={topExpense[0]?.name || '-'}>
              {topExpense.length > 0 ? fmtCurrency(topExpense[0].total) : 'R$ 0,00'}
            </p>
          </div>
          <div className="card p-5 flex flex-col justify-center items-center text-center min-w-0">
            <span className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider block truncate w-full">Dias Analisados</span>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate w-full">
              {daysInPeriod} <span className="text-xs font-normal text-gray-400">dias</span>
            </p>
          </div>
        </div>

        {/* ── TOP CATEGORIAS MAIS GASTADAS ─────────────────────────────────── */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <div className="w-2 h-5 bg-danger-500 rounded" />
            Top Categorias Mais Gastadas
            <span className="ml-2 text-xs text-gray-400 dark:text-neutral-500 font-normal">{periodLabel}</span>
          </h3>
          {topExpense.length > 0 ? (
            <div className="space-y-4">
              {topExpense.map((cat, i) => {
                const pct = summary.expense > 0 ? (cat.total / summary.expense) * 100 : 0
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-neutral-300">{i + 1}</span>
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{fmtCurrency(cat.total)}</p>
                        <p className="text-xs text-gray-400 dark:text-neutral-500">{pct.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-neutral-500 py-8 text-sm">Nenhuma despesa no período selecionado</p>
          )}
        </div>

        {/* ── EVOLUÇÃO MENSAL E DIAS DA SEMANA ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Evolução Financeira</h3>
              <span className="text-xs text-gray-400 dark:text-neutral-500 px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full">{periodLabel}</span>
            </div>
            <div className="container-responsive">
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={monthlyEvolution}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-10" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 13, backgroundColor: 'var(--tooltip-bg, #fff)' }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="receitas" stroke="#22c55e" fillOpacity={1} fill="url(#colorReceitas)" strokeWidth={3} name="Receitas" />
                  <Area type="monotone" dataKey="despesas" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesas)" strokeWidth={3} name="Despesas" />
                  <Line type="monotone" dataKey="saldo" stroke="#0ea5e9" strokeWidth={2} name="Saldo" dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} strokeDasharray="4 4" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card lg:col-span-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Despesas por Dia</h3>
            </div>
            <div className="container-responsive">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={spendByDayOfWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-10" vertical={false} />
                  <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 13 }} />
                  <Bar dataKey="total" fill="#primary" radius={[4, 4, 0, 0]}>
                    {spendByDayOfWeek.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.total === Math.max(...spendByDayOfWeek.map(d => d.total)) ? '#ef4444' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── RECEITAS vs DESPESAS POR CATEGORIA ───────────────────────────── */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Receitas e Despesas por Categoria</h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Top 10 por volume — {periodLabel}</p>
            </div>
          </div>
          {categoryComparison.length > 0 ? (
            <div className="container-responsive">
              <ResponsiveContainer width="100%" height={Math.max(300, categoryComparison.length * 40)}>
                <ComposedChart data={categoryComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="category" type="category" stroke="#6b7280" tick={{ fontSize: 11 }} width={130} />
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="receitas" fill="#22c55e" name="Receitas" radius={[0, 6, 6, 0]} />
                  <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[0, 6, 6, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-neutral-500 py-10 text-sm">Nenhuma transação no período selecionado</p>
          )}
        </div>

        {/* ── GRÁFICOS DE PIZZA ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição de Receitas */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distribuição de Receitas</h3>
              <span className="text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">{periodLabel}</span>
            </div>
            {categoryData.income.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData.income}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="receitas"
                    isAnimationActive
                    animationDuration={1000}
                  >
                    {categoryData.income.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400 dark:text-neutral-500 text-sm">
                Nenhuma receita no período selecionado
              </div>
            )}
          </div>

          {/* Distribuição de Despesas */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distribuição de Despesas</h3>
              <span className="text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">{periodLabel}</span>
            </div>
            {categoryData.expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData.expenses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="despesas"
                    isAnimationActive
                    animationDuration={1000}
                  >
                    {categoryData.expenses.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400 dark:text-neutral-500 text-sm">
                Nenhuma despesa no período selecionado
              </div>
            )}
          </div>
        </div>

        {/* ── DETALHAMENTO POR CATEGORIA ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receitas */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-5 bg-success-500 rounded" />
                Receitas por Categoria
              </h3>
              <span className="text-xs text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 px-3 py-1 rounded-full font-medium">{periodLabel}</span>
            </div>
            {categoryData.income.length > 0 ? (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {categoryData.income.map(item => {
                  const total = categoryData.income.reduce((s, c) => s + c.receitas, 0)
                  const pct = total > 0 ? (item.receitas / total) * 100 : 0
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-success-600 dark:text-success-400">{fmtCurrency(item.receitas)}</p>
                          <p className="text-xs text-gray-400">{pct.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-3 border-t border-gray-200 dark:border-neutral-800 flex justify-between">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-success-600 dark:text-success-400">{fmtCurrency(summary.income)}</span>
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400 dark:text-neutral-500 text-sm">Nenhuma receita no período</p>
            )}
          </div>

          {/* Despesas */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-5 bg-danger-500 rounded" />
                Despesas por Categoria
              </h3>
              <span className="text-xs text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 px-3 py-1 rounded-full font-medium">{periodLabel}</span>
            </div>
            {categoryData.expenses.length > 0 ? (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {categoryData.expenses.map(item => {
                  const total = categoryData.expenses.reduce((s, c) => s + c.despesas, 0)
                  const pct = total > 0 ? (item.despesas / total) * 100 : 0
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-danger-600 dark:text-danger-400">{fmtCurrency(item.despesas)}</p>
                          <p className="text-xs text-gray-400">{pct.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-3 border-t border-gray-200 dark:border-neutral-800 flex justify-between">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-danger-600 dark:text-danger-400">{fmtCurrency(summary.expense)}</span>
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400 dark:text-neutral-500 text-sm">Nenhuma despesa no período</p>
            )}
          </div>
        </div>

        {/* ── ANÁLISES AVANÇADAS PREMIUM ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Radar - Perfil de Gastos */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Perfil de Gastos (Top 6)</h3>
              <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full font-medium">Radar</span>
            </div>
            {topExpense.length >= 3 ? (
              <div className="overflow-hidden min-w-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={topExpense.slice(0, 6)}>
                    <PolarGrid stroke="#e5e7eb" className="dark:opacity-20" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Radar dataKey="total" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} activeDot={{ r: 6 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-400 dark:text-neutral-500 py-10 text-sm">Necessita de pelo menos 3 categorias de despesa para traçar o perfil</p>
            )}
          </div>

          {/* Fixas vs Variáveis */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Despesas Fixas vs Variáveis</h3>
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full font-medium">Composição</span>
            </div>
            {fixedVsVariable.length > 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={fixedVsVariable}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      isAnimationActive
                      animationDuration={1000}
                    >
                      {fixedVsVariable.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: 13, paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-400 dark:text-neutral-500 py-10 text-sm">Nenhuma dado de despesa mapeado</p>
            )}
          </div>
        </div>

      </div>
    </PageTransition>
  )
}

export default Reports
