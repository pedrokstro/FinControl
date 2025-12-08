import { Wallet } from 'lucide-react'

interface LogoProps {
  className?: string
  iconSize?: number
  textSize?: string
  showText?: boolean
}

export const Logo = ({ 
  className = '', 
  iconSize = 28, 
  textSize = 'text-3xl',
  showText = true 
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
        <Wallet className={`text-primary-600`} size={iconSize} />
      </div>
      {showText && (
        <span className={`${textSize} font-bold text-white`}>FinControl</span>
      )}
    </div>
  )
}

export default Logo
