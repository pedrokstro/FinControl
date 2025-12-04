interface LoadingSkeletonProps {
  variant?: 'card' | 'chart' | 'text' | 'circle'
  className?: string
  count?: number
}

const LoadingSkeleton = ({ variant = 'card', className = '', count = 1 }: LoadingSkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-neutral-800'

  const variants = {
    card: 'h-32 rounded-xl',
    chart: 'h-64 rounded-xl',
    text: 'h-4 rounded',
    circle: 'rounded-full',
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
