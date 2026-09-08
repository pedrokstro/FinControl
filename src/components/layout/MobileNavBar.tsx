import { NavLink } from 'react-router-dom'
import { Home, ArrowLeftRight, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks'
import { haptics } from '@/utils/haptics'

const mainItems = [
  { path: '/app/dashboard',    label: 'Início',     icon: Home },
  { path: '/app/transactions', label: 'Transações', icon: ArrowLeftRight },
  { path: '/app/reports',      label: 'Relatórios', icon: BarChart3 },
]

const MobileNavBar = () => {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <nav
      aria-label="Navegação móvel"
      className="lg:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none px-3 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)]">
        {mainItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => haptics.light()}
              className="relative flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
            >
              {({ isActive }) => (
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? 'px-3.5 py-2 text-white'
                      : 'p-2.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-90 transition-transform'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActivePill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 shadow-md shadow-primary-500/30"
                      transition={{ type: 'spring', stiffness: 430, damping: 32 }}
                    />
                  )}

                  <Icon className="w-5 h-5 relative z-10 shrink-0" />

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="relative z-10 text-xs font-bold ml-1.5 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNavBar
