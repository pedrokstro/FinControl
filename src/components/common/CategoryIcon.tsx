import { getIcon, type IconName } from '@/utils/iconMapping'

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
  className = '' 
}: CategoryIconProps) => {
  // Verificar se é emoji
  const isEmoji = (str: string) => {
    return /\p{Emoji}/u.test(str) && str.length <= 4
  }

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
