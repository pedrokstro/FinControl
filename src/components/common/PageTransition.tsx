import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
  delay?: number
}

const PageTransition = ({ children, delay = 0.1 }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        duration: 0.35, 
        ease: [0.25, 0.1, 0.25, 1], // easeOutCubic
        delay: delay 
      }}
      className="w-full h-full will-change-transform"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
