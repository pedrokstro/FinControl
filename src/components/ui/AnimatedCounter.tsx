import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  formatter?: (val: number) => string
}

export const AnimatedCounter = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  className = '',
  formatter,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, {
    damping: 28,
    stiffness: 120,
    mass: 0.8,
  })

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    if (shouldReduceMotion) {
      if (ref.current) {
        if (formatter) {
          ref.current.textContent = `${prefix}${formatter(value)}${suffix}`
        } else {
          ref.current.textContent = `${prefix}${value.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`
        }
      }
      return
    }

    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const formatted = formatter
          ? formatter(latest)
          : latest.toLocaleString('pt-BR', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
        ref.current.textContent = `${prefix}${formatted}${suffix}`
      }
    })

    return () => unsubscribe()
  }, [springValue, value, decimals, prefix, suffix, formatter, shouldReduceMotion])

  const initialDisplay = formatter
    ? formatter(value)
    : value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })

  return (
    <span ref={ref} className={className}>
      {prefix}{initialDisplay}{suffix}
    </span>
  )
}

export default AnimatedCounter
