import { useMemo, useState } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { useAuthStore } from '@/store/authStore'
import {
  Bar,
  LineChart,
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
} from 'recharts'
import { format, startOfMonth, endOfMonth, subMonths, eachMonthOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, TrendingDown, DollarSign, FileText, FileSpreadsheet, FileDown } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { exportService } from '@/services/exportService'
import { toast } from 'react-hot-toast'

const Reports = () => {
  const { transactions, categories } = useFinancialStore()
  const { user } = useAuthStore()
  const [period, setPeriod] = useState<'3' | '6' | '12'>('6')
  const [isExporting, setIsExporting] = useState(false)

  // Dados para gráfico de evolução mensal
  const monthlyEvolution = useMemo(() => {
    const months = parseInt(period)
    const startDate = subMonths(new Date(), months - 1)
    const endDate = new Date()
    
    const monthsArray = eachMonthOfInterval({ start: startDate, end: endDate })
    
    return monthsArray.map((month) => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= monthStart && tDate <= monthEnd
      })
      
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        month: format(month, 'MMM/yy', { locale: ptBR }),
        receitas: income,
        despesas: expense,
        saldo: income - expense,
      }
    })
  }, [transactions, period])

  // Atualizar dados de categorias para incluir receitas e despesas DO MES ATUAL
  const categoryData = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Filtrar apenas transações do mês atual
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate >= monthStart && tDate <= monthEnd
    })

    // Despesas por categoria (apenas do mês atual)
    const expensesByCategory = categories
      .filter((cat) => cat.type === 'expense')
      .map((cat) => {
        const total = monthTransactions
          .filter((t) => t.categoryId === cat.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
        
        return {
          name: cat.name,
          despesas: total,
          receitas: 0,
          color: cat.color,
          type: 'expense' as const,
        }
      })
      .filter((item) => item.despesas > 0)
    
    // Receitas por categoria (apenas do mês atual)
    const incomeByCategory = categories
      .filter((cat) => cat.type === 'income')
      .map((cat) => {
        const total = monthTransactions
          .filter((t) => t.categoryId === cat.id && t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
        
        return {
          name: cat.name,
          receitas: total,
          despesas: 0,
          color: cat.color,
          type: 'income' as const,
        }
      })
      .filter((item) => item.receitas > 0)
    
    return {
      expenses: expensesByCategory.sort((a, b) => b.despesas - a.despesas),
      income: incomeByCategory.sort((a, b) => b.receitas - a.receitas),
      combined: [...expensesByCategory, ...incomeByCategory].sort((a, b) => 
        (b.receitas + b.despesas) - (a.receitas + a.despesas)
      ),
    }
  }, [transactions, categories])

  // Dados para comparação lado a lado de receitas e despesas por categoria (MES ATUAL)
  const categoryComparison = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Filtrar apenas transações do mês atual
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate >= monthStart && tDate <= monthEnd
    })

    const allCategories = new Set([
      ...categories.filter(c => c.type === 'expense').map(c => c.name),
      ...categories.filter(c => c.type === 'income').map(c => c.name),
    ])
    
    return Array.from(allCategories).map(catName => {
      const expenseCat = categories.find(c => c.name === catName && c.type === 'expense')
      const incomeCat = categories.find(c => c.name === catName && c.type === 'income')
      
      const expenses = expenseCat 
        ? monthTransactions
            .filter(t => t.categoryId === expenseCat.id && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
        : 0
      
      const income = incomeCat
        ? monthTransactions
            .filter(t => t.categoryId === incomeCat.id && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
        : 0
      
      return {
        category: catName,
        receitas: income,
        despesas: expenses,
        total: income + expenses,
      }
    }).filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10) // Top 10 categorias
  }, [transactions, categories])

  // Dados para comparação mensal
  const monthlyComparison = useMemo(() => {
    const currentMonth = new Date()
    const lastMonth = subMonths(currentMonth, 1)
    
    const getCurrentMonthData = (date: Date) => {
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= monthStart && tDate <= monthEnd
      })
      
      return {
        income: monthTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expense: monthTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0),
      }
    }
    
    const current = getCurrentMonthData(currentMonth)
    const last = getCurrentMonthData(lastMonth)
    
    return {
      income: {
        current: current.income,
        last: last.income,
        change: last.income > 0 ? ((current.income - last.income) / last.income) * 100 : 0,
      },
      expense: {
        current: current.expense,
        last: last.expense,
        change: last.expense > 0 ? ((current.expense - last.expense) / last.expense) * 100 : 0,
      },
      balance: {
        current: current.income - current.expense,
        last: last.income - last.expense,
        change: (last.income - last.expense) > 0 
          ? (((current.income - current.expense) - (last.income - last.expense)) / (last.income - last.expense)) * 100 
          : 0,
      },
    }
  }, [transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Totais gerais de todos os meses
  const totalStats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    }
  }, [transactions])

  // Médias mensais
  const monthlyAverages = useMemo(() => {
    // Agrupar transações por mês
    const monthsMap = new Map<string, { income: number; expense: number }>()
    
    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      
      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, { income: 0, expense: 0 })
      }
      
      const monthData = monthsMap.get(monthKey)!
      if (t.type === 'income') {
        monthData.income += t.amount
      } else {
        monthData.expense += t.amount
      }
    })
    
    const monthCount = monthsMap.size || 1
    const totals = Array.from(monthsMap.values())
    
    const avgIncome = totals.reduce((sum, m) => sum + m.income, 0) / monthCount
    const avgExpense = totals.reduce((sum, m) => sum + m.expense, 0) / monthCount
    
    return {
      income: avgIncome,
      expense: avgExpense,
      balance: avgIncome - avgExpense,
      monthCount,
    }
  }, [transactions])

  // Top categorias mais gastadas
  const topExpenseCategories = useMemo(() => {
    const categoryTotals = new Map<string, { name: string; total: number; color: string }>()
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const category = categories.find((c) => c.id === t.categoryId)
        if (category) {
          const current = categoryTotals.get(category.id) || { name: category.name, total: 0, color: category.color }
          current.total += t.amount
          categoryTotals.set(category.id, current)
        }
      })
    
    return Array.from(categoryTotals.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
  }, [transactions, categories])

  // Preparar dados para exportação
  const prepareExportData = () => {
    const months = parseInt(period)
    const startDate = subMonths(new Date(), months - 1)
    const endDate = new Date()
    
    const periodTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate >= startDate && tDate <= endDate
    })
    
    const totalIncome = periodTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = periodTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    // Agrupar por categoria
    const categoryMap = new Map<string, number>()
    periodTransactions.forEach((t) => {
      const category = categories.find(c => c.id === t.categoryId)
      const catName = category?.name || 'Sem categoria'
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + t.amount)
    })
    
    const totalAmount = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0)
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
    
    return {
      transactions: periodTransactions.map(t => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: categories.find(c => c.id === t.categoryId)?.name || 'Sem categoria',
        date: t.date
      })),
      period: `${format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - ${format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown
    }
  }
  
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      setIsExporting(true)
      const data = prepareExportData()
      const userName = user?.name || 'Usuário'
      
      switch (format) {
        case 'pdf':
          exportService.exportToPDF(data, userName)
          toast.success('Relatório PDF gerado com sucesso!')
          break
        case 'excel':
          exportService.exportToExcel(data)
          toast.success('Relatório Excel gerado com sucesso!')
          break
        case 'csv':
          exportService.exportToCSV(data)
          toast.success('Relatório CSV gerado com sucesso!')
          break
      }
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast.error('Erro ao gerar relatório. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <PageTransition>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Análise detalhada das suas finanças
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            {isExporting ? 'Gerando...' : 'PDF'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExporting ? 'Gerando...' : 'Excel'}
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="w-4 h-4" />
            {isExporting ? 'Gerando...' : 'CSV'}
          </button>
        </div>
      </div>

      {/* Comparação Mensal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Receitas do Mês</h3>
            <div className="w-10 h-10 bg-success-50 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(monthlyComparison.income.current)}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                monthlyComparison.income.change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
              }`}
            >
              {formatPercent(monthlyComparison.income.change)}
            </span>
            <span className="text-sm text-gray-500 dark:text-neutral-400">vs mês anterior</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Despesas do Mês</h3>
            <div className="w-10 h-10 bg-danger-50 dark:bg-danger-900/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(monthlyComparison.expense.current)}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                monthlyComparison.expense.change <= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
              }`}
            >
              {formatPercent(monthlyComparison.expense.change)}
            </span>
            <span className="text-sm text-gray-500 dark:text-neutral-400">vs mês anterior</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Saldo do Mês</h3>
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(monthlyComparison.balance.current)}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                monthlyComparison.balance.change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
              }`}
            >
              {formatPercent(monthlyComparison.balance.change)}
            </span>
            <span className="text-sm text-gray-500 dark:text-neutral-400">vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Totais Gerais - Todos os Meses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-green-600 dark:bg-green-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Total de Receitas Anual</h3>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {formatCurrency(totalStats.income)}
          </p>
          <p className="text-xs text-white/80">
            Soma de todas as receitas
          </p>
        </div>

        <div className="card bg-red-600 dark:bg-red-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Total de Despesas Anual</h3>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {formatCurrency(totalStats.expense)}
          </p>
          <p className="text-xs text-white/80">
            Soma de todas as despesas
          </p>
        </div>

        <div className="card bg-primary-600 dark:bg-primary-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Saldo Total Anual</h3>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {formatCurrency(totalStats.balance)}
          </p>
          <p className="text-xs text-white/80">
            Receitas - Despesas (todos os meses)
          </p>
        </div>
      </div>

      {/* Médias Mensais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Média de Receitas/Mês</h3>
            <div className="w-10 h-10 bg-success-50 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(monthlyAverages.income)}
          </p>
          <p className="text-xs text-gray-500 dark:text-neutral-400">
            Baseado em {monthlyAverages.monthCount} {monthlyAverages.monthCount === 1 ? 'mês' : 'meses'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Média de Despesas/Mês</h3>
            <div className="w-10 h-10 bg-danger-50 dark:bg-danger-900/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(monthlyAverages.expense)}
          </p>
          <p className="text-xs text-gray-500 dark:text-neutral-400">
            Baseado em {monthlyAverages.monthCount} {monthlyAverages.monthCount === 1 ? 'mês' : 'meses'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400">Média de Saldo/Mês</h3>
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className={`text-2xl font-bold mb-2 ${monthlyAverages.balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-danger-600 dark:text-danger-400'}`}>
            {formatCurrency(monthlyAverages.balance)}
          </p>
          <p className="text-xs text-gray-500 dark:text-neutral-400">
            Baseado em {monthlyAverages.monthCount} {monthlyAverages.monthCount === 1 ? 'mês' : 'meses'}
          </p>
        </div>
      </div>

      {/* Top Categorias Mais Gastadas */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Categorias Mais Gastadas
        </h3>
        {topExpenseCategories.length > 0 ? (
          <div className="space-y-4">
            {topExpenseCategories.map((cat, index) => {
              const percentage = totalStats.expense > 0 ? (cat.total / totalStats.expense) * 100 : 0
              return (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 text-sm font-bold text-gray-700 dark:text-neutral-300">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(cat.total)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        {percentage.toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-neutral-400 py-8">
            Nenhuma despesa registrada
          </p>
        )}
      </div>

      {/* Evolução Mensal */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Evolução Financeira
          </h3>
          <div className="flex gap-2">
            {(['3', '6', '12'] as const).map((months) => (
              <button
                key={months}
                onClick={() => setPeriod(months)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === months
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                {months} meses
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyEvolution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" stroke="#6b7280" className="dark:text-neutral-400" />
            <YAxis stroke="#6b7280" className="dark:text-neutral-400" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="receitas"
              stroke="#22c55e"
              strokeWidth={2}
              name="Receitas"
              dot={{ fill: '#22c55e', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="despesas"
              stroke="#ef4444"
              strokeWidth={2}
              name="Despesas"
              dot={{ fill: '#ef4444', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Saldo"
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparação de Receitas vs Despesas por Categoria */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Receitas e Despesas por Categoria
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
              Dados do mês atual • Top 10 categorias por volume
            </p>
          </div>
          <span className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full font-medium">
            {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={categoryComparison} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis type="number" stroke="#6b7280" className="dark:text-neutral-400" />
            <YAxis dataKey="category" type="category" stroke="#6b7280" className="dark:text-neutral-400" width={120} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar 
              dataKey="receitas" 
              fill="#22c55e" 
              name="Receitas"
              radius={[0, 8, 8, 0]}
            />
            <Bar 
              dataKey="despesas" 
              fill="#ef4444" 
              name="Despesas"
              radius={[0, 8, 8, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos de Distribuição lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Receitas */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Distribuição de Receitas
            </h3>
            <span className="text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
              {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
            </span>
          </div>
          {categoryData.income.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.income}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="receitas"
                >
                  {categoryData.income.map((entry, index) => (
                    <Cell key={`cell-income-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-neutral-400">
              Nenhuma receita registrada este mês
            </div>
          )}
        </div>

        {/* Distribuição de Despesas */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Distribuição de Despesas
            </h3>
            <span className="text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
              {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
            </span>
          </div>
          {categoryData.expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.expenses}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="despesas"
                >
                  {categoryData.expenses.map((entry, index) => (
                    <Cell key={`cell-expense-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-neutral-400">
              Nenhuma despesa registrada este mês
            </div>
          )}
        </div>
      </div>

      {/* Resumo Detalhado - Receitas e Despesas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo de Receitas */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-success-500 rounded"></div>
              Resumo de Receitas
            </h3>
            <span className="text-xs text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 px-3 py-1 rounded-full font-medium">
              Mês Atual
            </span>
          </div>
          {categoryData.income.length > 0 ? (
            <div className="space-y-4">
              {categoryData.income.map((item) => {
                const totalIncome = categoryData.income.reduce((sum, cat) => sum + cat.receitas, 0)
                const percentage = (item.receitas / totalIncome) * 100
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success-600 dark:text-success-400">
                          {formatCurrency(item.receitas)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              <div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total de Receitas</span>
                  <span className="font-bold text-success-600 dark:text-success-400 text-lg">
                    {formatCurrency(categoryData.income.reduce((sum, cat) => sum + cat.receitas, 0))}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
              Nenhuma receita registrada este mês
            </div>
          )}
        </div>

        {/* Resumo de Despesas */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-danger-500 rounded"></div>
              Resumo de Despesas
            </h3>
            <span className="text-xs text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 px-3 py-1 rounded-full font-medium">
              Mês Atual
            </span>
          </div>
          {categoryData.expenses.length > 0 ? (
            <div className="space-y-4">
              {categoryData.expenses.map((item) => {
                const totalExpense = categoryData.expenses.reduce((sum, cat) => sum + cat.despesas, 0)
                const percentage = (item.despesas / totalExpense) * 100
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-danger-600 dark:text-danger-400">
                          {formatCurrency(item.despesas)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              <div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total de Despesas</span>
                  <span className="font-bold text-danger-600 dark:text-danger-400 text-lg">
                    {formatCurrency(categoryData.expenses.reduce((sum, cat) => sum + cat.despesas, 0))}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
              Nenhuma despesa registrada este mês
            </div>
          )}
        </div>
      </div>
    </div>
    </PageTransition>
  )
}

export default Reports
