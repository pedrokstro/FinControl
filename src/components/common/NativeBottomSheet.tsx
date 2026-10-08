import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, PanInfo, type Transition } from 'framer-motion'
import { haptics } from '@/utils/haptics'

export interface NativeBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  hideCloseButton?: boolean
  closeOnBackdrop?: boolean
  contentClassName?: string
  maxHeight?: string
  size?: 'sm' | 'md' | 'lg'
  zIndex?: number
}

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-3xl',
}

const sheetSpringTransition: Transition = {
  type: 'spring',
  damping: 28,
  stiffness: 300,
  mass: 0.8,
}

export const NativeBottomSheet = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnBackdrop = true,
  contentClassName = '',
  maxHeight = 'max-h-[92vh] max-h-[92dvh]',
  size = 'md',
  zIndex = 200,
}: NativeBottomSheetProps) => {
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
      haptics.light()
      onClose()
    }
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 400) {
      haptics.light()
      onClose()
    }
  }

  const sheetContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay Escuro com Fade Suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ zIndex }}
            className="fixed inset-0 bg-black/60"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Wrapper de Posicionamento Fixo */}
          <div
            style={{ zIndex: zIndex + 1 }}
            className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={sheetSpringTransition}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              role="dialog"
              aria-modal="true"
              style={{ willChange: 'transform' }}
              className={`w-full ${sizeClasses[size]} bg-white dark:bg-neutral-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col ${maxHeight} pointer-events-auto border-t sm:border border-gray-100 dark:border-neutral-800 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra de Arraste (Pill Handle para Mobile) */}
              <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 select-none sm:hidden">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full" />
              </div>

              {/* Cabeçalho */}
              {(title || description) && (
                <div className="px-6 py-3.5 border-b border-gray-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 sticky top-0 z-10 flex-shrink-0 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {title && (
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display truncate">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 truncate">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Corpo Rolável */}
              <div className={`px-6 py-5 overflow-y-auto overscroll-contain flex-1 ${contentClassName} custom-scrollbar`}>
                {children}
              </div>

              {/* Rodapé Opcional */}
              {footer && (
                <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-neutral-800/80 bg-gray-50/60 dark:bg-neutral-900/60 flex-shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-5">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(sheetContent, document.body)
}

export default NativeBottomSheet
