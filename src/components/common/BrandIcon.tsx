import React from 'react'

/**
 * Converte o nome do banco/bandeira para o slug do arquivo PNG.
 * Ex: "PICPAY" → "picpay.png" | "C6 Bank" → "c6-bank.png"
 */
export const brandToSlug = (brand: string): string =>
  brand.toLowerCase().trim().replace(/\s+/g, '-') + '.png'

interface BrandIconProps {
  /** Nome do banco — será convertido para slug automaticamente via brandToSlug */
  brand: string
  /** Slug exato do arquivo (com extensão). Quando passado, ignora o brandToSlug. */
  slug?: string
  className?: string
}

/**
 * Componente de ícone de bandeira/banco.
 * Tenta carregar /icons/<slug>.png automaticamente.
 * Se não encontrar, esconde o <img> silenciosamente via onError.
 *
 * Regras:
 *   - Passa `slug` para usar o nome exato do arquivo: slug="American_Express.png"
 *   - Ou passa só `brand` para conversão automática: brand="picpay" → "picpay.png"
 */
const BrandIcon: React.FC<BrandIconProps> = ({ brand, slug, className = 'h-6 w-auto max-w-[48px]' }) => {
  const filename = slug ?? brandToSlug(brand)
  return (
    <img
      src={`/icons/${filename}`}
      alt={brand}
      className={`object-contain flex-shrink-0 ${className}`}
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement
        img.style.display = 'none'
      }}
    />
  )
}

export default BrandIcon
