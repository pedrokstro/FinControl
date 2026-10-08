import { useState, useEffect } from 'react'
import { Percent, Calculator, ArrowRight, Wallet, RotateCcw, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-hot-toast'
import PageTransition from '@/components/common/PageTransition'
import { motion } from 'framer-motion'
import { haptics } from '@/utils/haptics'

const PercentageCalculator = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.isPremium) {
      toast.error('Calculadoras são exclusivas do plano Premium')
      navigate('/plans')
    }
  }, [user, navigate])

  const [value, setValue] = useState('')
  const [percentage, setPercentage] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [operation, setOperation] = useState<'of' | 'increase' | 'decrease'>('of')

  const calculateWith = (val: string, pct: string, op: 'of' | 'increase' | 'decrease') => {
    const numValue = parseFloat(val)
    const numPercentage = parseFloat(pct)

    if (isNaN(numValue) || isNaN(numPercentage)) {
      return
    }

    let calculatedResult: number

    switch (op) {
      case 'of':
        calculatedResult = (numPercentage / 100) * numValue
        break
      case 'increase':
        calculatedResult = numValue + (numPercentage / 100) * numValue
        break
      case 'decrease':
        calculatedResult = numValue - (numPercentage / 100) * numValue
        break
    }

    setResult(calculatedResult)
    haptics.success()
  }

  const calculate = () => {
    calculateWith(value, percentage, operation)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  const clear = () => {
    haptics.light()
    setValue('')
    setPercentage('')
    setResult(null)
  }

  const applyExample = (val: string, pct: string, op: 'of' | 'increase' | 'decrease') => {
    setValue(val)
    setPercentage(pct)
    setOperation(op)
    calculateWith(val, pct, op)
  }

  const presets = [5, 10, 15, 20, 25, 50]

  return (
    <PageTransition>
      <div className="responsive-page max-w-5xl mx-auto space-y-5 sm:space-y-6">
        {/* Cabeçalho Nativo Mobile & Desktop */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 dark:text-primary-400 border border-primary-100/60 dark:border-primary-900/40 shadow-sm flex-shrink-0">
              <Percent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-neutral-900 dark:text-white leading-tight">
                Calculadora de Porcentagem
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Calcule fatias, acréscimos e descontos com rapidez
              </p>
            </div>
          </div>
        </div>

        {/* Layout Grid: Form e Resultado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Card de Configuração e Entrada */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
            {/* Segmented Control Nativo (iOS Style) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 font-display">
                Tipo de Cálculo
              </label>
              <div className="p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/50 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setOperation('of')
                    if (value && percentage) calculateWith(value, percentage, 'of')
                  }}
                  className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold font-display transition-all ${
                    operation === 'of'
                      ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  X% de Y
                </button>
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setOperation('increase')
                    if (value && percentage) calculateWith(value, percentage, 'increase')
                  }}
                  className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold font-display transition-all ${
                    operation === 'increase'
                      ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Y + X%
                </button>
                <button
                  type="button"
                  onClick={() => {
                    haptics.light()
                    setOperation('decrease')
                    if (value && percentage) calculateWith(value, percentage, 'decrease')
                  }}
                  className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold font-display transition-all ${
                    operation === 'decrease'
                      ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Y - X%
                </button>
              </div>
            </div>

            {/* Inputs Nativos */}
            <div className="space-y-3 sm:space-y-4">
              {/* Campo Porcentagem */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                  Porcentagem (%)
                </label>
                <div className="relative flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 sm:py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400 flex-shrink-0 border border-primary-100/60 dark:border-primary-900/30">
                    <Percent className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="Ex: 15"
                    className="flex-1 bg-transparent text-base sm:text-lg font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0 font-sans"
                    step="0.01"
                    inputMode="decimal"
                  />
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">%</span>
                </div>

                {/* Chips de Presets Rápidos */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase font-display mr-1">
                    Atalhos:
                  </span>
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        haptics.light()
                        setPercentage(String(preset))
                        if (value) calculateWith(value, String(preset), operation)
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold font-display transition-all active:scale-95 ${
                        percentage === String(preset)
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Campo Valor Principal */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 font-display">
                  Valor Base (R$)
                </label>
                <div className="relative flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 sm:py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex-shrink-0 border border-emerald-100/60 dark:border-emerald-900/30">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 flex-shrink-0 font-mono">
                    R$
                  </span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ex: 1000,00"
                    className="flex-1 bg-transparent text-base sm:text-lg font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none min-w-0 font-sans"
                    step="0.01"
                    inputMode="decimal"
                  />
                </div>
              </div>
            </div>

            {/* Ações em Mobile Nativo */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={calculate}
                disabled={!value || !percentage}
                className="flex-1 py-3 sm:py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-sm shadow-primary-500/20 active:scale-98 transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Calcular</span>
              </button>

              <button
                type="button"
                onClick={clear}
                className="p-3 sm:p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all"
                title="Limpar campos"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card de Resultado */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 dark:text-primary-400 border border-primary-100/60 dark:border-primary-900/40">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 font-display">
                    Resultado
                  </span>
                </div>
                {result !== null && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-100/60 dark:border-primary-900/40 font-mono">
                    {operation === 'of' ? `${percentage}% de ${formatCurrency(parseFloat(value))}` : operation === 'increase' ? `+${percentage}%` : `-${percentage}%`}
                  </span>
                )}
              </div>

              {result !== null ? (
                <div className="space-y-4">
                  {/* Destaque do Valor Final */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display mb-1">
                      {operation === 'of' ? 'Valor da Fração' : operation === 'increase' ? 'Valor com Acréscimo' : 'Valor com Desconto'}
                    </p>
                    <p className="text-3xl sm:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white leading-tight break-all">
                      {formatCurrency(result)}
                    </p>
                  </div>

                  {/* Lista de Detalhamento Estilo Nativo */}
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 overflow-hidden text-xs sm:text-sm">
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-50/50 dark:bg-neutral-850/50">
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium">Valor Original</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 font-mono">
                        {formatCurrency(parseFloat(value))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-50/50 dark:bg-neutral-850/50">
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium">Percentual Aplicado</span>
                      <span className="font-bold text-primary-600 dark:text-primary-400 font-mono">
                        {percentage}%
                      </span>
                    </div>

                    {operation !== 'of' && (
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-50/50 dark:bg-neutral-850/50">
                        <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                          {operation === 'increase' ? 'Acréscimo Monetário' : 'Desconto Monetário'}
                        </span>
                        <span className={`font-bold font-mono ${
                          operation === 'increase'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {formatCurrency(Math.abs(result - parseFloat(value)))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center">
                    <Percent className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Preencha os valores e toque em <strong className="text-neutral-800 dark:text-neutral-200">Calcular</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Dica de Toque Rápido */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span>Você também pode tocar nos exemplos abaixo para simular direto</span>
            </div>
          </div>
        </div>

        {/* Exemplos Interativos (Toque para Simular) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-display">
              Exemplos Práticos (Toque para aplicar)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Exemplo 1 */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => applyExample('1000', '15', 'of')}
              className="text-left p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 font-display">
                  15% de R$ 1.000
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">Fração</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Quanto equivale 15% de 1.000?
              </p>
              <p className="text-xs font-bold text-neutral-900 dark:text-white mt-1 font-mono">
                = R$ 150,00
              </p>
            </motion.button>

            {/* Exemplo 2 */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => applyExample('500', '10', 'increase')}
              className="text-left p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-display">
                  R$ 500 + 10%
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">Acréscimo</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Adicionar margem ou taxa
              </p>
              <p className="text-xs font-bold text-neutral-900 dark:text-white mt-1 font-mono">
                = R$ 550,00
              </p>
            </motion.button>

            {/* Exemplo 3 */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => applyExample('800', '20', 'decrease')}
              className="text-left p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 font-display">
                  R$ 800 - 20%
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">Desconto</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Calcular valor com desconto
              </p>
              <p className="text-xs font-bold text-neutral-900 dark:text-white mt-1 font-mono">
                = R$ 640,00
              </p>
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default PercentageCalculator
