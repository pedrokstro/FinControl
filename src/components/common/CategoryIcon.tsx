import { getIcon, getExclusiveImageIcon, type IconName } from '@/utils/iconMapping'
import { Icon as IconifyIcon } from '@iconify/react'

interface CategoryIconProps {
  icon: IconName | string
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

const emojiSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-3xl',
}

const CategoryIcon = ({
  icon,
  color = '#6b7280',
  size = 'md',
  className = '',
}: CategoryIconProps) => {
  // Verificar se é emoji
  const isEmoji = (str: string) => /\p{Emoji}/u.test(str) && str.length <= 4
  const isIconifyIcon = typeof icon === 'string' && icon.includes(':')
  const isExclusiveIcon = typeof icon === 'string' && icon.startsWith('exclusive:')

  // Se for emoji, renderizar como texto
  if (isEmoji(icon as string)) {
    return (
      <span 
        className={`${emojiSizeClasses[size]} ${className}`}
        role="img"
        aria-label="category emoji"
      >
        {icon}
      </span>
    )
  }

  if (isExclusiveIcon) {
    const imgIcon = getExclusiveImageIcon(icon as string)
    if (!imgIcon) return null

    return (
      <img
        src={imgIcon.src}
        alt={imgIcon.label}
        className={`${sizeClasses[size]} ${className} object-contain`}
      />
    )
  }

  if (isIconifyIcon) {
    return (
      <IconifyIcon
        icon={icon as string}
        className={`${sizeClasses[size]} ${className}`}
        style={{ color }}
      />
    )
  }

  // Caso contrário, renderizar ícone Lucide
  const Icon = getIcon(icon as IconName)
  
  return (
    <Icon 
      className={`${sizeClasses[size]} ${className}`}
      style={{ color }}
    />
  )
}

export default CategoryIcon
