import { useState, useEffect, useRef } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

/**
 * Componente de imagem otimizada com:
 * - Lazy loading nativo
 * - Placeholder blur
 * - Error handling
 * - Performance otimizada
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Se a imagem já está em cache, marcar como carregada
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 dark:bg-neutral-700 ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 dark:text-neutral-500 text-sm">
          Imagem não disponível
        </span>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Placeholder blur enquanto carrega */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-200 dark:bg-neutral-700 animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      
      {/* Imagem otimizada */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

export default OptimizedImage
