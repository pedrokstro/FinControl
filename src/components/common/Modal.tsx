import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'
import { haptics } from '@/utils/haptics'

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
  const dragControls = useDragControls()

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
          />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 400) {
                  onClose()
                }
              }}
              className={`w-full ${sizeClasses[size]} bg-white dark:bg-neutral-950 border-t sm:border border-transparent dark:border-neutral-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[92vh] pointer-events-auto overflow-hidden`}
            >
              {(title || !hideCloseButton) && (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-10 flex-shrink-0">
                  {/* Drag Indicator para Mobile */}
                  <div
                    className="sm:hidden py-4 -mt-4 mb-2 w-full flex justify-center cursor-grab active:cursor-grabbing touch-none"
                    onPointerDown={(e) => dragControls.start(e)}
                  >
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full" />
                  </div>

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
