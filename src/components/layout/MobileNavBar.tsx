import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, Plus, type LucideIcon } from 'lucide-react'
import { useIsMobile } from '@/hooks'

interface MobileNavBarProps {
  isSidebarOpen: boolean
}

type NavItem = {
  path: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
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

  type NavStructureItem = NavItem | { type: 'add' }

  const navStructure: NavStructureItem[] = [
    ...navItems.slice(0, 2),
    { type: 'add' as const },
    ...navItems.slice(2),
  ]

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="mx-4 mb-4">
        <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl px-5 py-3 flex items-center justify-between gap-3 pointer-events-auto">
          {navStructure.map((item, index) => {
            const baseClasses = ({ isActive }: { isActive: boolean }) =>
              `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-neutral-400'
              }`

            if ('type' in item && item.type === 'add') {
              return (
                <button
                  key="mobile-add"
                  type="button"
                  onClick={() => navigate('/app/dashboard?quickAdd=expense')}
                  className={`${baseClasses({ isActive: true })} text-primary-600 dark:text-primary-300`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar</span>
                </button>
              )
            }

            const navItem = item as NavItem
            const Icon = navItem.icon
            return (
              <NavLink
                key={`${navItem.path}-${index}`}
                to={navItem.path}
                className={({ isActive }) => baseClasses({ isActive })}
              >
                <Icon className="w-5 h-5" />
                <span>{navItem.label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileNavBar
