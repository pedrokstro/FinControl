import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, FolderOpen, Calculator, type LucideIcon } from 'lucide-react'
import { useIsMobile } from '@/hooks'

type NavItem = {
  path: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Início', icon: LayoutDashboard },
  { path: '/app/transactions', label: 'Transações', icon: ArrowLeftRight },
  { path: '/app/categories', label: 'Categorias', icon: FolderOpen },
  { path: '/app/reports', label: 'Relatórios', icon: BarChart3 },
  { path: '/app/calculadora-porcentagem', label: 'Calculadora', icon: Calculator },
  { path: '/app/settings', label: 'Configurações', icon: Settings },
]

const MobileNavBar = () => {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="mx-3 mb-3">
        <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl px-2 py-2.5 flex items-center justify-between pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 text-[9px] font-medium transition-colors flex-1 ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-neutral-400'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-center leading-tight">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileNavBar
