import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedPageProps {
  children: ReactNode
  direction?: 'left' | 'right'
}

const AnimatedPage = ({ children, direction = 'right' }: AnimatedPageProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction === 'right' ? 15 : -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: direction === 'right' ? -15 : 15,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}

export default AnimatedPage
