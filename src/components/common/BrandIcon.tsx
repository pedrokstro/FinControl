import React from 'react'

/**
 * Mapa de slugs exatos para brands conhecidos.
 * Garante que os nomes de arquivo com casing diferente (ex: Mastercard.png)
 * sejam encontrados corretamente em servidores Linux (case-sensitive).
 */
const BRAND_SLUG_MAP: Record<string, string> = {
  'Visa':       'visa.png',
  'Mastercard': 'Mastercard.png',
  'Elo':        'elo.png',
  'Hipercard':  'hipercard.png',
  'Amex':       'American_Express.png',
  'Nubank':     'nubank.png',
  'Inter':      'banco-inter.png',
  'Neon':       'banco-neon.png',
  'C6':         'c6-bank.png',
  'PicPay':     'picpay.png',
  'PICPAY':     'picpay.png',
}

/**
 * Converte o nome do banco/bandeira para o slug do arquivo PNG.
 * Verificar o BRAND_SLUG_MAP primeiro; caso não encontrado, normaliza automaticamente.
 * Ex: "PICPAY" → "picpay.png" | "Banco XYZ" → "banco-xyz.png"
 */
export const brandToSlug = (brand: string): string =>
  BRAND_SLUG_MAP[brand] ?? brand.toLowerCase().trim().replace(/\s+/g, '-') + '.png'

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
