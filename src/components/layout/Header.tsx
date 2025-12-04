import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Calendar, Clock, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import NotificationDropdown from '@/components/NotificationDropdown'

const Header = () => {
  const { user, logout, loadAvatar } = useAuthStore()
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Carregar avatar ao montar
  useEffect(() => {
    loadAvatar()
  }, [loadAvatar])

  // Atualizar data e hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Função para obter saudação baseada na hora
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <header className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {format(currentDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-neutral-700"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                {format(currentDateTime, 'HH:mm:ss')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg transition-all"
            >
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-neutral-700 object-cover"
                onError={(e) => {
                  // Fallback se imagem falhar
                  const target = e.target as HTMLImageElement
                  target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                }}
              />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getGreeting()}, {user?.name?.split(' ')[0]}
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Ver perfil
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-neutral-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-neutral-800 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    {user?.email}
                  </p>
                </div>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Configurações
                </a>
                <div className="border-t border-gray-200 dark:border-neutral-800 mt-2 pt-2">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
