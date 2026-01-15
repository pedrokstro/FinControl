import { Lock, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PremiumFeatureBlockProps {
  featureName: string
  description?: string
  children?: React.ReactNode
  showOverlay?: boolean
}

const PremiumFeatureBlock = ({ 
  featureName, 
  description, 
  children,
  showOverlay = true 
}: PremiumFeatureBlockProps) => {
  const navigate = useNavigate()

  if (showOverlay) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center p-6 max-w-sm">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {featureName}
            </h3>
            {description && (
              <p className="text-white/90 text-sm mb-4">
                {description}
              </p>
            )}
            <button
              onClick={() => navigate('/plans')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Fazer Upgrade
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => navigate('/plans')}
      disabled
      className="relative w-full px-4 py-2 bg-gray-100 dark:bg-neutral-800 border-2 border-amber-300 dark:border-amber-600 rounded-lg cursor-not-allowed opacity-60"
    >
      <div className="flex items-center justify-center gap-2">
        <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
          {featureName} - Premium
        </span>
      </div>
    </button>
  )
}

export default PremiumFeatureBlock
