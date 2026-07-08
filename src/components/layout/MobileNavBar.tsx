import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks'
import { haptics } from '@/utils/haptics'

const mainItems = [
  { path: '/app/dashboard',    label: 'Início',     icon: LayoutDashboard },
  { path: '/app/transactions', label: 'Transações', icon: ArrowLeftRight },
  { path: '/app/reports',      label: 'Relatórios', icon: BarChart3 },
]

const MobileNavBar = () => {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-neutral-800/40 shadow-2xl rounded-t-[2rem] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center px-4 justify-around py-1">
        {mainItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => haptics.light()}
              className="flex flex-col items-center gap-0.5 py-2.5 flex-1"
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-200 ${isActive ? 'bg-primary-100 dark:bg-primary-500/20' : ''}`}
                  >
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`} />
                  </motion.div>
                  <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNavBar
