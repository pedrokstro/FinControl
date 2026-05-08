import React, { useState, useEffect } from 'react'
import { 
  getLogoDevUrl, 
  getGoogleFaviconUrl, 
  getSimpleIconUrl, 
  brandToSlug 
} from '@/utils/brandUtils'

interface BrandIconProps {
  /** Nome do banco ou marca — será mapeado para domínio automaticamente */
  brand: string
  /** Slug exato do arquivo local (com extensão). Quando passado, ignora a busca automática. */
  slug?: string
  className?: string
}

/**
 * Componente de ícone de bandeira/banco com resolução automática multinível.
 * Fluxo de resolução (Cascata):
 * 1. Arquivo local em /icons/
 * 2. Simple Icons (SVG de alta qualidade para marcas globais)
 * 3. Logo.dev (API Premium via Domínio)
 * 4. Google Favicon (Fallback universal)
 */
const BrandIcon: React.FC<BrandIconProps> = ({ brand, slug, className = 'h-6 w-auto max-w-[48px]' }) => {
  const localSrc = `/icons/${slug ?? brandToSlug(brand)}`
  const simpleSrc = getSimpleIconUrl(brand)
  const logoDevSrc = getLogoDevUrl(brand)
  const googleSrc = getGoogleFaviconUrl(brand)
  
  const [imgSrc, setImgSrc] = useState<string>(localSrc)
  const [stage, setStage] = useState<'local' | 'simple' | 'logodev' | 'google' | 'failed'>('local')

  // Reset state if brand changes
  useEffect(() => {
    setImgSrc(localSrc)
    setStage('local')
  }, [brand, slug, localSrc])

  const handleError = () => {
    if (stage === 'local') {
      if (simpleSrc) {
        setStage('simple')
        setImgSrc(simpleSrc)
      } else if (logoDevSrc) {
        setStage('logodev')
        setImgSrc(logoDevSrc)
      } else if (googleSrc) {
        setStage('google')
        setImgSrc(googleSrc)
      } else {
        setStage('failed')
      }
    } else if (stage === 'simple') {
      if (logoDevSrc) {
        setStage('logodev')
        setImgSrc(logoDevSrc)
      } else if (googleSrc) {
        setStage('google')
        setImgSrc(googleSrc)
      } else {
        setStage('failed')
      }
    } else if (stage === 'logodev') {
      if (googleSrc) {
        setStage('google')
        setImgSrc(googleSrc)
      } else {
        setStage('failed')
      }
    } else {
      setStage('failed')
    }
  }

  if (stage === 'failed') return null

  return (
    <img
      src={imgSrc}
      alt={brand}
      className={`object-contain flex-shrink-0 transition-opacity duration-300 ${className}`}
      onError={handleError}
    />
  )
}

export default BrandIcon
