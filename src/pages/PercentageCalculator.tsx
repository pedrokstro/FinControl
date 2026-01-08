import { useState } from 'react'
import { Percent, Calculator, ArrowRight, Wallet } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'

const PercentageCalculator = () => {
  const [value, setValue] = useState('')
  const [percentage, setPercentage] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [operation, setOperation] = useState<'of' | 'increase' | 'decrease'>('of')

  const calculate = () => {
    const numValue = parseFloat(value)
    const numPercentage = parseFloat(percentage)

    if (isNaN(numValue) || isNaN(numPercentage)) {
      return
    }

    let calculatedResult: number

    switch (operation) {
      case 'of':
        // X% de Y
        calculatedResult = (numPercentage / 100) * numValue
        break
      case 'increase':
        // Y + X%
        calculatedResult = numValue + (numPercentage / 100) * numValue
        break
      case 'decrease':
        // Y - X%
        calculatedResult = numValue - (numPercentage / 100) * numValue
        break
    }

    setResult(calculatedResult)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const clear = () => {
    setValue('')
    setPercentage('')
    setResult(null)
  }

  return (
    <PageTransition>
      <div className="responsive-page">
        {/* Header */}
        <div className="responsive-header">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <Percent className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
              Calculadora de Porcentagem
            </h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              Calcule porcentagens de forma rápida e fácil
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Calculadora
              </h2>
            </div>

            {/* Tipo de Operação */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
                Tipo de Cálculo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setOperation('of')}
                  className={`px-2 sm:px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    operation === 'of'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  X% de Y
                </button>
                <button
                  onClick={() => setOperation('increase')}
                  className={`px-2 sm:px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    operation === 'increase'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  Y + X%
                </button>
                <button
                  onClick={() => setOperation('decrease')}
                  className={`px-2 sm:px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    operation === 'decrease'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  Y - X%
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                  Porcentagem (%)
                </label>
                <div className="relative rounded-2xl">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-400 to-sky-400 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-3 sm:px-4 py-3 shadow-sm group-focus-within:border-transparent">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 flex-shrink-0">
                      <Percent className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="Ex: 15"
                      className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0"
                      step="0.01"
                    />
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-300 flex-shrink-0">%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                  Informe a porcentagem com até duas casas decimais
                </p>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                  Valor (R$)
                </label>
                <div className="relative rounded-2xl">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-primary-500 to-amber-400 opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-3 sm:px-4 py-3 shadow-sm group-focus-within:border-transparent">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300 flex-shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 flex-shrink-0">R$</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Ex: 1000,00"
                      className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0"
                      step="0.01"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                  Use vírgula ou ponto para separar as casas decimais
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3 mt-6 sm:flex-row">
              <button
                onClick={calculate}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={!value || !percentage}
              >
                <Calculator className="w-5 h-5" />
                Calcular
              </button>
              <button
                onClick={clear}
                className="btn-secondary flex-1 sm:flex-none"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Resultado */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Resultado
              </h2>
            </div>

            {result !== null ? (
              <div className="space-y-6">
                {/* Resultado Principal */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4 sm:p-6 border-2 border-primary-200 dark:border-primary-800">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-400 mb-2">
                    {operation === 'of' && `${percentage}% de ${formatCurrency(parseFloat(value))}`}
                    {operation === 'increase' && `${formatCurrency(parseFloat(value))} + ${percentage}%`}
                    {operation === 'decrease' && `${formatCurrency(parseFloat(value))} - ${percentage}%`}
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400 break-all">
                    {formatCurrency(result)}
                  </p>
                </div>

                {/* Detalhes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Valor Original</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(parseFloat(value))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Porcentagem</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {percentage}%
                    </span>
                  </div>
                  {operation !== 'of' && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-neutral-400">
                        {operation === 'increase' ? 'Acréscimo' : 'Desconto'}
                      </span>
                      <span className={`font-semibold ${
                        operation === 'increase' 
                          ? 'text-success-600 dark:text-success-400' 
                          : 'text-danger-600 dark:text-danger-400'
                      }`}>
                        {formatCurrency(Math.abs(result - parseFloat(value)))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Percent className="w-16 h-16 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-neutral-400">
                  Preencha os campos e clique em "Calcular"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Exemplos */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Exemplos de Uso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">X% de Y</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Calcule quanto é 15% de R$ 1.000,00
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-2 font-medium">
                Resultado: R$ 150,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Y + X%</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Adicione 10% a R$ 500,00
              </p>
              <p className="text-sm text-success-600 dark:text-success-400 mt-2 font-medium">
                Resultado: R$ 550,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Y - X%</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Subtraia 20% de R$ 800,00
              </p>
              <p className="text-sm text-danger-600 dark:text-danger-400 mt-2 font-medium">
                Resultado: R$ 640,00
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default PercentageCalculator
