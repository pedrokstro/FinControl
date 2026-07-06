import { useAuthStore } from '@/store/authStore'
import { Sun, SunDim, MoonStar } from 'lucide-react'
import NotificationDropdown from '@/components/NotificationDropdown'

const Header = () => {
  const { user } = useAuthStore()

  // Função para obter saudação baseada na hora com ícone e classes de animação
  const getGreetingData = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return {
        text: 'Bom dia',
        icon: <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />,
      }
    }
    if (hour >= 12 && hour < 18) {
      return {
        text: 'Boa tarde',
        icon: <SunDim className="w-5 h-5 text-orange-400 animate-pulse" />,
      }
    }
    return {
      text: 'Boa noite',
      icon: <MoonStar className="w-5 h-5 text-indigo-400 animate-float-slow" />,
    }
  }

  return (
    <header className="bg-white/75 dark:bg-black/75 backdrop-blur-lg border-b border-gray-200/50 dark:border-neutral-800/40 px-4 sm:px-6 py-3 pt-[calc(theme(spacing.3)+env(safe-area-inset-top))] transition-colors duration-300 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 bg-gray-50/50 dark:bg-neutral-900/40 px-3.5 py-1.5 rounded-full border border-gray-100/50 dark:border-neutral-800/40 backdrop-blur-sm">
          {getGreetingData().icon}
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-display leading-none">
            {getGreetingData().text}, <span className="text-primary-600 dark:text-primary-400">{user?.name?.split(' ')[0]}</span>!
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
}

export default Header
