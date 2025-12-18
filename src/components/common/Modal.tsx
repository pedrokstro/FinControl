import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import clsx from 'clsx'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  size?: ModalSize
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  preventScroll?: boolean
  className?: string
  overlayClassName?: string
  ariaLabel?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const getPortalElement = () => {
  if (typeof document === 'undefined') return null
  let portal = document.getElementById('modal-root')
  if (!portal) {
    portal = document.createElement('div')
    portal.setAttribute('id', 'modal-root')
    document.body.appendChild(portal)
  }
  return portal
}

export const Modal = ({
  open,
  onClose,
  children,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  preventScroll = true,
  className,
  overlayClassName,
  ariaLabel,
}: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const portalElement = getPortalElement()

  useEffect(() => {
    if (!open) return

    previousActiveElement.current = document.activeElement as HTMLElement | null

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        event.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    if (preventScroll) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalOverflow
        document.removeEventListener('keydown', handleKeyDown)
        previousActiveElement.current?.focus?.()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement.current?.focus?.()
    }
  }, [open, closeOnEsc, onClose, preventScroll])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        containerRef.current?.focus()
      })
    }
  }, [open])

  if (!portalElement) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999]">
          <motion.div
            className={clsx(
              'fixed inset-0 bg-black/50 backdrop-blur-[2px]',
              overlayClassName
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlay ? onClose : undefined}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              tabIndex={-1}
              ref={containerRef}
              className={clsx(
                'w-full rounded-2xl bg-white dark:bg-neutral-950 shadow-2xl border border-gray-100 dark:border-neutral-800 focus:outline-none',
                sizeClasses[size],
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(event) => event.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    portalElement
  )
}

interface ModalHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  onClose?: () => void
  hideCloseButton?: boolean
  align?: 'start' | 'center'
}

export const ModalHeader = ({
  title,
  subtitle,
  icon,
  onClose,
  hideCloseButton,
  align = 'start',
}: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 px-6 py-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-primary-600 dark:text-primary-300">
            {icon}
          </div>
        )}
        <div className={clsx('flex flex-col', align === 'center' && 'text-center')}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-none">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {!hideCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export const ModalBody = ({ children, className }: ModalBodyProps) => (
  <div className={clsx('px-6 py-4 space-y-4', className)}>{children}</div>
)

interface ModalFooterProps {
  children: ReactNode
  align?: 'start' | 'center' | 'end' | 'between'
  className?: string
}

export const ModalFooter = ({ children, align = 'end', className }: ModalFooterProps) => {
  const alignment: Record<ModalFooterProps['align'], string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-3 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-white/[0.02] px-6 py-4',
        alignment[align ?? 'end'],
        className
      )}
    >
      {children}
    </div>
  )
}
