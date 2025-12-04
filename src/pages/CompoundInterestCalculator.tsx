import { useState } from 'react'
import { TrendingUp, Calculator } from 'lucide-react'
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              Calculadora de Juros Compostos
            </h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              Simule investimentos com juros compostos
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Investimento Inicial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Investimento Inicial
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-neutral-400 text-sm">R$</span>
                <input
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                  className="input flex-1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Taxa de Juros Anual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Taxa de Juros Anual
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="input flex-1"
                  step="0.01"
                />
                <span className="text-gray-600 dark:text-neutral-400 text-sm">%</span>
              </div>
            </div>

            {/* Investimento Contínuo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Investimento Contínuo
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-neutral-400 text-sm">R$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="input flex-1"
                  step="0.01"
                />
                <span className="text-gray-600 dark:text-neutral-400 text-sm w-16">
                  {compoundFrequency === 'Mensal' ? 'Mensal' : 'Anual'}
                </span>
              </div>
            </div>

            {/* Duração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Duração
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="input flex-1"
                  min="1"
                />
                <span className="text-gray-600 dark:text-neutral-400 text-sm w-16">
                  {compoundFrequency === 'Mensal' ? 'Mês' : 'Ano'}
                </span>
              </div>
            </div>
          </div>

          {/* Segunda linha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Composto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Composto
              </label>
              <div className="relative">
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
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer appearance-none pr-10"
                >
                  <option value="Anual">Anual</option>
                  <option value="Mensal">Mensal</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Data de Início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input w-full"
              />
            </div>

            {/* Botões Calcular e Limpar */}
            <div className="flex items-end gap-3">
              <button
                onClick={calculate}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calcular
              </button>
              <button
                onClick={clear}
                className="btn-secondary flex items-center justify-center gap-2"
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
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                {formatCurrency(result.finalAmount)}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
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

            {/* Tabela Detalhada */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Detalhamento do Investimento
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAnnual(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showAnnual
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    Detalhamento Anual
                  </button>
                  <button
                    onClick={() => setShowAnnual(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
