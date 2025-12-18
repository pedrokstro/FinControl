import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, Plus } from 'lucide-react'
import { useIsMobile } from '@/hooks'

interface MobileNavBarProps {
  isSidebarOpen: boolean
}

const navItems = [
  { path: '/app/dashboard', label: 'Início', icon: LayoutDashboard },
  { path: '/app/transactions', label: 'Transações', icon: ArrowLeftRight },
  { path: '/app/reports', label: 'Relatórios', icon: BarChart3 },
  { path: '/app/settings', label: 'Configurações', icon: Settings },
]

const MobileNavBar = ({ isSidebarOpen }: MobileNavBarProps) => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  if (!isMobile || isSidebarOpen) {
    return null
  }

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="mx-4 mb-4">
        <div className="relative bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl px-5 py-3 flex items-center justify-between gap-3 pointer-events-auto">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-neutral-400'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

          <button
            type="button"
            onClick={() => navigate('/app/dashboard?quickAdd=expense')}
            className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-primary-600 dark:bg-primary-500 text-white shadow-xl flex flex-col items-center justify-center gap-1 border-4 border-white dark:border-neutral-950"
          >
            <Plus className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Adicionar</span>
          </button>

          {navItems.slice(2).map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-neutral-400'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileNavBar
