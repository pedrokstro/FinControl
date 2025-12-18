import { useState, useEffect } from 'react'
import { X, Download, RefreshCw } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  useEffect(() => {
    // Detectar quando o PWA pode ser instalado
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Verificar se já foi instalado antes
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen')
      if (!hasSeenPrompt) {
        setShowInstallPrompt(true)
      }
    }

    // Detectar quando o PWA foi instalado
    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      localStorage.setItem('pwa-install-prompt-seen', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    // Detectar atualizações do Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdatePrompt(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-prompt-seen', 'true')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismissInstall = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-prompt-seen', 'true')
  }

  const handleUpdateClick = () => {
    setShowUpdatePrompt(false)
    window.location.reload()
  }

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false)
  }

  if (!showInstallPrompt && !showUpdatePrompt) return null

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-in">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-800 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Instalar FinControl
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Adicione o app à sua tela inicial para acesso rápido e experiência offline.
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 btn-primary text-xs py-2"
                  >
                    Instalar
                  </button>
                  <button
                    onClick={handleDismissInstall}
                    className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Agora não
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDismissInstall}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-in">
          <div className="bg-primary-600 dark:bg-primary-700 rounded-xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Nova versão disponível!
                </h3>
                <p className="text-xs text-white/90 mb-3">
                  Atualize agora para ter acesso às últimas melhorias.
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateClick}
                    className="flex-1 bg-white text-primary-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors text-xs"
                  >
                    Atualizar agora
                  </button>
                  <button
                    onClick={handleDismissUpdate}
                    className="px-3 py-2 text-xs text-white/90 hover:text-white transition-colors"
                  >
                    Depois
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDismissUpdate}
                className="flex-shrink-0 p-1 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PWAInstallPrompt
