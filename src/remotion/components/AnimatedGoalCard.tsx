import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { ShieldCheck } from 'lucide-react'

interface AnimatedGoalCardProps {
  isDark?: boolean
}

export const AnimatedGoalCard: React.FC<AnimatedGoalCardProps> = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // 1. Entrada com Spring Physics
  const entrance = spring({
    frame: frame - 12,
    fps,
    config: {
      damping: 14,
      stiffness: 130,
      mass: 0.8,
    },
  })

  // 2. Flutuação Ambiente Invertida para Parallax Visual
  const ambientFloatY = Math.cos((frame / fps) * 2.2) * 6

  // 3. Progresso do Anel de Meta (0 -> 94%)
  const rawPercentage = interpolate(frame, [25, 75], [0, 94], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const displayPercentage = Math.round(rawPercentage)

  // 4. Parâmetros do SVG de Anel Circular
  const strokeDash = `${(rawPercentage / 100) * 100}, 100`

  return (
    <div
      style={{
        transform: `translateY(${ambientFloatY}px) scale(${entrance})`,
        opacity: entrance,
      }}
      className="absolute -top-10 -right-2 sm:-right-6 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-3xl p-5 shadow-2xl shadow-black/30 border border-white/40 dark:border-neutral-700 w-52 z-20 select-none"
    >
      {/* Topo: Ícone e Título da Meta */}
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span className="text-xs font-bold font-display uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
          Meta Reserva
        </span>
      </div>

      {/* Anel de Progresso Central Remotion */}
      <div className="relative w-20 h-20 mx-auto my-1 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 overflow-visible">
          {/* Trilha de Fundo */}
          <path
            className="text-neutral-100 dark:text-neutral-700"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />

          {/* Anel de Progresso Interpolado */}
          <path
            className="text-primary-600 dark:text-primary-400"
            strokeDasharray={strokeDash}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        {/* Texto Central com Porcentagem em Tempo Real */}
        <div className="absolute flex flex-col items-center">
          <span className="text-sm font-black font-display text-neutral-900 dark:text-white">
            {displayPercentage}%
          </span>
        </div>
      </div>

      {/* Rodapé do Card */}
      <div className="text-center pt-1.5 border-t border-neutral-100 dark:border-neutral-700/60 mt-1">
        <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
          R$ 47.000 / 50k
        </span>
      </div>
    </div>
  )
}
