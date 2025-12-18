import { useState, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface PWAStatus {
  isInstalled: boolean
  isStandalone: boolean
  canInstall: boolean
  isOnline: boolean
  needsUpdate: boolean
}

export const usePWA = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    isOnline: navigator.onLine,
    needsUpdate: false
  })

  // Registrar Service Worker e detectar atualizações
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('✅ Service Worker registrado:', registration)
    },
    onRegisterError(error) {
      console.error('❌ Erro ao registrar Service Worker:', error)
    },
  })

  useEffect(() => {
    // Detectar se está instalado como PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInstalled = (window.navigator as any).standalone || isStandalone

    setStatus(prev => ({
      ...prev,
      isInstalled,
      isStandalone,
      needsUpdate: needRefresh
    }))
  }, [needRefresh])

  useEffect(() => {
    // Monitorar status de conexão
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const update = async () => {
    await updateServiceWorker(true)
    setNeedRefresh(false)
  }

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
      console.log('✅ Cache limpo com sucesso')
    }
  }

  return {
    status,
    update,
    clearCache
  }
}
