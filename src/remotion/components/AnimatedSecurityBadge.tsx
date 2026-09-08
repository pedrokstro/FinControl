import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { Activity, CheckCircle2 } from 'lucide-react'

interface AnimatedSecurityBadgeProps {
  isDark?: boolean
}

export const AnimatedSecurityBadge: React.FC<AnimatedSecurityBadgeProps> = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // 1. Entradas dos badges satélites
  const leftBadgeEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 140 },
  })

  const rightBadgeEntrance = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, stiffness: 140 },
  })

  // 2. Movimentos orbitais sutis contínuos
  const leftFloatY = Math.sin((frame / fps) * 1.8) * 7
  const rightFloatY = Math.cos((frame / fps) * 1.6) * 7

  // 3. Brilho do indicador verde de sincronização
  const syncPulse = interpolate(frame % 45, [0, 22, 45], [0.5, 1, 0.5])

  return (
    <>
      {/* Satélite 1: Botão Circular de Atividade Financeira */}
      <div
        style={{
          transform: `translateY(${leftFloatY}px) scale(${leftBadgeEntrance})`,
          opacity: leftBadgeEntrance,
        }}
        className="absolute -bottom-5 -left-5 w-14 h-14 rounded-full bg-white dark:bg-neutral-800 shadow-2xl border border-white/50 dark:border-neutral-700 flex items-center justify-center z-20 text-primary-600 dark:text-primary-400 select-none"
      >
        <Activity className="w-6 h-6" />
      </div>

      {/* Satélite 2: Pílula de Status Sincronizado */}
      <div
        style={{
          transform: `translateY(${rightFloatY}px) scale(${rightBadgeEntrance})`,
          opacity: rightBadgeEntrance,
        }}
        className="absolute top-1/2 -right-6 sm:-right-8 bg-white/95 dark:bg-neutral-900/95 text-neutral-800 dark:text-white rounded-2xl px-4 py-2.5 shadow-2xl border border-white/40 dark:border-neutral-800 text-xs font-bold flex items-center gap-2 z-20 select-none"
      >
        <div style={{ opacity: syncPulse }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <span className="tracking-wide">Sincronizado</span>
      </div>
    </>
  )
}
