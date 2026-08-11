import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, ShieldCheck, Zap, Sparkles, Activity, CheckCircle2 } from 'lucide-react'

interface AuthVisualSideProps {
  title?: string
  subtitle?: string
  badgeText?: string
}

export const AuthVisualSide = ({
  title,
  subtitle,
  badgeText = 'FinControl Analytics'
}: AuthVisualSideProps) => {
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = useMemo(() => [
    {
      title: title || 'Transforme suas finanças em realidade.',
      subtitle: subtitle || 'Controle, precisão e inteligência em todas as suas plataformas.'
    },
    {
      title: 'Decisões guiadas por dados reais.',
      subtitle: 'Relatórios claros, projeções de metas e zero planilhas manuais.'
    },
    {
      title: 'Segurança absoluta e sincronização.',
      subtitle: 'Criptografia de ponta a ponta e seus dados sempre protegidos.'
    }
  ], [title, subtitle])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 dark:from-neutral-900 dark:via-primary-950 dark:to-neutral-950 text-white p-12 xl:p-16 flex-col justify-between overflow-hidden select-none">
      {/* Formas Geométricas Arquiteturais de Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        
        {/* Padrão de escadaria / grid geométrico */}
        <div className="absolute top-12 right-12 w-48 h-48 border border-white/20 rounded-3xl transform rotate-12" />
        <div className="absolute bottom-20 right-16 w-64 h-64 border border-white/15 rounded-3xl transform -rotate-6" />
        <div className="absolute top-1/3 left-10 w-32 h-32 border border-white/10 rounded-2xl transform rotate-45" />
      </div>

      {/* Header Superior da Lateral Visual */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono tracking-wider text-white/90">
          <Sparkles className="w-3.5 h-3.5 text-primary-300" />
          <span>{badgeText}</span>
        </div>

        {/* Mini Badge Flutuante */}
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-yellow-300" />
        </div>
      </div>

      {/* Área Central: Cartões de Dashboard Flutuantes */}
      <div className="relative z-10 my-auto py-8 w-full max-w-xl mx-auto">
        {/* Cartão 1: Total Financeiro com Gráfico de Curva */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/30 border border-white/30 dark:border-neutral-800 backdrop-blur-xl w-full sm:w-[380px] z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Patrimônio Gerido
              </span>
              <span className="text-3xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white">
                R$ 162.750
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/40">
              <TrendingUp className="w-3.5 h-3.5" />
              +28.4%
            </div>
          </div>

          {/* Gráfico Curva SVG */}
          <div className="h-28 w-full pt-2">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 75 Q 70 85, 110 40 T 210 50 T 290 15 L 290 95 L 10 95 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 10 75 Q 70 85, 110 40 T 210 50 T 290 15"
                fill="none"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Pontos Marcadores */}
              <circle cx="110" cy="40" r="4.5" fill="#0284c7" className="animate-pulse" />
              <circle cx="290" cy="15" r="5.5" fill="#0284c7" />
              <circle cx="290" cy="15" r="9" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span>JAN</span>
            <span>MAR</span>
            <span>MAI</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">AGO (ATUAL)</span>
          </div>
        </motion.div>

        {/* Cartão 2: Meta / Rewards Flutuante Sobreposto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="absolute -top-12 -right-4 sm:-right-8 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-3xl p-5 shadow-2xl shadow-black/30 border border-white/40 dark:border-neutral-700 w-52 z-20"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-bold font-display uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Meta Reserva
            </span>
          </div>

          {/* Anel de Progresso Central */}
          <div className="relative w-20 h-20 mx-auto my-2 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-neutral-100 dark:text-neutral-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary-600 dark:text-primary-400"
                strokeDasharray="94, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-sm font-black font-display text-neutral-900 dark:text-white">94%</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
              R$ 47.000 / 50k
            </span>
          </div>
        </motion.div>

        {/* Badge Flutuante Satélite 1 (Ícone Redondo) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-6 -left-6 w-14 h-14 rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-white/50 dark:border-neutral-700 flex items-center justify-center z-20 text-primary-600 dark:text-primary-400"
        >
          <Activity className="w-6 h-6" />
        </motion.div>

        {/* Badge Flutuante Satélite 2 (Status) */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-8 bg-white/95 dark:bg-neutral-900/95 text-neutral-800 dark:text-white rounded-2xl px-4 py-2 shadow-xl border border-white/40 dark:border-neutral-800 text-xs font-bold flex items-center gap-2 z-20"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Sincronizado</span>
        </motion.div>
      </div>

      {/* Rodapé da Lateral Visual com Frase de Impacto e Dots */}
      <div className="relative z-10 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="text-2xl xl:text-3xl font-bold font-display text-white mb-2 leading-tight">
              {slides[activeSlide].title}
            </h3>
            <p className="text-sm xl:text-base text-white/80 leading-relaxed">
              {slides[activeSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Dots */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AuthVisualSide
