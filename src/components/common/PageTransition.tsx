import { useState, useEffect, ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  delay?: number
}

const PageTransition = ({ children, delay = 100 }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

export default PageTransition
