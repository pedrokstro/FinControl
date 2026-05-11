import { getIcon, getExclusiveImageIcon, type IconName } from '@/utils/iconMapping'
import { Icon as IconifyIcon } from '@iconify/react'
import BrandIcon from './BrandIcon'

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
  const isEmoji = (str: string) => /\p{Emoji}/u.test(str) && str.length <= 4
  const isIconifyIcon = typeof icon === 'string' && icon.includes(':') && !icon.startsWith('brand:') && !icon.startsWith('exclusive:')
  const isExclusiveIcon = typeof icon === 'string' && icon.startsWith('exclusive:')
  const isBrandIcon = typeof icon === 'string' && icon.startsWith('brand:')

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

  if (isBrandIcon) {
    const brandName = (icon as string).split(':')[1]
    return (
      <BrandIcon
        brand={brandName}
        className={`${sizeClasses[size]} ${className} object-contain`}
      />
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
