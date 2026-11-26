import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  hideSubtitleOnMobile?: boolean
  className?: string
}

const PageHeader = ({
  title,
  subtitle,
  icon,
  actions,
  hideSubtitleOnMobile = false,
  className = '',
}: PageHeaderProps) => {
  return (
    <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${className}`}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-display tracking-[-0.02em] leading-[1.12] text-balance flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </h1>
        {subtitle && (
          <p className={`${hideSubtitleOnMobile ? 'hidden sm:block ' : ''}text-sm text-gray-600 dark:text-neutral-400 mt-1 max-w-[65ch] text-pretty`}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap lg:justify-end">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
