import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, MoreHorizontal,
  FolderOpen, CalendarClock, CreditCard, Settings, Plus,
  Calculator, Percent, TrendingUp, LogOut, ChevronRight,
  type LucideIcon
} from 'lucide-react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
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
  const dragControls = useDragControls()

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
      {/* Overlay */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-md"
            onClick={closeMore}
          />
        )}
      </AnimatePresence>

      {/* Sheet "Mais" */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 400) {
                closeMore()
              }
            }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-950 rounded-t-[2rem] shadow-2xl border-t border-gray-100/40 dark:border-neutral-800/30 overflow-hidden pb-[calc(2rem+env(safe-area-inset-bottom))]"
          >
            {/* Handle */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-gray-200 dark:bg-neutral-700 rounded-full" />
            </div>

            <AnimatePresence mode="wait" initial={false}>

              {/* ── Vista principal ── */}
              {moreView === 'main' && (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="p-4 space-y-2"
                >
                  {/* Ações rápidas */}
                  <p className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest px-1 mb-3">Ações Rápidas</p>
                  <button
                    onClick={() => goTo('/app/categories?add=true')}
                    className="w-full flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 px-4 py-3 rounded-2xl active:scale-[0.98] transition-transform"
                  >
                    <FolderOpen className="w-5 h-5 text-gray-600 dark:text-neutral-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Nova Categoria</span>
                  </button>

                  {/* Navegação */}
                  <p className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest px-1 mt-4 mb-3">Navegar</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { path: '/app/cards',         label: 'Cartões',     icon: CreditCard },
                      { path: '/app/subscriptions', label: 'Assinaturas', icon: CalendarClock },
                      { path: '/app/categories',    label: 'Categorias',  icon: FolderOpen },
                      { path: '/app/settings',      label: 'Config.',     icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.path}
                          onClick={() => goTo(item.path)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all"
                        >
                          <div className="w-11 h-11 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-600 dark:text-neutral-300 text-center">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Calculadoras */}
                  <button
                    onClick={() => { haptics.light(); setMoreView('calculators') }}
                    className="w-full flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-2xl active:scale-[0.98] transition-transform mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Calculadoras</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-500" />
                  </button>

                  {/* Sair */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-2xl active:scale-[0.98] transition-transform"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">Sair do App</span>
                  </button>

                  <div className="pb-2" />
                </motion.div>
              )}

              {/* ── Vista calculadoras ── */}
              {moreView === 'calculators' && (
                <motion.div
                  key="calculators"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.18 }}
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

                  <button
                    onClick={() => goTo('/app/calculadora-porcentagem')}
                    className="w-full flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
                  >
                    <Percent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Porcentagem</span>
                  </button>

                  <button
                    onClick={() => goTo('/app/calculadora-juros')}
                    className="w-full flex items-center justify-between bg-gray-50 dark:bg-neutral-800 px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Juros Compostos</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold uppercase">Pro</span>
                  </button>

                  <div className="pb-2" />
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-neutral-800/40 shadow-2xl rounded-t-[2rem] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center px-4 justify-around">

          {/* Início */}
          <NavLink
            to={mainItems[0].path}
            onClick={() => { haptics.light(); setIsMoreOpen(false) }}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 flex-1 relative transition-all border-t-2 ${isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-500/5 dark:bg-white/5 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-neutral-400 border-transparent'}`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <LayoutDashboard className="w-5 h-5" />
                </motion.div>
                <span className="text-[10px] font-medium">Início</span>
              </>
            )}
          </NavLink>

          {/* Transações */}
          <NavLink
            to={mainItems[1].path}
            onClick={() => { haptics.light(); setIsMoreOpen(false) }}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 flex-1 relative transition-all border-t-2 ${isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-500/5 dark:bg-white/5 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-neutral-400 border-transparent'}`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </motion.div>
                <span className="text-[10px] font-medium">Transações</span>
              </>
            )}
          </NavLink>

          {/* Botão central ➕ — Nova Transação (Formato de Diamante de Finanças) */}
          <div className="flex-1 flex justify-center relative">
            <motion.button
              whileTap={{ scale: 0.9, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={() => { haptics.medium(); setIsMoreOpen(false); navigate('/app/transactions?add=true') }}
              className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 rotate-45 border border-white/20 cursor-pointer -top-2 relative"
              title="Nova Transação"
            >
              <Plus className="-rotate-45 w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Relatórios */}
          <NavLink
            to={mainItems[2].path}
            onClick={() => { haptics.light(); setIsMoreOpen(false) }}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 flex-1 relative transition-all border-t-2 ${isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-500/5 dark:bg-white/5 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-neutral-400 border-transparent'}`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <BarChart3 className="w-5 h-5" />
                </motion.div>
                <span className="text-[10px] font-medium">Relatórios</span>
              </>
            )}
          </NavLink>

          {/* Mais / rotativo */}
          <button
            onClick={isMoreOpen ? closeMore : openMore}
            className={`flex flex-col items-center gap-1 py-3 flex-1 relative transition-all border-t-2 ${isMoreOpen ? 'text-primary-600 dark:text-primary-400 bg-primary-500/5 dark:bg-white/5 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-neutral-400 border-transparent'}`}
          >
            <motion.div
              animate={isMoreOpen ? { rotate: 90, scale: 1.15, y: -2 } : { rotate: 0, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px] font-medium">Mais</span>
          </button>

        </div>
      </div>
    </>
  )
}

export default MobileNavBar
