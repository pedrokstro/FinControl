import React from 'react'

interface LoadingSkeletonProps {
  variant?: 'card' | 'chart' | 'text' | 'circle' | 'kpi' | 'button' | 'table-row'
  className?: string
  count?: number
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  className = '',
  count = 1
}) => {
  const baseClasses = 'animate-shimmer rounded-xl'

  const variants = {
    card: 'w-full h-32 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50',
    chart: 'w-full h-72 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50',
    text: 'w-full h-4 rounded-md',
    circle: 'rounded-full shrink-0',
    kpi: 'w-full h-28 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50',
    button: 'h-10 w-32 rounded-xl',
    'table-row': 'w-full h-14 rounded-xl border border-neutral-200/30 dark:border-neutral-800/30'
  }

  const items = Array.from({ length: count }, (_, i) => i)

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={`${baseClasses} ${variants[variant]} ${className}`}
        />
      ))}
    </>
  )
}

export default LoadingSkeleton
