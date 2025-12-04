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
        x: direction === 'right' ? 100 : -100,
        scale: 0.95,
        filter: 'blur(10px)',
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        x: direction === 'right' ? -100 : 100,
        scale: 0.95,
        filter: 'blur(10px)',
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom easeInOut curve
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}

export default AnimatedPage
