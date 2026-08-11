import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  GripVertical,
  RotateCcw,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  Scale
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { haptics } from '@/utils/haptics'

interface BentoGridReportsProps {
  summary: {
    income: number
    expense: number
    balance: number
    count: number
  }
  comparison: {
    income: { change: number }
    expense: { change: number }
    balance: { change: number }
  }
  savingsRate: number
  avgDailySpend: number
  daysInPeriod: number
  topExpense: Array<{ name: string; total: number; color: string }>
  accumulatedBalanceData: Array<{ date: string; saldo: number }>
  monthlyEvolution: Array<{ month: string; receitas: number; despesas: number; saldo: number }>
  expenseByCategory: Array<{ name: string; value: number; color: string }>
  fixedVsVariable: Array<{ name: string; value: number; color: string }>
  spendByDayOfWeek: Array<{ day: string; total: number }>
  periodLabel: string
  fmtCurrency: (v: number) => string
  fmtPct: (v: number) => string
}

const STORAGE_KEY = 'fincontrol_reports_bento_order'

const DEFAULT_WIDGET_ORDER = [
  'accumulated_balance',
  'financial_summary',
  'top_categories',
  'monthly_evolution',
  'category_distribution',
  'fixed_variable',
  'day_of_week'
]

export const BentoGridReports: React.FC<BentoGridReportsProps> = ({
  summary,
  comparison,
  savingsRate,
  avgDailySpend,
  daysInPeriod,
  topExpense,
  accumulatedBalanceData,
  monthlyEvolution,
  expenseByCategory,
  fixedVsVariable,
  spendByDayOfWeek,
  periodLabel,
  fmtCurrency,
  fmtPct,
}) => {
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_WIDGET_ORDER
    } catch {
      return DEFAULT_WIDGET_ORDER
    }
  })

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [dragOverWidget, setDragOverWidget] = useState<string | null>(null)

  const handleDragStart = (id: string, e: React.DragEvent) => {
    setDraggedWidget(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    haptics.light()
  }

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverWidget !== targetId) {
      setDragOverWidget(targetId)
    }
  }

  const handleDragEnd = () => {
    setDraggedWidget(null)
    setDragOverWidget(null)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedWidget || draggedWidget === targetId) {
      setDraggedWidget(null)
      setDragOverWidget(null)
      return
    }

    const fromIndex = widgetOrder.indexOf(draggedWidget)
    const toIndex = widgetOrder.indexOf(targetId)

    if (fromIndex !== -1 && toIndex !== -1) {
      const newOrder = [...widgetOrder]
      const [moved] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, moved)

      setWidgetOrder(newOrder)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder))
      } catch (err) {
        console.error('Erro ao salvar ordem dos relatórios:', err)
      }
      haptics.medium()
    }

    setDraggedWidget(null)
    setDragOverWidget(null)
  }

  const handleResetOrder = () => {
    setWidgetOrder(DEFAULT_WIDGET_ORDER)
    localStorage.removeItem(STORAGE_KEY)
    haptics.light()
  }

  const hasCustomOrder = JSON.stringify(widgetOrder) !== JSON.stringify(DEFAULT_WIDGET_ORDER)

  // Renderizadores individuais de cada widget Bento
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'accumulated_balance':
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                  Evolução do Saldo Acumulado
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-extrabold font-display ${
                    (accumulatedBalanceData[accumulatedBalanceData.length - 1]?.saldo || 0) >= 0
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-red-500'
                  }`}
                >
                  {fmtCurrency(
                    accumulatedBalanceData[accumulatedBalanceData.length - 1]?.saldo || 0
                  )}
                </span>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50">
                {periodLabel}
              </span>
            </div>

            <div className="h-44 sm:h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accumulatedBalanceData}>
                  <defs>
                    <linearGradient id="bentoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dy={5}
                    minTickGap={25}
                  />
                  <Tooltip
                    formatter={(v: number) => [fmtCurrency(v), 'Saldo']}
                    contentStyle={{
                      borderRadius: 14,
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="saldo"
                    stroke="#0284c7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#bentoAreaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      case 'financial_summary':
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary-500" />
                Resumo Geral
              </h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                Poupança {savingsRate.toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/30">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Receitas
                </div>
                <div className="text-lg font-black font-display text-emerald-900 dark:text-emerald-100">
                  {fmtCurrency(summary.income)}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {fmtPct(comparison.income.change)} vs anterior
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-100/80 dark:border-red-900/30">
                <div className="flex items-center gap-1.5 text-xs text-red-700 dark:text-red-400 font-semibold mb-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Despesas
                </div>
                <div className="text-lg font-black font-display text-red-900 dark:text-red-100">
                  {fmtCurrency(summary.expense)}
                </div>
                <div className="text-[10px] text-red-600 dark:text-red-400 font-mono mt-0.5">
                  {fmtPct(comparison.expense.change)} vs anterior
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">Gasto Diário Médio ({daysInPeriod} dias):</span>
              <span className="font-bold font-mono text-neutral-900 dark:text-white">
                {fmtCurrency(avgDailySpend)}/dia
              </span>
            </div>
          </div>
        )

      case 'top_categories':
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                Top Despesas
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">Mais Gastas</span>
            </div>

            {topExpense.length > 0 ? (
              <div className="space-y-3">
                {topExpense.slice(0, 4).map((cat, idx) => {
                  const pct = summary.expense > 0 ? (cat.total / summary.expense) * 100 : 0
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span className="truncate text-neutral-800 dark:text-neutral-200">
                            {cat.name}
                          </span>
                        </div>
                        <span className="font-mono text-neutral-900 dark:text-white shrink-0">
                          {fmtCurrency(cat.total)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: cat.color || '#ef4444',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-xs text-neutral-400 py-6 text-center">Nenhum gasto registrado</div>
            )}
          </div>
        )

      case 'monthly_evolution':
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" />
                Evolução Mensal
              </h3>
              <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Receitas
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Despesas
                </span>
              </div>
            </div>

            <div className="h-44 sm:h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEvolution} barGap={4}>
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      fmtCurrency(v),
                      name === 'receitas' ? 'Receitas' : 'Despesas',
                    ]}
                    contentStyle={{
                      borderRadius: 14,
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="despesas" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      case 'category_distribution':
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-500" />
                Distribuição por Categoria
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">{expenseByCategory.length} cats</span>
            </div>

            <div className="h-40 sm:h-48 w-full flex items-center justify-center">
              {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [fmtCurrency(v), 'Gasto']}
                      contentStyle={{
                        borderRadius: 14,
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-neutral-400 text-center">Sem dados no período</div>
              )}
            </div>
          </div>
        )

      case 'fixed_variable':
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500" />
                Fixas vs. Variáveis
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 my-auto">
              {fixedVsVariable.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-center"
                >
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                    {item.name}
                  </span>
                  <span className="text-base sm:text-lg font-black font-display text-neutral-900 dark:text-white block">
                    {fmtCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'day_of_week':
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Gastos por Dia da Semana
              </h3>
            </div>

            <div className="h-40 sm:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendByDayOfWeek}>
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [fmtCurrency(v), 'Total']}
                    contentStyle={{
                      borderRadius: 14,
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Define o span de colunas no Bento Grid
  const getWidgetSpan = (widgetId: string) => {
    switch (widgetId) {
      case 'accumulated_balance':
      case 'monthly_evolution':
        return 'col-span-1 md:col-span-2'
      case 'financial_summary':
      case 'top_categories':
      case 'category_distribution':
      case 'fixed_variable':
      case 'day_of_week':
      default:
        return 'col-span-1'
    }
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Barra de Ações do Bento Grid */}
      <div className="flex items-center justify-between px-1 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="font-medium">
            Painel Bento Grid de Relatórios (Arraste para reorganizar)
          </span>
        </div>

        {hasCustomOrder && (
          <button
            onClick={handleResetOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition-all text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Painel</span>
          </button>
        )}
      </div>

      {/* Grid Bento Modular */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {widgetOrder.map((widgetId) => {
            const isBeingDragged = draggedWidget === widgetId
            const isDropTarget = dragOverWidget === widgetId && !isBeingDragged
            const spanClass = getWidgetSpan(widgetId)

            return (
              <motion.div
                key={widgetId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isBeingDragged ? 0.4 : 1,
                  scale: isBeingDragged ? 0.98 : 1,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                draggable
                onDragStart={(e) => handleDragStart(widgetId, e as any)}
                onDragOver={(e) => handleDragOver(e as any, widgetId)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e as any, widgetId)}
                className={`group relative rounded-3xl p-6 transition-all duration-300 select-none border ${spanClass} ${
                  isDropTarget
                    ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50/20 dark:bg-primary-950/30'
                    : 'bg-white dark:bg-neutral-900/90 border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Alça de Arrastar no topo direito */}
                <div
                  className="absolute top-5 right-5 p-1.5 text-neutral-300 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-300 cursor-grab active:cursor-grabbing rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Arraste para reorganizar este bloco"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Conteúdo do Widget */}
                {renderWidget(widgetId)}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BentoGridReports
