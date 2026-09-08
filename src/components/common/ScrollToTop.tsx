import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

interface ScrollToTopProps {
  threshold?: number
  className?: string
}

export const ScrollToTop = ({ threshold = 220, className = '' }: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('main.overflow-y-auto')
      const containerScroll = scrollContainer ? scrollContainer.scrollTop : 0
      const windowScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0

      if (containerScroll > threshold || windowScroll > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    const scrollContainer = document.querySelector('main.overflow-y-auto')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })

    handleScroll()

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // 1. Rolagem do container interno (Dashboard e Telas com Layout fixo)
    const scrollContainer = document.querySelector('main.overflow-y-auto')
    if (scrollContainer) {
      try {
        scrollContainer.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      } catch {
        scrollContainer.scrollTop = 0
      }
    }

    // 2. Rolagem da janela principal (Landing Page, Termos, Sobre, etc.)
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    } catch {
      window.scrollTo(0, 0)
    }

    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
    if (document.body) {
      document.body.scrollTop = 0
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={handleScrollToTop}
          type="button"
          aria-label="Voltar ao início da página"
          title="Voltar ao início"
          className={`fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 p-3 sm:p-3.5 rounded-full bg-neutral-900/90 text-white dark:bg-white/95 dark:text-neutral-950 shadow-2xl backdrop-blur-md border border-white/20 dark:border-neutral-800/80 hover:scale-110 active:scale-95 transition-all duration-200 group flex items-center justify-center cursor-pointer ${className}`}
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
          <span className="sr-only">Voltar ao início</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop

