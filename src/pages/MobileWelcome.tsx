import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap, PieChart, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { haptics } from '@/utils/haptics'

export const MobileWelcome = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/transactions', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleGoToLogin = () => {
    haptics.medium()
    navigate('/login')
  }

  const handleGoToRegister = () => {
    haptics.light()
    navigate('/register')
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-neutral-950 text-white flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
      {/* Luzes de Fundo / Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-72 h-72 bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Topo / Status */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between pt-2"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">App v2.16</span>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-medium">
          FinControl Mobile
        </span>
      </motion.header>

      {/* Centro: Logo, Título e Proposta de Valor */}
      <motion.main
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center my-auto py-6"
      >
        {/* Card do Ícone com Glow e Animação */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-primary-500/30 blur-xl scale-110 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-neutral-900 border border-white/15 p-4 shadow-2xl flex items-center justify-center backdrop-blur-md">
            <img
              src="/icons/logofincontrol.png"
              alt="FinControl Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Título & Slogan */}
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2.5">
          FinControl
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-[280px] leading-relaxed mb-6 font-normal">
          Controle financeiro inteligente na palma da sua mão.
        </p>

        {/* Badges de Benefícios */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300">
            <Zap className="w-3.5 h-3.5 text-primary-400" /> Rápido e Intuitivo
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Criptografado
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300">
            <PieChart className="w-3.5 h-3.5 text-violet-400" /> Orçamentos Inteligentes
          </span>
        </div>
      </motion.main>

      {/* Rodapé: Ações e Botão Entrar */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex flex-col gap-3 pb-2"
      >
        {/* Botão Principal: Entrar */}
        <button
          onClick={handleGoToLogin}
          type="button"
          className="w-full min-h-[54px] rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-size-200 text-white font-bold text-base shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all group"
        >
          <span>Entrar</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        {/* Botão Secundário: Criar Conta */}
        <button
          onClick={handleGoToRegister}
          type="button"
          className="w-full min-h-[50px] rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-200 font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span>Criar nova conta</span>
        </button>

        {/* Link Opcional para Landing Completa */}
        <div className="pt-2 text-center">
          <Link
            to="/landing"
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors underline-offset-4 hover:underline"
          >
            Ver página institucional completa
          </Link>
        </div>
      </motion.footer>
    </div>
  )
}

export default MobileWelcome
