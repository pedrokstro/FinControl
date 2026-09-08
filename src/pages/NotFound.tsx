import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, HelpCircle, Compass } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import PageTransition from '@/components/common/PageTransition'

const NotFound = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <PageTransition className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col justify-between selection:bg-primary-500 selection:text-white transition-colors duration-300">
      {/* Topo: Barra de Navegação Simples */}
      <header className="w-full max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <div
          onClick={() => navigate(isAuthenticated ? '/app/transactions' : '/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-neutral-900 dark:text-white">
            FinControl
          </span>
        </div>

        <button
          onClick={() => navigate('/support')}
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <HelpCircle className="w-4 h-4 text-primary-500" />
          <span>Precisa de ajuda?</span>
        </button>
      </header>

      {/* Centro: Conteúdo 404 Monumental */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Efeitos de Luz de Fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto text-center">
          {/* Badge 404 com Ícone Flutuante */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-6 shadow-sm"
          >
            <Compass className="w-4 h-4 text-primary-500 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Erro 404 • Página não encontrada</span>
          </motion.div>

          {/* Número Monumental */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-[clamp(5rem,18vw,10rem)] font-extrabold font-display leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 via-neutral-700 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-600 select-none mb-4"
          >
            404
          </motion.h1>

          {/* Mensagem e Instruções */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-3 mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
              Parece que você se perdeu no caminho.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              A página que você está procurando pode ter sido movida, excluída ou o endereço digitado pode conter algum erro.
            </p>
          </motion.div>

          {/* Botões de Ação */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate(isAuthenticated ? '/app/transactions' : '/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-semibold text-sm transition-all duration-200 shadow-lg shadow-neutral-900/10 dark:shadow-none hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              <span>{isAuthenticated ? 'Ir para o Painel' : 'Página Inicial'}</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à página anterior</span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* Rodapé Minimalista */}
      <footer className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400 dark:text-neutral-600">
        <p>© {new Date().getFullYear()} FinControl. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/terms')} className="hover:underline">Termos</button>
          <span>•</span>
          <button onClick={() => navigate('/privacy')} className="hover:underline">Privacidade</button>
          <span>•</span>
          <button onClick={() => navigate('/support')} className="hover:underline">Suporte</button>
        </div>
      </footer>
    </PageTransition>
  )
}

export default NotFound
