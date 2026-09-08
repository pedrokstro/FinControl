import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface LoginPreloaderProps {
  isOpen: boolean
  isSuccess?: boolean
  userName?: string
}

export const LoginPreloader: React.FC<LoginPreloaderProps> = ({
  isOpen,
  isSuccess = false,
}) => {
  const [stepIndex, setStepIndex] = useState(0)

  const steps = [
    { label: 'Inicializando' },
    { label: 'Carregando dados' },
    { label: 'Preparando seu painel' },
  ]

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0)
      return
    }

    const t1 = setTimeout(() => setStepIndex(1), 400)
    const t2 = setTimeout(() => setStepIndex(2), 900)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isOpen])

  // Pontos do gráfico financeiro (SVG 420x130)
  const points = [
    { cx: 30, cy: 95, delay: 0.1 },
    { cx: 90, cy: 82, delay: 0.25 },
    { cx: 145, cy: 96, delay: 0.4 },
    { cx: 200, cy: 68, delay: 0.55 },
    { cx: 245, cy: 80, delay: 0.7 },
    { cx: 295, cy: 58, delay: 0.85 },
    { cx: 345, cy: 62, delay: 1.0 },
    { cx: 390, cy: 30, delay: 1.15 },
  ]

  const pathD = "M 20 102 Q 55 92, 90 82 T 145 96 T 200 68 T 245 80 T 295 58 T 345 62 T 390 30"
  const areaD = `${pathD} L 390 128 L 20 128 Z`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            x: '-100vw',
            transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
          }}
          className="fixed inset-0 w-screen h-[100dvh] min-h-[100dvh] z-[99999] flex flex-col items-center justify-center bg-white dark:bg-white select-none px-4 py-6 sm:p-6 overflow-hidden shadow-[40px_0_80px_rgba(0,0,0,0.25)] border-r-2 border-primary-500/30"
        >
          {/* Borda direita luminosa para dar efeito premium no wipe lateral */}
          <div className="absolute top-0 bottom-0 right-0 w-[3px] bg-gradient-to-b from-primary-400 via-emerald-400 to-primary-600 pointer-events-none" />

          {/* Luz Ambiente Sutil de Fundo */}
          <div className="absolute w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] rounded-full bg-primary-500/10 blur-[90px] sm:blur-[130px] pointer-events-none -top-10" />
          <div className="absolute w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] rounded-full bg-emerald-500/10 blur-[80px] sm:blur-[120px] pointer-events-none -bottom-10" />

          {/* Container Principal em Fundo Branco com Efeito Parallax de Saída */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              x: '-35vw',
              opacity: 0.7,
              transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
            }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="relative flex flex-col items-center text-center max-w-[360px] sm:max-w-md w-full my-auto"
          >
            {/* 1. LOGO OFICIAL COM EFEITO DE PROFUNDIDADE */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-2xl sm:rounded-3xl bg-white p-2 sm:p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex items-center justify-center shrink-0"
            >
              <img
                src="/icons/logofincontrol.png"
                alt="FinControl Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* 2. TIPOGRAFIA FINCONTROL & SLOGAN EM TEMA BRANCO */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-center mb-4 sm:mb-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900">
                Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500">Control</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1 sm:mt-2 font-medium">
                Suas finanças, sob controle.
              </p>
            </motion.div>

            {/* 3. GRÁFICO FINANCEIRO VETORIAL RESPONSIVO */}
            <div className="relative w-full h-28 sm:h-36 mb-4 sm:mb-6 px-1 sm:px-2">
              {/* Badge Flutuante no Topo Direito (↗ +12,5%) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.15, type: 'spring', stiffness: 350, damping: 15 }}
                className="absolute top-0 right-1 sm:right-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white border border-emerald-200/80 text-emerald-600 text-[11px] sm:text-xs font-bold font-mono flex items-center gap-1 shadow-md shadow-emerald-500/10 z-20"
              >
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                <span>+12,5%</span>
              </motion.div>

              <svg viewBox="0 0 420 130" className="w-full h-full overflow-visible">
                <defs>
                  {/* Gradiente da Linha no Tema Claro */}
                  <linearGradient id="lightLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="30%" stopColor="#0ea5e9" />
                    <stop offset="70%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>

                  {/* Gradiente sob a Curva */}
                  <linearGradient id="lightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                    <stop offset="60%" stopColor="#10b981" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Sombra Suave da Linha */}
                  <filter id="lightLineShadow" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0284c7" floodOpacity="0.2" />
                  </filter>
                </defs>

                {/* Linhas Verticais Sutis Caindo dos Pontos */}
                {points.map((p, index) => (
                  <motion.line
                    key={`line-${index}`}
                    x1={p.cx}
                    y1={p.cy}
                    x2={p.cx}
                    y2="128"
                    stroke="#0284c7"
                    strokeOpacity="0.12"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: p.delay }}
                  />
                ))}

                {/* Preenchimento sob a Curva */}
                <motion.path
                  d={areaD}
                  fill="url(#lightAreaGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />

                {/* Traçado Fluido da Linha do Gráfico */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="url(#lightLineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#lightLineShadow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Pontos Marcadores ao Longo da Curva */}
                {points.map((p, index) => {
                  const isLast = index === points.length - 1
                  return (
                    <g key={`pt-${index}`}>
                      <motion.circle
                        cx={p.cx}
                        cy={p.cy}
                        r={isLast ? 6 : 4}
                        fill={isLast ? '#10b981' : '#0284c7'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: p.delay, type: 'spring', stiffness: 350, damping: 14 }}
                      />
                      {/* Halo Pulsante no Ponto Final */}
                      {isLast && (
                        <motion.circle
                          cx={p.cx}
                          cy={p.cy}
                          r="12"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0.7, 0], scale: [0.8, 1.8] }}
                          transition={{ delay: 1.2, repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
                        />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* 4. TEXTO DE STATUS CENTRALIZADO */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSuccess ? 'ready' : stepIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-3 sm:mb-4 min-h-[22px] sm:min-h-[26px]"
              >
                <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">
                  {isSuccess ? 'Painel pronto!' : `${steps[stepIndex].label}...`}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* 5. BARRA DE PROGRESSO EM PÍLULA FINA */}
            <div className="w-full max-w-[220px] sm:max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 sm:mb-5">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500 rounded-full shadow-[0_0_8px_rgba(2,132,199,0.3)]"
                initial={{ width: '15%' }}
                animate={{
                  width: isSuccess ? '100%' : `${Math.min((stepIndex + 1) * 45, 90)}%`,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            {/* 6. INDICADORES DE PASSOS RESPONSIVOS */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-medium text-slate-500 max-w-full">
              {steps.map((step, idx) => {
                const isActive = stepIndex === idx
                const isDone = stepIndex > idx || isSuccess
                return (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap">
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                          isActive || isDone
                            ? 'bg-primary-600 shadow-[0_0_8px_rgba(2,132,199,0.6)]'
                            : 'bg-slate-300'
                        }`}
                      />
                      <span className={isActive || isDone ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                        {step.label}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-2 sm:w-4 h-[1px] bg-slate-200" />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginPreloader
