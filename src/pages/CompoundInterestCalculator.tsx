import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Calculator,
  Percent,
  Wallet,
  Clock,
  RotateCcw,
  PieChart as PieChartIcon,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-hot-toast'
import PageTransition from '@/components/common/PageTransition'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import CustomDatePicker from '@/components/common/CustomDatePicker'
import { haptics } from '@/utils/haptics'
import { motion } from 'framer-motion'

interface YearlyBreakdown {
  year: number
  investment: number
  interest: number
  balance: number
}

interface MonthlyBreakdown {
  month: string
  investment: number
  interest: number
  balance: number
}

interface CalculationResult {
  finalAmount: number
  totalInvested: number
  totalInterest: number
  yearlyBreakdown: YearlyBreakdown[]
  monthlyBreakdown: MonthlyBreakdown[]
}

const CompoundInterestCalculator = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.isPremium) {
      toast.error('Calculadoras são exclusivas do plano Premium')
      navigate('/plans')
    }
  }, [user, navigate])

  const [initialValue, setInitialValue] = useState('10000')
  const [monthlyContribution, setMonthlyContribution] = useState('400')
  const [interestRate, setInterestRate] = useState('8')
  const [period, setPeriod] = useState('10')
  const [periodType, setPeriodType] = useState<'Mensal' | 'Anual'>('Anual')
  const [compoundFrequency, setCompoundFrequency] = useState<'Anual' | 'Mensal'>('Anual')
  const [startDate, setStartDate] = useState('2025-11-13')
  const [showAnnual, setShowAnnual] = useState(true)
  const [resultTab, setResultTab] = useState<'charts' | 'table'>('charts')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculate = () => {
    const principal = parseFloat(initialValue) || 0
    const monthlyDeposit = parseFloat(monthlyContribution) || 0
    const annualRate = parseFloat(interestRate) / 100
    const totalMonths = compoundFrequency === 'Mensal' ? parseInt(period) : parseInt(period) * 12

    if (totalMonths <= 0 || annualRate < 0) {
      return
    }

    const yearlyData: YearlyBreakdown[] = []
    const monthlyData: MonthlyBreakdown[] = []
    let balance = principal
    let totalInvested = principal
    const startYear = new Date(startDate).getFullYear()
    const startMonth = new Date(startDate).getMonth()
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    for (let monthIndex = 0; monthIndex < totalMonths; monthIndex++) {
      const monthlyRate = annualRate / 12
      const monthInterest = balance * monthlyRate
      balance = balance + monthInterest + monthlyDeposit
      totalInvested += monthlyDeposit

      const currentMonth = (startMonth + monthIndex) % 12
      const currentYear = startYear + Math.floor((startMonth + monthIndex) / 12)

      monthlyData.push({
        month: `${monthNames[currentMonth]}/${currentYear}`,
        investment: totalInvested,
        interest: monthInterest,
        balance: balance,
      })

      if ((monthIndex + 1) % 12 === 0 || monthIndex === totalMonths - 1) {
        yearlyData.push({
          year: currentYear,
          investment: totalInvested,
          interest: balance - totalInvested,
          balance: balance,
        })
      }
    }

    setResult({
      finalAmount: balance,
      totalInvested: totalInvested,
      totalInterest: balance - totalInvested,
      yearlyBreakdown: yearlyData,
      monthlyBreakdown: monthlyData,
    })
    haptics.success()
  }

  const clear = () => {
    haptics.light()
    setInitialValue('10000')
    setMonthlyContribution('400')
    setInterestRate('8')
    setPeriod('10')
    setPeriodType('Anual')
    setCompoundFrequency('Anual')
    setStartDate('2025-11-13')
    setResult(null)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  const pieData = result
    ? [
        { name: 'Investimento Inicial', value: parseFloat(initialValue) || 0, color: '#0284c7' },
        { name: 'Aportes Contínuos', value: result.totalInvested - (parseFloat(initialValue) || 0), color: '#38bdf8' },
        { name: 'Juros Acumulados', value: result.totalInterest, color: '#10b981' },
      ]
    : []

  const barData =
    result?.yearlyBreakdown.map((item) => ({
      year: item.year.toString(),
      'Investimento Total': item.investment,
      'Total de Juros': item.interest,
    })) || []

  return (
    <PageTransition>
      <div className="responsive-page max-w-6xl mx-auto space-y-5 sm:space-y-6">
        {/* Cabeçalho Nativo Mobile & Desktop */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 dark:text-primary-400 border border-primary-100/60 dark:border-primary-900/40 shadow-sm flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-neutral-900 dark:text-white leading-tight">
                Calculadora de Juros Compostos
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Simule a evolução do seu patrimônio com o poder dos juros
              </p>
            </div>
          </div>
        </div>

        {/* Card Formulário de Simulação */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display">
              Parâmetros do Investimento
            </h2>
          </div>

          {/* Grid de Inputs em 2 Colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Investimento Inicial */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                Investimento Inicial
              </label>
              <div className="relative flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 sm:py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400 flex-shrink-0 border border-primary-100/60 dark:border-primary-900/30">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono">R$</span>
                <input
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                  className="flex-1 bg-transparent text-sm sm:text-base font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0 font-sans"
                  placeholder="Ex: 10000"
                  step="100"
                  inputMode="decimal"
                />
              </div>
            </div>

            {/* 2. Aporte Periódico */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                Aporte Recorrente
              </label>
              <div className="relative flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 sm:py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex-shrink-0 border border-emerald-100/60 dark:border-emerald-900/30">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono">R$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="flex-1 bg-transparent text-sm sm:text-base font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0 font-sans"
                  placeholder="Ex: 400"
                  step="50"
                  inputMode="decimal"
                />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                  /{compoundFrequency === 'Mensal' ? 'mês' : 'mês'}
                </span>
              </div>
            </div>

            {/* 3. Taxa de Juros Anual */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                Taxa Anual (% a.a.)
              </label>
              <div className="relative flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 sm:py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex-shrink-0 border border-emerald-100/60 dark:border-emerald-900/30">
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="flex-1 bg-transparent text-sm sm:text-base font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0 font-sans"
                  placeholder="Ex: 8"
                  step="0.5"
                  inputMode="decimal"
                />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">% a.a.</span>
              </div>
            </div>

            {/* 4. Período / Duração */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                Tempo de Aplicação
              </label>
              <div className="relative flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 sm:py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex-shrink-0 border border-indigo-100/60 dark:border-indigo-900/30">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <input
                  type="number"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="flex-1 bg-transparent text-sm sm:text-base font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0 font-sans"
                  placeholder="Ex: 10"
                  min="1"
                  inputMode="numeric"
                />
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 font-display">
                  {compoundFrequency === 'Mensal' ? 'Meses' : 'Anos'}
                </span>
              </div>
            </div>
          </div>

          {/* Segunda Linha: Frequência, Data e Ações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end pt-1">
            {/* Segmented Control de Periodicidade */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                Frequência de Capitalização
              </label>
              <div className="p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setCompoundFrequency('Anual')
                    setPeriodType('Anual')
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-display transition-all ${
                    compoundFrequency === 'Anual'
                      ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Anual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setCompoundFrequency('Mensal')
                    setPeriodType('Mensal')
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-display transition-all ${
                    compoundFrequency === 'Mensal'
                      ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Mensal
                </button>
              </div>
            </div>

            {/* Data de Início */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                Data de Início
              </label>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 overflow-hidden">
                <CustomDatePicker value={startDate} onChange={setStartDate} />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={calculate}
                className="flex-1 py-3 sm:py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-sm shadow-primary-500/20 active:scale-98 transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Calcular Simulação</span>
              </button>

              <button
                type="button"
                onClick={clear}
                className="p-3 sm:p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all"
                title="Limpar formulário"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Exibição do Resultado */}
        {result ? (
          <div className="space-y-4 sm:space-y-5">
            {/* Hero Card do Resultado */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display">
                    Patrimônio Estimado Acumulado
                  </span>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    Após {period} {periodType === 'Anual' ? 'anos' : 'meses'} de rendimento
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/30 text-xs font-bold font-display w-fit">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{(result.finalAmount / result.totalInvested).toFixed(2)}x o valor investido</span>
                </div>
              </div>

              {/* Valor Gigante */}
              <div>
                <h3 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-neutral-900 dark:text-white leading-tight break-all">
                  {formatCurrency(result.finalAmount)}
                </h3>
              </div>

              {/* Grid de 3 Métricas Nativas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* 1. Total Investido */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800">
                  <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display block mb-0.5">
                    Total Investido (Bolso)
                  </span>
                  <p className="text-base sm:text-lg font-black font-display text-neutral-900 dark:text-white">
                    {formatCurrency(result.totalInvested)}
                  </p>
                </div>

                {/* 2. Juros Acumulados */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/30">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-display block mb-0.5">
                    Rendimento em Juros
                  </span>
                  <p className="text-base sm:text-lg font-black font-display text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(result.totalInterest)}
                  </p>
                </div>

                {/* 3. Aporte Inicial */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800">
                  <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display block mb-0.5">
                    Investimento Inicial
                  </span>
                  <p className="text-base sm:text-lg font-black font-display text-neutral-900 dark:text-white">
                    {formatCurrency(parseFloat(initialValue) || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Navegação entre Visualizações (Abas Nativas Mobile) */}
            <div className="flex items-center justify-between gap-2 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setResultTab('charts')
                }}
                className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold font-display flex items-center justify-center gap-2 transition-all ${
                  resultTab === 'charts'
                    ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <PieChartIcon className="w-4 h-4" />
                <span>Gráficos & Análise</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.light()
                  setResultTab('table')
                }}
                className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold font-display flex items-center justify-center gap-2 transition-all ${
                  resultTab === 'table'
                    ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                <span>Tabela Detalhada</span>
              </button>
            </div>

            {/* Conteúdo da Aba Ativa */}
            {resultTab === 'charts' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Gráfico de Pizza: Composição */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display">
                    Composição do Patrimônio
                  </h4>

                  <div className="h-[240px] sm:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={75}
                          dataKey="value"
                          isAnimationActive={true}
                          animationDuration={800}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => formatCurrency(Number(val))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legenda Estilo Mobile */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-neutral-600 dark:text-neutral-400 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-neutral-900 dark:text-white font-mono">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Gráfico de Barras: Evolução Anual */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display">
                    Evolução ao Longo do Tempo
                  </h4>

                  <div className="h-[240px] sm:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="year" stroke="#888888" fontSize={11} />
                        <YAxis stroke="#888888" fontSize={11} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(val) => formatCurrency(Number(val))} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Bar dataKey="Investimento Total" stackId="a" fill="#0284c7" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Total de Juros" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              /* Aba: Tabela Detalhada com Sub-Filtro Anual/Mensal */
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display">
                    Tabela Detalhada do Período
                  </h4>

                  <div className="p-1 rounded-xl bg-neutral-100 dark:bg-neutral-850 flex gap-1 w-fit">
                    <button
                      type="button"
                      onClick={() => {
                        haptics.light()
                        setShowAnnual(true)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                        showAnnual
                          ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-neutral-500'
                      }`}
                    >
                      Anual
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        haptics.light()
                        setShowAnnual(false)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                        !showAnnual
                          ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-neutral-500'
                      }`}
                    >
                      Mensal
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-bold font-display text-[10px]">
                        <th className="text-left py-2.5 px-2">{showAnnual ? 'Ano' : 'Mês'}</th>
                        <th className="text-right py-2.5 px-2">Investido</th>
                        <th className="text-right py-2.5 px-2">Juros</th>
                        <th className="text-right py-2.5 px-2">Saldo Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
                      {showAnnual
                        ? result.yearlyBreakdown.map((item, index) => (
                            <tr key={index} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50">
                              <td className="py-2.5 px-2 font-bold text-neutral-800 dark:text-neutral-200 font-mono">
                                {item.year}
                              </td>
                              <td className="py-2.5 px-2 text-right text-neutral-600 dark:text-neutral-400 font-mono">
                                {formatCurrency(item.investment)}
                              </td>
                              <td className="py-2.5 px-2 text-right text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                                {formatCurrency(item.interest)}
                              </td>
                              <td className="py-2.5 px-2 text-right font-black text-neutral-900 dark:text-white font-mono">
                                {formatCurrency(item.balance)}
                              </td>
                            </tr>
                          ))
                        : result.monthlyBreakdown.map((item, index) => (
                            <tr key={index} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50">
                              <td className="py-2.5 px-2 font-bold text-neutral-800 dark:text-neutral-200 font-mono">
                                {item.month}
                              </td>
                              <td className="py-2.5 px-2 text-right text-neutral-600 dark:text-neutral-400 font-mono">
                                {formatCurrency(item.investment)}
                              </td>
                              <td className="py-2.5 px-2 text-right text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                                {formatCurrency(item.interest)}
                              </td>
                              <td className="py-2.5 px-2 text-right font-black text-neutral-900 dark:text-white font-mono">
                                {formatCurrency(item.balance)}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-8 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 font-display">
              Pronto para simular
            </h4>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
              Preencha ou ajuste os valores desejados e toque em <strong>Calcular Simulação</strong> para ver a evolução
              detalhada.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default CompoundInterestCalculator
