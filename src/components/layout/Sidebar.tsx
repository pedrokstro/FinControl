import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  FolderOpen,
  BarChart3,
  Settings,

  Moon,
  Sun,
  Crown,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calculator,
  ChevronDown,
  ChevronUp,
  Percent,
  TrendingUp
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/store/authStore'

type SidebarProps = {
  onNavigate?: () => void
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Carregar estado colapsado do localStorage (por usuário)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (!user?.id) return false
    const saved = localStorage.getItem(`sidebar-collapsed-${user.id}`)
    return saved === 'true'
  })

  // Estado do menu Cálculos
  const [isCalculosOpen, setIsCalculosOpen] = useState(() => {
    if (!user?.id) return false
    const saved = localStorage.getItem(`calculos-menu-open-${user.id}`)
    return saved === 'true'
  })

  // Estado do dropdown hover (para sidebar colapsada)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)

  // Salvar estado no localStorage quando mudar (por usuário)
  const toggleCollapse = () => {
    if (!user?.id) return
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem(`sidebar-collapsed-${user.id}`, String(newState))
  }

  // Funções para controlar dropdown
  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setIsDropdownOpen(true)
  }

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 200)
    setDropdownTimeout(timeout)
  }

  // Toggle menu Cálculos
  const toggleCalculos = () => {
    if (!user?.id) return
    const newState = !isCalculosOpen
    setIsCalculosOpen(newState)
    localStorage.setItem(`calculos-menu-open-${user.id}`, String(newState))
  }

  // Atualizar estado quando o usuário mudar (login/logout)
  useEffect(() => {
    if (!user?.id) {
      setIsCollapsed(false)
      return
    }
    const saved = localStorage.getItem(`sidebar-collapsed-${user.id}`)
    setIsCollapsed(saved === 'true')
  }, [user?.id])

  // Obter status premium e admin do usuário autenticado
  const isPremium = user?.isPremium || false
  const isAdmin = (user as any)?.isAdmin || false

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
    { path: '/categories', icon: FolderOpen, label: 'Categorias' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
  ]

  // Adicionar item Admin apenas se for administrador
  if (isAdmin) {
    menuItems.push({ path: '/admin', icon: Shield, label: 'Admin' })
  }

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 border-r border-primary-700 dark:border-primary-800 flex flex-col transition-all duration-300 shadow-xl relative overflow-visible`}>
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10 border-2 border-primary-500 dark:border-primary-600"
        title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        )}
      </button>

      <div className="p-6 border-b border-primary-400/30 dark:border-primary-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0 overflow-hidden p-1">
            <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-white whitespace-nowrap">FinControl</h1>
              <p className="text-xs text-white/70 whitespace-nowrap">Controle Financeiro</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto overflow-x-visible">
        <ul className="space-y-2 overflow-visible">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-white/20 backdrop-blur-sm text-white font-semibold shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </NavLink>
              </li>
            )
          })}

          {/* Menu Expansível: Cálculos */}
          <li className="relative group">
            <button
              onClick={toggleCalculos}
              onMouseEnter={(e) => {
                if (isCollapsed) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  document.documentElement.style.setProperty('--menu-top', `${rect.top}px`)
                  handleDropdownEnter()
                }
              }}
              onMouseLeave={() => {
                if (isCollapsed) {
                  handleDropdownLeave()
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white`}
              title={isCollapsed ? 'Cálculos' : ''}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                <Calculator className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Cálculos</span>}
              </div>
              {!isCollapsed && (
                isCalculosOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )
              )}
            </button>

            {/* Submenu - Expandido */}
            {!isCollapsed && isCalculosOpen && (
              <ul className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <li>
                  <NavLink
                    to="/app/calculadora-porcentagem"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${isActive
                        ? 'bg-white/20 backdrop-blur-sm text-white font-semibold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Percent className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Calc. de Porcentagem</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/app/calculadora-juros"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${isActive
                        ? 'bg-white/20 backdrop-blur-sm text-white font-semibold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <TrendingUp className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Calc. de Juros Compostos</span>
                  </NavLink>
                </li>
              </ul>
            )}

            {/* Submenu - Colapsado (Hover) */}
            {isCollapsed && isDropdownOpen && (
              <div
                className="fixed left-20 z-[9999]"
                style={{ top: 'var(--menu-top, 0)' }}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl border border-gray-200 dark:border-neutral-700 py-2 min-w-[220px] ml-2">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-neutral-300 border-b border-gray-200 dark:border-neutral-700">
                    Cálculos
                  </div>
                  <NavLink
                    to="/app/calculadora-porcentagem"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700'
                      }`
                    }
                  >
                    <Percent className="w-4 h-4 flex-shrink-0" />
                    <span>Calc. de Porcentagem</span>
                  </NavLink>
                  <NavLink
                    to="/app/calculadora-juros"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700'
                      }`
                    }
                  >
                    <TrendingUp className="w-4 h-4 flex-shrink-0" />
                    <span>Calc. de Juros Compostos</span>
                  </NavLink>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Dark Mode Toggle */}
        <div className="mt-6 pt-6 border-t border-primary-400/30 dark:border-primary-500/30">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg transition-all duration-200 bg-white/10 hover:bg-white/20 text-white`}
            title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-300" />
              )}
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                </span>
              )}
            </div>

            {/* Toggle Switch Visual */}
            {!isCollapsed && (
              <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-yellow-400' : 'bg-white/30'
                }`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`} />
              </div>
            )}
          </button>
        </div>
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-primary-400/30 dark:border-primary-500/30">
          {!isPremium ? (
            /* Premium Banner */
            <button
              onClick={() => {
                navigate('/plans')
                onNavigate?.()
              }}
              className="w-full bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-white" />
                    <span className="font-bold text-white text-sm">Premium</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
                </div>

                <p className="text-xs text-white text-opacity-95 mb-3 text-left">
                  Desbloqueie emojis exclusivos e recursos avançados!
                </p>

                <div className="flex items-center justify-between text-white">
                  <span className="text-xs font-semibold">Torne-se Premium</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ) : (
            /* Premium Active Status */
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-400 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Premium Ativo
                  </h3>
                  <p className="text-xs text-gray-600">
                    Você é Premium! 🎉
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate('/app/settings')
                  onNavigate?.()
                }}
                className="w-full mt-2 text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors text-left flex items-center gap-1"
              >
                Gerenciar assinatura →
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export default Sidebar
