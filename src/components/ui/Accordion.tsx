import React, { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { haptics } from '@/utils/haptics'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
  variant?: 'default' | 'bordered' | 'card' | 'ghost'
}

const AccordionContext = createContext<AccordionContextType | null>(null)

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  collapsible?: boolean
  variant?: 'default' | 'bordered' | 'card' | 'ghost'
  children: React.ReactNode
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  collapsible = true,
  variant = 'default',
  children,
  className = '',
}) => {
  const [internalState, setInternalState] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }
    return []
  })

  const openItems = controlledValue !== undefined
    ? (Array.isArray(controlledValue) ? controlledValue : controlledValue ? [controlledValue] : [])
    : internalState

  const toggleItem = (val: string) => {
    haptics.light()
    let newItems: string[]

    if (type === 'single') {
      if (openItems.includes(val)) {
        newItems = collapsible ? [] : openItems
      } else {
        newItems = [val]
      }
    } else {
      if (openItems.includes(val)) {
        newItems = openItems.filter((item) => item !== val)
      } else {
        newItems = [...openItems, val]
      }
    }

    if (controlledValue === undefined) {
      setInternalState(newItems)
    }

    if (onValueChange) {
      onValueChange(type === 'single' ? (newItems[0] || '') : newItems)
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, variant }}>
      <div className={`w-full space-y-3 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextType {
  value: string
  isOpen: boolean
}

const AccordionItemContext = createContext<AccordionItemContextType | null>(null)

export interface AccordionItemProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  disabled = false,
  className = '',
  children,
}) => {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('AccordionItem must be used within an Accordion')

  const isOpen = context.openItems.includes(value)

  const variantStyles = {
    default: 'border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3',
    bordered: 'border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm',
    card: 'border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-5 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow',
    ghost: 'p-2 rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50',
  }[context.variant || 'default']

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        className={`w-full transition-all duration-200 ${variantStyles} ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        } ${className}`}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export interface AccordionTriggerProps {
  children: React.ReactNode
  icon?: React.ReactNode
  badge?: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
  chevron?: boolean
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  icon,
  badge,
  subtitle,
  className = '',
  chevron = true,
}) => {
  const accordionContext = useContext(AccordionContext)
  const itemContext = useContext(AccordionItemContext)

  if (!accordionContext || !itemContext) {
    throw new Error('AccordionTrigger must be used within an AccordionItem')
  }

  const { isOpen, value } = itemContext
  const { toggleItem } = accordionContext

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={`w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none transition-colors ${className}`}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-4">
        {icon && (
          <div className="shrink-0 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {children}
            </span>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {chevron && (
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800/80 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/40 text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-center transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      )}
    </button>
  )
}

export interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
}) => {
  const itemContext = useContext(AccordionItemContext)
  if (!itemContext) {
    throw new Error('AccordionContent must be used within an AccordionItem')
  }

  const { isOpen } = itemContext

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
              opacity: { duration: 0.22, delay: 0.05 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] },
              opacity: { duration: 0.15 },
            },
          }}
          className="overflow-hidden"
        >
          <div className={`pt-3 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed ${className}`}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Accordion
