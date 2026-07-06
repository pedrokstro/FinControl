import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, MoreHorizontal,
  FolderOpen, CalendarClock, CreditCard, Settings, Plus,
  Calculator, Percent, TrendingUp, LogOut, ChevronRight,
  type LucideIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks'
import { haptics } from '@/utils/haptics'
import { useAuthStore } from '@/store/authStore'

type NavItem = {
  path: string
  label: string
  icon: LucideIcon
}

// 4 itens fixos na barra + botão "Mais"
const mainItems: NavItem[] = [
  { path: '/app/dashboard',    label: 'Início',     icon: LayoutDashboard },
  { path: '/app/transactions', label: 'Transações', icon: ArrowLeftRight },
  { path: '/app/reports',      label: 'Relatórios', icon: BarChart3 },
]

type MoreView = 'main' | 'calculators'

const MobileNavBar = () => {
  const isMobile = useIsMobile()
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [moreView, setMoreView] = useState<MoreView>('main')
  const navigate = useNavigate()
  const { logout } = useAuthStore()


  if (!isMobile) return null

  const openMore = () => {
    haptics.light()
    setMoreView('main')
    setIsMoreOpen(true)
  }

  const closeMore = () => {
    haptics.light()
    setIsMoreOpen(false)
    setTimeout(() => setMoreView('main'), 300)
  }

  const goTo = (path: string) => {
    haptics.light()
    setIsMoreOpen(false)
    setTimeout(() => { setMoreView('main'); navigate(path) }, 150)
  }

  const handleLogout = () => {
    haptics.medium()
    setIsMoreOpen(false)
    logout()
  }

  return (
    <>
      {/* Overlay suave — atrás do popup mas atrás da nav também */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
            onClick={closeMore}
          />
        )}
      </AnimatePresence>

      {/* Popup flutuante acima da MobileNavBar */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{ originX: 1, originY: 1 }}
            className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-3 z-50 w-[calc(100vw-1.5rem)] max-w-sm bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>

              {/* ── Vista principal ── */}
              {moreView === 'main' && (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.16 }}
                  className="p-4 space-y-2"
                >
                  {/* Ações rápidas */}
                  <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-2">Ações Rápidas</p>
                  <button
                    onClick={() => goTo('/app/categories?add=true')}
                    className="w-full flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 px-4 py-3 rounded-2xl active:scale-[0.98] transition-transform"
                  >
                    <FolderOpen className="w-5 h-5 text-gray-600 dark:text-neutral-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Nova Categoria</span>
                  </button>

                  {/* Navegação */}
                  <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest px-1 pt-2 mb-2">Navegar</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { path: '/app/cards',         label: 'Cartões',     icon: CreditCard },
                      { path: '/app/subscriptions', label: 'Assinaturas', icon: CalendarClock },
                      { path: '/app/categories',    label: 'Categorias',  icon: FolderOpen },
                      { path: '/app/settings',      label: 'Config.',     icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <motion.button
                          key={item.path}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => goTo(item.path)}
                          className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all"
                        >
                          <div className="w-11 h-11 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500 dark:text-neutral-400 text-center leading-tight">{item.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Calculadoras */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { haptics.light(); setMoreView('calculators') }}
                    className="w-full flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-2xl transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Calculadoras</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-500" />
                  </motion.button>

                  {/* Sair */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-2xl transition-transform"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">Sair do App</span>
                  </motion.button>
                </motion.div>
              )}

              {/* ── Vista calculadoras ── */}
              {moreView === 'calculators' && (
                <motion.div
                  key="calculators"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.16 }}
                  className="p-4 space-y-2"
                >
                  <button
                    onClick={() => { haptics.light(); setMoreView('main') }}
                    className="flex items-center gap-2 text-gray-400 dark:text-neutral-500 text-sm mb-3"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    <span>Voltar</span>
                  </button>

                  <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-3">Calculadoras</p>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goTo('/app/calculadora-porcentagem')}
                    className="w-full flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 px-4 py-3.5 rounded-2xl transition-transform"
                  >
                    <Percent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Porcentagem</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goTo('/app/calculadora-juros')}
                    className="w-full flex items-center justify-between bg-gray-50 dark:bg-neutral-800 px-4 py-3.5 rounded-2xl transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Juros Compostos</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold uppercase">Pro</span>
                  </motion.button>

                  <div className="pb-1" />
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar — sempre na frente (z-50) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-neutral-800/40 shadow-2xl rounded-t-[2rem] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center px-2 justify-around">

          {/* Início */}
          <NavLink
            to={mainItems[0].path}
            onClick={() => { haptics.light(); setIsMoreOpen(false) }}
            className="flex flex-col items-center gap-0.5 py-2.5 flex-1"
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-200 ${isActive ? 'bg-primary-100 dark:bg-primary-500/20' : ''}`}
                >
                  <LayoutDashboard className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`} />
                </motion.div>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`}>Início</span>
              </>
            )}
          </NavLink>

          {/* Transações */}
          <NavLink
            to={mainItems[1].path}
            onClick={() => { haptics.light(); setIsMoreOpen(false) }}
            className="flex flex-col items-center gap-0.5 py-2.5 flex-1"
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-200 ${isActive ? 'bg-primary-100 dark:bg-primary-500/20' : ''}`}
                >
                  <ArrowLeftRight className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`} />
                </motion.div>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`}>Transações</span>
              </>
            )}
          </NavLink>

          {/* Botão central ➕ — Nova Transação */}
          <div className="flex-1 flex justify-center relative">
            <motion.button
              whileTap={{ scale: 0.9, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={() => { haptics.medium(); setIsMoreOpen(false); navigate('/app/transactions?add=true') }}
              className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 rotate-45 border border-white/20 cursor-pointer -top-1 relative"
              title="Nova Transação"
            >
              <Plus className="-rotate-45 w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Relatórios */}
          <NavLink
            to={mainItems[2].path}
            onClick={() => { haptics.light(); setIsMoreOpen(false) }}
            className="flex flex-col items-center gap-0.5 py-2.5 flex-1"
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-200 ${isActive ? 'bg-primary-100 dark:bg-primary-500/20' : ''}`}
                >
                  <BarChart3 className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`} />
                </motion.div>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`}>Relatórios</span>
              </>
            )}
          </NavLink>

          {/* Mais */}
          <button
            onClick={isMoreOpen ? closeMore : openMore}
            className="flex flex-col items-center gap-0.5 py-2.5 flex-1"
          >
            {/* Pílula estática — não gira */}
            <div className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-200 ${isMoreOpen ? 'bg-primary-100 dark:bg-primary-500/20' : ''}`}>
              {/* Só o ícone gira */}
              <motion.div
                animate={isMoreOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <MoreHorizontal className={`w-5 h-5 transition-colors duration-200 ${isMoreOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`} />
              </motion.div>
            </div>
            <span className={`text-[10px] font-semibold transition-colors duration-200 ${isMoreOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`}>Mais</span>
          </button>

        </div>
      </div>
    </>
  )
}

export default MobileNavBar
