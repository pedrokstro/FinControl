import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, RotateCw, Info, LucideIcon } from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { haptics } from '@/utils/haptics'

export interface SparklinePoint {
  date?: string
  value: number
  label?: string
}

export interface CardInsightItem {
  label: string
  value: string | number
  icon?: LucideIcon
  highlight?: boolean
}

export interface InteractiveDataCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: LucideIcon
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'purple' | 'neutral'
  badge?: string
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
    direction?: 'up' | 'down' | 'neutral'
  }
  sparklineData?: number[] | SparklinePoint[]
  progress?: {
    current: number
    total: number
    label?: string
  }
  backside?: {
    headline: string
    subheadline?: string
    insights: CardInsightItem[]
    actionButton?: {
      label: string
      onClick: () => void
    }
  }
  onCardClick?: () => void
  className?: string
  colSpan?: string
  height?: string
}

export const InteractiveDataCard: React.FC<InteractiveDataCardProps> = ({
  title,
  value,
  prefix = 'R$ ',
  suffix = '',
  icon: Icon,
  variant = 'neutral',
  badge,
  trend,
  sparklineData = [],
  progress,
  backside,
  onCardClick,
  className = '',
  colSpan = 'col-span-1',
  height = 'min-h-[170px]',
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D Physics Tilt Effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseXSpring = useSpring(mouseX, { stiffness: 280, damping: 22 })
  const mouseYSpring = useSpring(mouseY, { stiffness: 280, damping: 22 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg'])
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0.15, 0])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const width = rect.width
    const height = rect.height
    const mouseClientX = e.clientX - rect.left
    const mouseClientY = e.clientY - rect.top

    const xPct = mouseClientX / width - 0.5
    const yPct = mouseClientY / height - 0.5

    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setActivePointIndex(null)
  }

  const toggleFlip = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptics.light()
    setIsFlipped(!isFlipped)
    mouseX.set(0)
    mouseY.set(0)
  }

  // Variant color definitions
  const variantStyles = {
    primary: {
      accentBar: 'bg-gradient-to-r from-primary-500 to-primary-600',
      iconBg: 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 ring-primary-500/15',
      glow: 'shadow-primary-500/10 dark:shadow-primary-950/20',
      sparklineStroke: '#0284c7',
      sparklineArea: 'rgba(2, 132, 199, 0.15)',
      cardBg: 'bg-white dark:bg-neutral-900',
      border: 'border-neutral-200/80 dark:border-neutral-800/80',
    },
    success: {
      accentBar: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-emerald-500/15',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-950/20',
      sparklineStroke: '#10b981',
      sparklineArea: 'rgba(16, 185, 129, 0.15)',
      cardBg: 'bg-white dark:bg-neutral-900',
      border: 'border-neutral-200/80 dark:border-neutral-800/80',
    },
    danger: {
      accentBar: 'bg-gradient-to-r from-rose-500 to-rose-600',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 ring-rose-500/15',
      glow: 'shadow-rose-500/10 dark:shadow-rose-950/20',
      sparklineStroke: '#f43f5e',
      sparklineArea: 'rgba(244, 63, 94, 0.15)',
      cardBg: 'bg-white dark:bg-neutral-900',
      border: 'border-neutral-200/80 dark:border-neutral-800/80',
    },
    warning: {
      accentBar: 'bg-gradient-to-r from-amber-500 to-amber-600',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-amber-500/15',
      glow: 'shadow-amber-500/10 dark:shadow-amber-950/20',
      sparklineStroke: '#f59e0b',
      sparklineArea: 'rgba(245, 158, 11, 0.15)',
      cardBg: 'bg-white dark:bg-neutral-900',
      border: 'border-neutral-200/80 dark:border-neutral-800/80',
    },
    purple: {
      accentBar: 'bg-gradient-to-r from-violet-500 to-violet-600',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 ring-violet-500/15',
      glow: 'shadow-violet-500/10 dark:shadow-violet-950/20',
      sparklineStroke: '#8b5cf6',
      sparklineArea: 'rgba(139, 92, 246, 0.15)',
      cardBg: 'bg-white dark:bg-neutral-900',
      border: 'border-neutral-200/80 dark:border-neutral-800/80',
    },
    neutral: {
      accentBar: 'bg-gradient-to-r from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-600',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 ring-neutral-200 dark:ring-neutral-700',
      glow: 'shadow-neutral-500/5',
      sparklineStroke: '#64748b',
      sparklineArea: 'rgba(100, 116, 139, 0.1)',
      cardBg: 'bg-white dark:bg-neutral-900',
      border: 'border-neutral-200/80 dark:border-neutral-800/80',
    },
  }

  const currentTheme = variantStyles[variant]

  // Normalização e cálculo da curva SVG Sparkline
  const normalizedPoints: SparklinePoint[] = sparklineData.map((item, idx) => {
    if (typeof item === 'number') {
      return { value: item, label: `Ponto ${idx + 1}` }
    }
    return item
  })

  const valuesOnly = normalizedPoints.map((p) => p.value)
  const minVal = valuesOnly.length ? Math.min(...valuesOnly) : 0
  const maxVal = valuesOnly.length ? Math.max(...valuesOnly) : 1
  const range = maxVal - minVal || 1

  const svgWidth = 140
  const svgHeight = 40
  const paddingY = 6

  const computedCoords = normalizedPoints.map((p, index) => {
    const x = (index / (Math.max(normalizedPoints.length - 1, 1))) * (svgWidth - 10) + 5
    const y = svgHeight - paddingY - ((p.value - minVal) / range) * (svgHeight - paddingY * 2)
    return { x, y, point: p }
  })

  const pathD = computedCoords.length > 1
    ? computedCoords.reduce((acc, coord, idx, arr) => {
        if (idx === 0) return `M ${coord.x} ${coord.y}`
        const prev = arr[idx - 1]
        const cX = (prev.x + coord.x) / 2
        return `${acc} C ${cX} ${prev.y}, ${cX} ${coord.y}, ${coord.x} ${coord.y}`
      }, '')
    : ''

  const areaD = pathD ? `${pathD} L ${computedCoords[computedCoords.length - 1].x} ${svgHeight} L ${computedCoords[0].x} ${svgHeight} Z` : ''

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onCardClick}
      className={`relative ${colSpan} ${height} select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full h-full cursor-pointer"
      >
        {/* ========================================================= */}
        {/* FRENTE DO CARD (Face Principal)                          */}
        {/* ========================================================= */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
          className={`absolute inset-0 w-full h-full rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-shadow duration-300`}
        >
          {/* Barra de destaque superior */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${currentTheme.accentBar}`} />

          {/* Efeito Gloss de Luz Dinâmica */}
          <motion.div
            style={{ opacity: glareOpacity }}
            className="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none transform rotate-12"
          />

          {/* Topo do Card: Título, Ícone e Botão Flip */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {title}
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <h3 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white truncate">
                  <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {/* Botão Virar Card para Detalhes */}
              {backside && (
                <button
                  type="button"
                  onClick={toggleFlip}
                  title="Ver análise detalhada"
                  className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Ícone Temático */}
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ring-4 ${currentTheme.iconBg}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>

          {/* Centro / Sparkline Mini-Gráfico */}
          {computedCoords.length > 1 && (
            <div className="relative w-full h-9 my-1 flex items-center justify-between">
              <div className="flex-1 h-full relative">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id={`gradArea-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={currentTheme.sparklineStroke} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={currentTheme.sparklineStroke} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Preenchimento sob a curva */}
                  <path d={areaD} fill={`url(#gradArea-${title})`} />

                  {/* Linha traçada */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={currentTheme.sparklineStroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Pontos interativos */}
                  {computedCoords.map((c, i) => {
                    const isActive = activePointIndex === i
                    return (
                      <g key={i} onMouseEnter={() => setActivePointIndex(i)}>
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r={isActive ? 4 : 2}
                          fill={currentTheme.sparklineStroke}
                          stroke="#ffffff"
                          strokeWidth={isActive ? 2 : 1}
                          className="transition-all duration-150 cursor-pointer"
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* Tooltip Magnético do Ponto Ativo */}
                {activePointIndex !== null && computedCoords[activePointIndex] && (
                  <div
                    className="absolute -top-7 -translate-x-1/2 z-30 px-2 py-0.5 rounded bg-neutral-900 text-white text-[10px] font-mono shadow-md pointer-events-none whitespace-nowrap"
                    style={{ left: `${(computedCoords[activePointIndex].x / svgWidth) * 100}%` }}
                  >
                    {prefix}
                    {computedCoords[activePointIndex].point.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Barra de Progresso Opcional */}
          {progress && (
            <div className="w-full my-1.5">
              <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                <span>{progress.label || 'Progresso'}</span>
                <span className="font-semibold">
                  {Math.round((progress.current / (progress.total || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${currentTheme.accentBar} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min((progress.current / (progress.total || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Rodapé do Card: Tendência ou Badge Informativo */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100 dark:border-neutral-800/60 relative z-10">
            {trend ? (
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    trend.isPositive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {trend.isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  {trend.label || 'vs. mês anterior'}
                </span>
              </div>
            ) : badge ? (
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                {badge}
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">FinControl</span>
            )}

            {backside && (
              <button
                type="button"
                onClick={toggleFlip}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                <span>Detalhes</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VERSO DO CARD (Face Analítica / Breakdown)               */}
        {/* ========================================================= */}
        {backside && (
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className={`absolute inset-0 w-full h-full rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} p-4 sm:p-5 flex flex-col justify-between shadow-xl`}
          >
            {/* Topo do Verso */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  {backside.headline}
                </h4>
              </div>
              <button
                type="button"
                onClick={toggleFlip}
                title="Voltar para visão principal"
                className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lista de Insights e Métricas Rápidas */}
            <div className="space-y-1.5 my-auto py-1">
              {backside.insights.map((item, idx) => {
                const ItemIcon = item.icon
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 truncate">
                      {ItemIcon && <ItemIcon className="w-3.5 h-3.5 shrink-0 text-primary-500" />}
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span
                      className={`font-semibold shrink-0 ml-2 ${
                        item.highlight
                          ? 'text-primary-600 dark:text-primary-400 font-bold'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Ação ou Rodapé do Verso */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              {backside.actionButton ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    backside.actionButton?.onClick()
                  }}
                  className="w-full py-1.5 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>{backside.actionButton.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleFlip}
                  className="text-neutral-400 hover:text-neutral-600 text-[11px] font-medium mx-auto"
                >
                  Clique para virar
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default InteractiveDataCard
