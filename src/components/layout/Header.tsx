import { useEffect, useMemo, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Sun, SunDim, MoonStar, Plus } from 'lucide-react'
import NotificationDropdown from '@/components/NotificationDropdown'

const getGreetingData = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      text: 'Bom dia',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    }
  }
  if (hour >= 12 && hour < 18) {
    return {
      text: 'Boa tarde',
      icon: <SunDim className="w-5 h-5 text-orange-400" />,
    }
  }
  return {
    text: 'Boa noite',
    icon: <MoonStar className="w-5 h-5 text-indigo-400" />,
  }
}

const Header = () => {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const greeting = useMemo(() => getGreetingData(), [])

  const handleQuickAdd = useCallback(() => {
    if (location.pathname === '/app/dashboard') {
      navigate('/app/dashboard?quickAdd=expense')
      return
    }
    navigate('/app/transactions?add=true')
  }, [location.pathname, navigate])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        handleQuickAdd()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleQuickAdd])

  return (
    <header className="chrome-translucent bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-gray-200/80 dark:border-neutral-800/80 px-4 sm:px-6 py-3 pt-[calc(theme(spacing.3)+env(safe-area-inset-top))] transition-colors duration-150 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 bg-gray-100/80 dark:bg-neutral-900/80 px-3.5 py-1.5 rounded-full border border-gray-200/70 dark:border-neutral-800/80">
          {greeting.icon}
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-display leading-none">
            {greeting.text}, <span className="text-primary-600 dark:text-primary-400">{user?.name?.split(' ')[0]}</span>!
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
          <button
            type="button"
            onClick={handleQuickAdd}
            title="Nova Transação (Alt+N)"
            className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-primary-600 hover:bg-primary-700 active:scale-[0.97] text-white text-xs font-semibold shadow-sm transition-[transform,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>Nova Transação</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono tabular-figures bg-white/15 rounded text-white/90">
              Alt+N
            </kbd>
          </button>
          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
}

export default Header
