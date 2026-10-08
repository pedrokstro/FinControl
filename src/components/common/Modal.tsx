import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { useIsMobile } from '@/hooks'
import NativeBottomSheet from './NativeBottomSheet'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  hideCloseButton?: boolean
  closeOnBackdrop?: boolean
  contentClassName?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
}

/**
 * Modal Unificado FinControl:
 * - Em dispositivos móveis (isMobile): Renderiza automaticamente o NativeBottomSheet
 *   com gesto fluido pull-to-close, GPU transform e sem oscilações visuais.
 * - Em desktop: Renderiza o modal centralizado elegante com backdrop blur e tecla Esc.
 */
const Modal = (props: ModalProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <NativeBottomSheet {...props} />
  }

  return <DesktopModal {...props} />
}

const DesktopModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideCloseButton = false,
  closeOnBackdrop = true,
  contentClassName = '',
}: ModalProps) => {
  const [mounted, setMounted] = useState(() => typeof window !== 'undefined')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    haptics.light()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose()
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={handleBackdropClick}
          />

          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              className={`w-full ${sizeClasses[size]} bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] pointer-events-auto overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || !hideCloseButton) && (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-10 flex-shrink-0">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      {title && (
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                    {!hideCloseButton && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
                        aria-label="Fechar modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className={`px-6 py-6 overflow-y-auto flex-1 ${contentClassName} custom-scrollbar`}>
                {children}
              </div>

              {footer && (
                <div className="px-6 py-4 sm:py-5 border-t border-gray-100 dark:border-neutral-800/50 bg-white dark:bg-neutral-950 sticky bottom-0 z-10 mt-auto">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default Modal
