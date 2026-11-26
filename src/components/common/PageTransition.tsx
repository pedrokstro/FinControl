import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
  delay?: number
  className?: string
}

const PageTransition = ({ children, delay = 0, className = 'w-full h-full' }: PageTransitionProps) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{
        duration: shouldReduceMotion ? 0.14 : 0.22,
        ease: [0.23, 1, 0.32, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
