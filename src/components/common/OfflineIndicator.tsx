import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showNotification) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
        ${isOnline 
          ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 border border-success-200 dark:border-success-800' 
          : 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 border border-warning-200 dark:border-warning-800'
        }
      `}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Conexão restaurada</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Você está offline</span>
          </>
        )}
      </div>
    </div>
  )
}

export default OfflineIndicator
