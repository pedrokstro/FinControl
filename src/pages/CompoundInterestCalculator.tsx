import { useState } from 'react'
import { TrendingUp, Calculator, DollarSign, Percent, Wallet, Clock, Calendar } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
  const [initialValue, setInitialValue] = useState('10000')
  const [monthlyContribution, setMonthlyContribution] = useState('400')
  const [interestRate, setInterestRate] = useState('8')
  const [period, setPeriod] = useState('10')
  const [periodType, setPeriodType] = useState<'Mensal' | 'Anual'>('Anual')
  const [compoundFrequency, setCompoundFrequency] = useState<'Anual' | 'Mensal'>('Anual')
  const [startDate, setStartDate] = useState('2025-11-13')
  const [showAnnual, setShowAnnual] = useState(true)
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

    // Calcular mês a mês
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
        balance: balance
      })

      // Adicionar dados anuais ao final de cada ano ou no último mês
      if ((monthIndex + 1) % 12 === 0 || monthIndex === totalMonths - 1) {
        yearlyData.push({
          year: currentYear,
          investment: totalInvested,
          interest: balance - totalInvested,
          balance: balance
        })
      }
    }

    setResult({
      finalAmount: balance,
      totalInvested: totalInvested,
      totalInterest: balance - totalInvested,
      yearlyBreakdown: yearlyData,
      monthlyBreakdown: monthlyData
    })
  }
  
  const clear = () => {
    setInitialValue('10000')
    setMonthlyContribution('400')
    setInterestRate('8')
    setPeriod('10')
    setPeriodType('Anual')
    setCompoundFrequency('Anual')
    setStartDate('2025-11-13')
    setResult(null)
  }

  // Não calcular automaticamente ao carregar
  // useEffect(() => {
  //   calculate()
  // }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const pieData = result ? [
    { name: 'Investimento Inicial', value: parseFloat(initialValue) || 0, color: '#3b82f6' },
    { name: 'Investimento Contínuo', value: result.totalInvested - (parseFloat(initialValue) || 0), color: '#60a5fa' },
    { name: 'Juros', value: result.totalInterest, color: '#9ca3af' }
  ] : []

  const barData = result?.yearlyBreakdown.map(item => ({
    year: item.year.toString(),
    'Investimento Total': item.investment,
    'Total de Juros': item.interest
  })) || []

  return (
    <PageTransition>
      <div className="responsive-page">
        {/* Header */}
        <div className="responsive-header">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
              Calculadora de Juros Compostos
            </h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              Simule investimentos com juros compostos
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Investimento Inicial */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                Investimento Inicial
              </label>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 via-sky-400 to-primary-300 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm pointer-events-none"></div>
                <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-3 sm:px-4 py-3 shadow-sm group-focus-within:border-transparent">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 flex-shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 flex-shrink-0">R$</span>
                  <input
                    type="number"
                    value={initialValue}
                    onChange={(e) => setInitialValue(e.target.value)}
                    className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0"
                    placeholder="Ex: 10.000"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Taxa de Juros Anual */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                Taxa de Juros Anual
              </label>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-primary-500 to-cyan-400 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm pointer-events-none"></div>
                <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-3 sm:px-4 py-3 shadow-sm group-focus-within:border-transparent">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300 flex-shrink-0">
                    <Percent className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0"
                    placeholder="Ex: 8"
                    step="0.01"
                  />
                  <span className="text-sm font-semibold text-success-600 dark:text-success-300 flex-shrink-0">%</span>
                </div>
              </div>
            </div>

            {/* Investimento Contínuo */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                Investimento Contínuo
              </label>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 via-primary-500 to-violet-500 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm pointer-events-none"></div>
                <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-3 sm:px-4 py-3 shadow-sm group-focus-within:border-transparent">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-300 flex-shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 flex-shrink-0">R$</span>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0"
                    placeholder="Ex: 400"
                    step="0.01"
                  />
                  <span className="text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wide flex-shrink-0">
                    {compoundFrequency === 'Mensal' ? 'Mensal' : 'Anual'}
                  </span>
                </div>
              </div>
            </div>

            {/* Duração */}
            <div className="group lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                Duração
              </label>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-primary-500 to-sky-400 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm pointer-events-none"></div>
                <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-3 sm:px-4 py-3 shadow-sm group-focus-within:border-transparent overflow-hidden">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0"
                    placeholder="Ex: 10"
                    min="1"
                  />
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-neutral-300 uppercase tracking-wide flex-shrink-0 whitespace-nowrap px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full">
                    {compoundFrequency === 'Mensal' ? 'Meses' : 'Anos'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Segunda linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Composto */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                Composto
              </label>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm pointer-events-none"></div>
                <select
                  value={compoundFrequency}
                  onChange={(e) => {
                    const newFrequency = e.target.value as 'Anual' | 'Mensal'
                    setCompoundFrequency(newFrequency)
                    setPeriodType(newFrequency === 'Mensal' ? 'Mensal' : 'Anual')
                    // Ajustar período ao mudar frequência
                    if (newFrequency === 'Mensal' && compoundFrequency === 'Anual') {
                      // Converter anos para meses
                      setPeriod(String(parseInt(period) * 12))
                    } else if (newFrequency === 'Anual' && compoundFrequency === 'Mensal') {
                      // Converter meses para anos
                      setPeriod(String(Math.ceil(parseInt(period) / 12)))
                    }
                  }}
                  className="relative w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-0 appearance-none pr-12 font-semibold"
                >
                  <option value="Anual">Anual</option>
                  <option value="Mensal">Mensal</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Data de Início */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                Data de Início
              </label>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500 via-primary-500 to-indigo-500 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm pointer-events-none"></div>
                <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-3 sm:px-4 py-3 shadow-sm group-focus-within:border-transparent">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-sky-50 text-sky-500 dark:bg-sky-900/30 dark:text-sky-300 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-gray-900 dark:text-white focus:outline-none min-w-0"
                  />
                </div>
              </div>
            </div>

            {/* Botões Calcular e Limpar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:col-span-2 lg:col-span-1">
              <button
                onClick={calculate}
                className="btn-primary flex-1 flex items-center justify-center gap-2 w-full"
              >
                <Calculator className="w-5 h-5" />
                Calcular
              </button>
              <button
                onClick={clear}
                className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none w-full"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <>
            {/* Resumo */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-800">
              <p className="text-gray-700 dark:text-neutral-300 text-lg mb-2">
                Após {period} {periodType === 'Anual' ? 'anos' : 'meses'} seu investimento valerá
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4 break-all">
                {formatCurrency(result.finalAmount)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-neutral-400">Investimento Inicial</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(parseFloat(initialValue) || 0)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-neutral-400">Investimento Contínuo</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(result.totalInvested - (parseFloat(initialValue) || 0))}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-neutral-400">Juros</p>
                  <p className="font-semibold text-success-600 dark:text-success-400">{formatCurrency(result.totalInterest)}</p>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Composição do Investimento
                </h3>
                <div className="overflow-hidden min-w-0">
                  <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-700 dark:text-neutral-300">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico de Barras */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Evolução do Investimento
                </h3>
                <div className="overflow-hidden min-w-0">
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="Investimento Total" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Total de Juros" stackId="a" fill="#9ca3af" />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tabela Detalhada */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Detalhamento do Investimento
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAnnual(true)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                      showAnnual
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    Detalhamento Anual
                  </button>
                  <button
                    onClick={() => setShowAnnual(false)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                      !showAnnual
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    Detalhamento Mensal
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-neutral-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                        {showAnnual ? 'Ano' : 'Mês'}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                        Investimento
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                        Juros
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                        Saldo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {showAnnual ? (
                      result.yearlyBreakdown.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                            {item.year}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-primary-600 dark:text-primary-400 font-semibold">
                            {formatCurrency(item.investment)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-success-600 dark:text-success-400 font-semibold">
                            {formatCurrency(item.interest)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white font-bold">
                            {formatCurrency(item.balance)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      result.monthlyBreakdown.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                            {item.month}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-primary-600 dark:text-primary-400 font-semibold">
                            {formatCurrency(item.investment)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-success-600 dark:text-success-400 font-semibold">
                            {formatCurrency(item.interest)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white font-bold">
                            {formatCurrency(item.balance)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}

export default CompoundInterestCalculator
