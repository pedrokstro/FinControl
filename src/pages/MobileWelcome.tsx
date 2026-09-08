import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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

  return (
    <div className="min-h-[100dvh] w-full bg-white text-neutral-900 flex flex-col justify-between p-6 sm:p-8 select-none">
      {/* Espaço superior para centralização simétrica */}
      <div className="h-6" />

      {/* Centro: Logo do FinControl e Nome */}
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center my-auto"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-3">
          <img
            src="/icons/logofincontrol.png"
            alt="FinControl Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-neutral-900">
          FinControl
        </h1>
      </motion.main>

      {/* Rodapé: Apenas o Botão Entrar */}
      <motion.footer
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full pb-4 sm:pb-6"
      >
        <button
          onClick={handleGoToLogin}
          type="button"
          className="w-full min-h-[52px] sm:min-h-[56px] rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Entrar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.footer>
    </div>
  )
}

export default MobileWelcome
