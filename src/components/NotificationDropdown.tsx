import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck, Trash2, X, Info, AlertTriangle, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import notificationService, { Notification } from '@/services/notification.service'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import { useIsMobile } from '@/hooks'
import { haptics } from '@/utils/haptics'

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRinging, setIsRinging] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Carregar notificações ao abrir
  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  // Carregar contador ao montar
  useEffect(() => {
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleDropdown = () => {
    haptics.light()
    setIsRinging(true)
    setTimeout(() => setIsRinging(false), 600)
    setIsOpen(prev => !prev)
  }

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await notificationService.getAll(20)
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Erro ao carregar contador:', error)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      haptics.light()
      await notificationService.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      toast.error('Erro ao marcar como lida')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      haptics.medium()
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('Todas marcadas como lidas')
    } catch (error) {
      toast.error('Erro ao marcar todas como lidas')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      haptics.warning()
      await notificationService.delete(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success('Notificação removida')
    } catch (error) {
      toast.error('Erro ao remover notificação')
    }
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        )
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
        )
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button com Animação de Sino */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleDropdown}
        aria-label="Notificações"
        className={`relative p-2.5 rounded-2xl transition-colors duration-200 ${
          isOpen
            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/80'
        }`}
      >
        <motion.div
          animate={
            isRinging || (unreadCount > 0 && !isOpen)
              ? {
                  rotate: [0, -18, 18, -12, 12, -6, 6, 0],
                  transition: {
                    duration: 0.7,
                    ease: 'easeInOut',
                    repeat: isRinging ? 0 : Infinity,
                    repeatDelay: 4,
                  },
                }
              : { rotate: 0 }
          }
          className="origin-top"
        >
          <Bell className="w-5 h-5" />
        </motion.div>

        {/* Badge Pulsante com Efeito de Onda */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
              className="absolute top-1 right-1 flex items-center justify-center"
            >
              <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60" />
              <span className="relative min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md shadow-rose-500/30">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop para Mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dropdown Container Animado */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              isMobile
                ? { opacity: 0, y: -20, scale: 0.95 }
                : { opacity: 0, scale: 0.92, y: -10, transformOrigin: 'top right' }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              isMobile
                ? { opacity: 0, y: -15, scale: 0.96 }
                : { opacity: 0, scale: 0.92, y: -8, transformOrigin: 'top right' }
            }
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className={`
              ${isMobile ? 'fixed inset-x-4 top-20 w-auto max-w-none' : 'absolute right-0 mt-3 w-96'}
              bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-[24px]
              shadow-2xl shadow-neutral-950/15 dark:shadow-black/60
              border border-gray-100 dark:border-neutral-800/80 z-50 flex flex-col overflow-hidden
              ${isMobile ? 'max-h-[75vh]' : 'max-h-[580px]'}
            `}
          >
            {/* Header com Gradiente Sutil */}
            <div className="p-4 sm:px-5 sm:py-4 border-b border-gray-100/80 dark:border-neutral-800/80 bg-gradient-to-b from-gray-50/80 to-transparent dark:from-neutral-850/60 dark:to-transparent flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white font-display">
                    Notificações
                  </h3>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400 font-medium">
                    {unreadCount > 0 ? `${unreadCount} nova${unreadCount > 1 ? 's' : ''} mensagem${unreadCount > 1 ? 'ns' : ''}` : 'Tudo atualizado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleMarkAllAsRead}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-xl transition-colors"
                    title="Marcar todas como lidas"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* List com Animação Staggered */}
            <div className="overflow-y-auto flex-1 custom-scrollbar divide-y divide-gray-100/60 dark:divide-neutral-800/50">
              {isLoading ? (
                <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"
                  />
                  <p className="text-xs text-gray-400 dark:text-neutral-500 font-medium">
                    Buscando notificações...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 flex items-center justify-center mb-3 text-gray-300 dark:text-neutral-600 shadow-inner"
                  >
                    <Bell className="w-7 h-7" />
                  </motion.div>
                  <p className="text-sm font-bold text-gray-800 dark:text-neutral-200">
                    Nenhuma notificação por aqui
                  </p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 max-w-[200px]">
                    Avisaremos assim que houver novidades sobre suas finanças.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.04,
                      },
                    },
                  }}
                >
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      layout
                      className={`p-4 transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 relative group ${
                        !notification.isRead
                          ? 'bg-primary-500/[0.04] dark:bg-primary-500/[0.06]'
                          : ''
                      }`}
                    >
                      {/* Ponto indicador de não lida */}
                      {!notification.isRead && (
                        <div className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-primary-500" />
                      )}

                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-xs truncate ${!notification.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-neutral-300'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 dark:text-neutral-500 font-mono shrink-0">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 dark:text-neutral-400 mt-1 leading-relaxed line-clamp-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-end gap-1 mt-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 rounded-lg transition-colors"
                                title="Marcar como lida"
                              >
                                <Check className="w-3 h-3" />
                                <span>Lida</span>
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(notification.id)}
                              className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Rodapé com Ação Rápida */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-gray-100/80 dark:border-neutral-800/80 bg-gray-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-[11px] text-gray-400 dark:text-neutral-500">
                <span>{notifications.length} notificações</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Marcar tudo como lido
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationDropdown
