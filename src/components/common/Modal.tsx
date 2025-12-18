import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
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

const Modal = ({
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
          />

          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              className={`w-full ${sizeClasses[size]} bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh]`}
            >
              {(title || !hideCloseButton) && (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-900 flex items-start justify-between gap-3">
                  <div>
                    {title && (
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                  {!hideCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      aria-label="Fechar modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              <div className={`px-6 py-5 overflow-y-auto flex-1 ${contentClassName}`}>
                {children}
              </div>

              {footer && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-neutral-900 bg-gray-50/70 dark:bg-neutral-900/60">
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
