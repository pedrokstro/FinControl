import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  TrendingUp,
  CalendarClock,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/store/authStore'

type SidebarProps = {
  onNavigate?: () => void
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { user, logout, loadAvatar } = useAuthStore()

  // Carregar avatar ao montar
  useEffect(() => {
    loadAvatar()
  }, [loadAvatar])

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

  const menuSections = [
    {
      title: 'Geral',
      items: [
        { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard', activeColor: 'text-primary-600 dark:text-primary-400', activeBg: 'from-primary-500/10 to-transparent dark:from-primary-500/5' },
        { path: '/app/transactions', icon: ArrowLeftRight, label: 'Transações', activeColor: 'text-emerald-500 dark:text-emerald-400', activeBg: 'from-emerald-500/10 to-transparent dark:from-emerald-500/5' },
        { path: '/app/cards', icon: CreditCard, label: 'Cartões', activeColor: 'text-orange-500 dark:text-orange-400', activeBg: 'from-orange-500/10 to-transparent dark:from-orange-500/5' },
        { path: '/app/categories', icon: FolderOpen, label: 'Categorias', activeColor: 'text-violet-500 dark:text-violet-400', activeBg: 'from-violet-500/10 to-transparent dark:from-violet-500/5' },
      ]
    },
    {
      title: 'Análise',
      items: [
        { path: '/app/reports', icon: BarChart3, label: 'Relatórios', activeColor: 'text-sky-500 dark:text-sky-400', activeBg: 'from-sky-500/10 to-transparent dark:from-sky-500/5' },
        { path: '/app/subscriptions', icon: CalendarClock, label: 'Assinaturas', activeColor: 'text-pink-500 dark:text-pink-400', activeBg: 'from-pink-500/10 to-transparent dark:from-pink-500/5' },
      ]
    },
    {
      title: 'Preferências',
      items: [
        { path: '/app/settings', icon: Settings, label: 'Configurações', activeColor: 'text-slate-500 dark:text-slate-400', activeBg: 'from-slate-500/10 to-transparent dark:from-slate-500/5' },
        ...(isAdmin ? [{ path: '/admin', icon: Shield, label: 'Admin', activeColor: 'text-red-500 dark:text-red-400', activeBg: 'from-red-500/10 to-transparent dark:from-red-500/5' }] : [])
      ]
    }
  ]

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen flex flex-col transition-all duration-300 shadow-xl relative overflow-visible z-30`}>
      {/* Background (alinhado com o layout reto e sólido do Header) */}
      <div className="absolute inset-0 -z-10 bg-white dark:bg-neutral-900/95 border-r border-gray-200/50 dark:border-neutral-800/60 shadow-xl pointer-events-none" />

      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3.5 top-6 w-7 h-7 bg-primary-600 hover:bg-primary-700 active:scale-95 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-50 border border-white/20 dark:border-neutral-800/30 cursor-pointer"
        title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        style={{ right: '-14px' }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </button>

      <div className="p-6 border-b border-gray-100 dark:border-neutral-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50/50 dark:bg-neutral-800 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 overflow-hidden p-1.5 border border-gray-100 dark:border-neutral-700/60">
            <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white whitespace-nowrap font-display tracking-tight leading-none">FinControl</h1>
              <p className="text-xs text-gray-550 dark:text-neutral-400 whitespace-nowrap mt-1">Controle Financeiro</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuSections.map((section, secIdx) => (
          <div key={section.title} className={secIdx > 0 ? 'mt-6' : ''}>
            {!isCollapsed && (
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-4 mb-2">
                {section.title}
              </h2>
            )}
            <ul className="space-y-1.5 overflow-visible relative">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path} className="relative overflow-visible">
                    <NavLink
                      to={item.path}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex items-center relative ${isCollapsed ? 'justify-center hover:scale-105' : 'gap-3 hover:translate-x-1.5'} px-4 py-3 rounded-xl transition-all duration-300 overflow-visible ${isActive
                          ? 'bg-primary-50/50 dark:bg-primary-950/20 text-primary-600 dark:text-white font-bold border border-primary-100/50 dark:border-primary-900/10'
                          : 'text-gray-500 dark:text-neutral-300 hover:bg-gray-100/70 dark:hover:bg-neutral-900/50 hover:text-gray-900 dark:hover:text-white'
                        }`
                      }
                      title={isCollapsed ? item.label : ''}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Marcador Vertical Deslizante (LayoutId) */}
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-1.5 w-1 h-5 bg-primary-600 dark:bg-primary-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            />
                          )}

                          {/* Brilho de gradiente interno */}
                          {isActive && (
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.activeBg} rounded-xl pointer-events-none`} />
                          )}

                          <Icon className={`w-5 h-5 flex-shrink-0 relative z-10 transition-colors ${isActive ? item.activeColor : 'text-gray-400 dark:text-neutral-400 group-hover:text-gray-600 dark:group-hover:text-neutral-200'}`} />
                          {!isCollapsed && <span className="whitespace-nowrap relative z-10">{item.label}</span>}
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {/* Seção: Ferramentas (Menu Expansível de Cálculos) */}
        <div className="mt-6">
          {!isCollapsed && (
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-4 mb-2">
              Ferramentas
            </h2>
          )}
          <div className="relative group">
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
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition-all duration-300 text-gray-500 dark:text-neutral-300 hover:bg-gray-100/70 dark:hover:bg-neutral-900/50 hover:text-gray-900 dark:hover:text-white`}
              title={isCollapsed ? 'Cálculos' : ''}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                <Calculator className="w-5 h-5 flex-shrink-0 text-amber-500" />
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
              <ul className="mt-2 ml-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200 border-l border-gray-100 dark:border-neutral-800/60 pl-3">
                <li>
                  <NavLink
                    to="/app/calculadora-porcentagem"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 text-sm hover:translate-x-1.5 ${isActive
                        ? 'bg-primary-50/50 dark:bg-primary-950/20 text-primary-600 dark:text-white font-semibold border-l-2 border-primary-500/80 pl-3'
                        : 'text-gray-550 dark:text-neutral-300 hover:bg-gray-100/70 dark:hover:bg-neutral-900/50 hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <Percent className="w-4 h-4 flex-shrink-0 text-violet-500" />
                    <span className="whitespace-nowrap">Porcentagem</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/app/calculadora-juros"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 text-sm hover:translate-x-1.5 ${isActive
                        ? 'bg-primary-50/50 dark:bg-primary-950/20 text-primary-600 dark:text-white font-semibold border-l-2 border-primary-500/80 pl-3'
                        : 'text-gray-555 dark:text-neutral-300 hover:bg-gray-100/70 dark:hover:bg-neutral-900/50 hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <TrendingUp className="w-4 h-4 flex-shrink-0 text-emerald-500 animate-arrow-up" />
                    <span className="whitespace-nowrap">Juros Compostos</span>
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
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-150 dark:border-neutral-800 py-2 min-w-[220px] ml-2">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 border-b border-gray-100 dark:border-neutral-800">
                    Cálculos
                  </div>
                  <NavLink
                    to="/app/calculadora-porcentagem"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive
                        ? 'bg-primary-50/50 dark:bg-primary-950/20 text-primary-600 dark:text-white font-semibold'
                        : 'text-gray-650 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                      }`
                    }
                  >
                    <Percent className="w-4 h-4 flex-shrink-0 text-violet-500" />
                    <span>Porcentagem</span>
                  </NavLink>
                  <NavLink
                    to="/app/calculadora-juros"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive
                        ? 'bg-primary-50/50 dark:bg-primary-950/20 text-primary-600 dark:text-white font-semibold'
                        : 'text-gray-650 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                      }`
                    }
                  >
                    <TrendingUp className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                    <span>Juros Compostos</span>
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-800/60">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition-all duration-300 bg-gray-50 dark:bg-neutral-900/50 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-100/50 dark:border-neutral-800/30`}
            title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
              )}
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                </span>
              )}
            </div>

            {/* Toggle Switch Visual */}
            {!isCollapsed && (
              <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
                }`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`} />
              </div>
            )}
          </button>
        </div>
      </nav>



      {/* Bloco do Usuário (Foto e Logout) */}
      <div className="p-4 border-t border-gray-100 dark:border-neutral-800/60">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name}
              className="w-9 h-9 rounded-xl border border-gray-200 dark:border-neutral-700 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
              }}
            />
            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={user?.name}
                className="w-9 h-9 rounded-xl border border-gray-200 dark:border-neutral-700 object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                }}
              />
              <div className="overflow-hidden leading-none text-left">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-neutral-500 mt-1 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 rounded-xl transition-colors cursor-pointer flex-shrink-0"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
