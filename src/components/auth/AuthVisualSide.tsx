import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'
import { Player } from '@remotion/player'
import { AuthHeroComposition } from '@/remotion/AuthHeroComposition'

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
        
        {/* Padrão geométrico decorativo */}
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

      {/* Área Central: Player do Remotion com Animação Fluida a 60fps */}
      <div className="relative z-10 my-auto py-4 w-full max-w-xl mx-auto flex items-center justify-center">
        <div className="w-full aspect-[4/3] max-h-[460px] rounded-3xl overflow-visible flex items-center justify-center">
          <Player
            component={AuthHeroComposition}
            durationInFrames={450}
            compositionWidth={800}
            compositionHeight={600}
            fps={30}
            autoPlay
            loop
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
            }}
            inputProps={{
              isDark: true,
            }}
          />
        </div>
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

