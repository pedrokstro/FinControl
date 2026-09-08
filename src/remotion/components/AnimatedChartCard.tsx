import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { TrendingUp } from 'lucide-react'

interface AnimatedChartCardProps {
  isDark?: boolean
}

export const AnimatedChartCard: React.FC<AnimatedChartCardProps> = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // 1. Entrada do Card com Spring Physics
  const cardEntrance = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
      mass: 0.8,
    },
  })

  // 2. Flutuação Ambiente Contínua
  const ambientFloatY = Math.sin((frame / fps) * 2) * 5

  // 3. Contagem Crescente do Patrimônio (R$ 0 -> R$ 162.750)
  const rawValue = interpolate(frame, [10, 50], [0, 162750], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const formattedValue = Math.round(rawValue).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })

  // 4. Traçado Progressivo da Curva do Gráfico
  const pathLength = 320
  const strokeProgress = interpolate(frame, [15, 65], [pathLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  // 5. Coordenadas do Ponto de Luz Guia no topo da curva
  const progressRatio = interpolate(frame, [15, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const lightX = 10 + progressRatio * 280
  const lightY = interpolate(progressRatio, [0, 0.35, 0.7, 1], [75, 40, 50, 15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // 6. Entrada do Badge de Rendimento (+28.4%)
  const badgeScale = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 10,
      stiffness: 180,
    },
  })

  return (
    <div
      style={{
        transform: `translateY(${ambientFloatY}px) scale(${cardEntrance})`,
        opacity: cardEntrance,
      }}
      className="relative bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/30 border border-white/30 dark:border-neutral-800 backdrop-blur-xl w-full max-w-[390px] z-10 select-none"
    >
      {/* Topo: Título, Valor e Badge */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Patrimônio Gerido
          </span>
          <span className="text-3xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white">
            {formattedValue}
          </span>
        </div>

        {badgeScale > 0 && (
          <div
            style={{ transform: `scale(${badgeScale})` }}
            className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/40 shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            +28.4%
          </div>
        )}
      </div>

      {/* Gráfico Curva SVG Renderizado pelo Remotion */}
      <div className="h-28 w-full pt-2 relative">
        <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="remotionChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>

            <filter id="remotionGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Área Gradiente sob a Curva */}
          <path
            d="M 10 75 Q 70 85, 110 40 T 210 50 T 290 15 L 290 95 L 10 95 Z"
            fill="url(#remotionChartGrad)"
            opacity={interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp' })}
          />

          {/* Linha da Curva Animada com Dashoffset */}
          <path
            d="M 10 75 Q 70 85, 110 40 T 210 50 T 290 15"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeProgress}
          />

          {/* Feixe de Luz Guia no Ponto Atual */}
          {progressRatio > 0 && progressRatio < 1 && (
            <circle
              cx={lightX}
              cy={lightY}
              r="6"
              fill="#38bdf8"
              filter="url(#remotionGlow)"
              className="animate-pulse"
            />
          )}

          {/* Ponto Marcador Intermediário */}
          {progressRatio >= 0.45 && (
            <circle cx="110" cy="40" r="4.5" fill="#0284c7" />
          )}

          {/* Ponto Final da Curva com Halo */}
          {progressRatio >= 0.98 && (
            <>
              <circle cx="290" cy="15" r="5.5" fill="#0284c7" />
              <circle
                cx="290"
                cy="15"
                r={interpolate(frame % 30, [0, 30], [6, 12])}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity={interpolate(frame % 30, [0, 30], [0.8, 0])}
              />
            </>
          )}
        </svg>
      </div>

      {/* Meses do Eixo X */}
      <div className="flex justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <span>JAN</span>
        <span>MAR</span>
        <span>MAI</span>
        <span className="font-bold text-primary-600 dark:text-primary-400">AGO (ATUAL)</span>
      </div>
    </div>
  )
}
