import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { AnimatedChartCard } from './components/AnimatedChartCard'
import { AnimatedGoalCard } from './components/AnimatedGoalCard'
import { AnimatedSecurityBadge } from './components/AnimatedSecurityBadge'
import { AuthHeroProps } from './types'

export const AuthHeroComposition: React.FC<AuthHeroProps> = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Movimentos de Paralaxe para as Formas Geométricas de Fundo
  const bgRotation1 = (frame / fps) * 3
  const bgRotation2 = -(frame / fps) * 2

  return (
    <AbsoluteFill className="flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      {/* 1. FORMAS GEOMÉTRICAS DE FUNDO COM PARALLAX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div
          style={{ transform: `rotate(${12 + bgRotation1}deg)` }}
          className="absolute top-4 right-6 w-56 h-56 border border-white/20 rounded-3xl"
        />
        <div
          style={{ transform: `rotate(${-6 + bgRotation2}deg)` }}
          className="absolute bottom-6 right-10 w-72 h-72 border border-white/15 rounded-3xl"
        />
        <div
          style={{ transform: `rotate(${45 + bgRotation1 * 0.5}deg)` }}
          className="absolute top-1/4 left-4 w-36 h-36 border border-white/10 rounded-2xl"
        />
      </div>

      {/* 2. ÁREA CENTRAL DOS CARDS FINANCIEROS */}
      <div className="relative w-full max-w-lg mx-auto flex items-center justify-center">
        {/* Card Principal de Gráfico */}
        <AnimatedChartCard />

        {/* Card de Meta Sobreposto */}
        <AnimatedGoalCard />

        {/* Satélites e Badges */}
        <AnimatedSecurityBadge />
      </div>
    </AbsoluteFill>
  )
}
export default AuthHeroComposition
