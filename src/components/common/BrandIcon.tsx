import React, { useState, useEffect } from 'react'
import { 
  getLogoDevUrl, 
  getGoogleFaviconUrl, 
  getSimpleIconUrl, 
  brandToSlug,
  isLocalBrand
} from '@/utils/brandUtils'
import { Globe } from 'lucide-react'

interface BrandIconProps {
  brand: string
  slug?: string
  className?: string
}

type Stage = 'local' | 'simple' | 'logodev' | 'google' | 'failed';

const BrandIcon: React.FC<BrandIconProps> = ({ brand, slug, className = 'h-6 w-auto max-w-[48px]' }) => {
  const [stage, setStage] = useState<Stage>('local')
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = () => {
      setIsLoading(true)
      
      // 1. Check local first IF it's in our map or explicitly requested via slug
      if (slug || isLocalBrand(brand)) {
        setStage('local')
        setImgSrc(`/icons/${slug ?? brandToSlug(brand)}`)
        return
      }

      // 2. Simple Icons
      const simple = getSimpleIconUrl(brand)
      if (simple) {
        setStage('simple')
        setImgSrc(simple)
        return
      }

      // 3. Logo.dev
      const logoDev = getLogoDevUrl(brand)
      if (logoDev) {
        setStage('logodev')
        setImgSrc(logoDev)
        return
      }

      // 4. Google Favicon (fallback final)
      const google = getGoogleFaviconUrl(brand)
      if (google) {
        setStage('google')
        setImgSrc(google)
        return
      }

      setStage('failed')
      setIsLoading(false)
    }

    init()
  }, [brand, slug])

  const handleError = () => {
    // Cascata de erros
    if (stage === 'local') {
      const next = getSimpleIconUrl(brand) || getLogoDevUrl(brand) || getGoogleFaviconUrl(brand)
      if (next === getSimpleIconUrl(brand)) setStage('simple')
      else if (next === getLogoDevUrl(brand)) setStage('logodev')
      else if (next === getGoogleFaviconUrl(brand)) setStage('google')
      else setStage('failed')
      
      setImgSrc(next)
    } else if (stage === 'simple') {
      const next = getLogoDevUrl(brand) || getGoogleFaviconUrl(brand)
      if (next === getLogoDevUrl(brand)) setStage('logodev')
      else if (next === getGoogleFaviconUrl(brand)) setStage('google')
      else setStage('failed')
      
      setImgSrc(next)
    } else if (stage === 'logodev') {
      const next = getGoogleFaviconUrl(brand)
      if (next) setStage('google')
      else setStage('failed')
      
      setImgSrc(next)
    } else {
      setStage('failed')
      setIsLoading(false)
    }
  }

  if (stage === 'failed') {
    return <Globe className={`text-gray-300 ${className}`} />
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-100 dark:bg-neutral-800 rounded" />
      )}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={brand}
          className={`object-contain flex-shrink-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      )}
    </div>
  )
}

export default BrandIcon
