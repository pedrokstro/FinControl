import React from 'react'

/**
 * Mapa de slugs exatos para brands conhecidos.
 * Garante que os nomes de arquivo com casing diferente (ex: Mastercard.png)
 * sejam encontrados corretamente em servidores Linux (case-sensitive).
 */
const BRAND_SLUG_MAP: Record<string, string> = {
  'visa':       'visa.png',
  'mastercard': 'Mastercard.png',
  'elo':        'elo.png',
  'hipercard':  'hipercard.png',
  'amex':       'American_Express.png',
  'american express': 'American_Express.png',
  'nubank':     'nubank.png',
  'inter':      'banco-inter.png',
  'neon':       'banco-neon.png',
  'c6':         'c6-bank.png',
  'c6 bank':    'c6-bank.png',
  'picpay':     'picpay.png',
}

/**
 * Converte o nome do banco/bandeira para o slug do arquivo PNG.
 * Verificar o BRAND_SLUG_MAP primeiro (case-insensitive); caso não encontrado, normaliza automaticamente.
 */
export const brandToSlug = (brand: string): string => {
  const normalized = brand.toLowerCase().trim()
  return BRAND_SLUG_MAP[normalized] ?? normalized.replace(/\s+/g, '-') + '.png'
}

interface BrandIconProps {
  /** Nome do banco — mapeado via BRAND_SLUG_MAP ou convertido automaticamente */
  brand: string
  /** Slug exato do arquivo (com extensão). Quando passado, ignora o brandToSlug. */
  slug?: string
  className?: string
}

/**
 * Componente de ícone de bandeira/banco.
 * Resolve o arquivo correto via BRAND_SLUG_MAP → brandToSlug → slug prop.
 * Se o arquivo não existir, esconde silenciosamente via onError.
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
