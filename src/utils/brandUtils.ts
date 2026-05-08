/**
 * Utility to map common bank and brand names to their official domains.
 * This is used to fetch high-quality logos from services like Logo.dev.
 */

const BRAND_DOMAIN_MAP: Record<string, string> = {
    // Brazilian Banks
    'nubank': 'nubank.com.br',
    'itau': 'itau.com.br',
    'itaú': 'itau.com.br',
    'bradesco': 'bradesco.com.br',
    'santander': 'santander.com.br',
    'banco do brasil': 'bb.com.br',
    'caixa': 'caixa.gov.br',
    'inter': 'bancointer.com.br',
    'banco inter': 'bancointer.com.br',
    'neon': 'neon.com.br',
    'c6': 'c6bank.com.br',
    'c6 bank': 'c6bank.com.br',
    'btg': 'btgpactual.com',
    'btg pactual': 'btgpactual.com',
    'xp': 'xpi.com.br',
    'xp investimentos': 'xpi.com.br',
    'digio': 'digio.com.br',
    'next': 'next.me',
    'picpay': 'picpay.com',
    'pagbank': 'pagseguro.uol.com.br',
    'pagseguro': 'pagseguro.uol.com.br',
    'mercadopago': 'mercadopago.com.br',
    'mercado pago': 'mercadopago.com.br',
    'safra': 'safra.com.br',
    'original': 'original.com.br',
    'banrisul': 'banrisul.com.br',
    
    // Cards & Brands
    'visa': 'visa.com',
    'mastercard': 'mastercard.com',
    'master': 'mastercard.com',
    'amex': 'americanexpress.com',
    'american express': 'americanexpress.com',
    'elo': 'elo.com.br',
    'hipercard': 'hipercard.com.br',
    'diners': 'dinersclub.com',
    'discover': 'discover.com',
    'jcb': 'jcb.co.jp',
};

/**
 * Mapa de slugs exatos para arquivos locais.
 */
const BRAND_SLUG_MAP: Record<string, string> = {
    'visa': 'visa.png',
    'mastercard': 'Mastercard.png',
    'elo': 'elo.png',
    'hipercard': 'hipercard.png',
    'amex': 'American_Express.png',
    'american express': 'American_Express.png',
    'nubank': 'nubank.png',
    'inter': 'banco-inter.png',
    'neon': 'banco-neon.png',
    'c6': 'c6-bank.png',
    'c6 bank': 'c6-bank.png',
    'picpay': 'picpay.png',
};

/**
 * Converte o nome do banco/bandeira para o slug do arquivo PNG local.
 */
export const brandToSlug = (brand: string): string => {
    const normalized = brand.toLowerCase().trim();
    return BRAND_SLUG_MAP[normalized] ?? normalized.replace(/\s+/g, '-') + '.png';
};

/**
 * Resolves a brand name to its most likely domain.
 */
export const resolveDomain = (brandName: string): string | null => {
    const normalized = brandName.toLowerCase().trim();
    
    // Check our curated map first
    if (BRAND_DOMAIN_MAP[normalized]) {
        return BRAND_DOMAIN_MAP[normalized];
    }
    
    // If it looks like a domain already, return it
    if (normalized.includes('.') && !normalized.includes(' ')) {
        return normalized;
    }
    
    return null;
};

/**
 * Generates the Logo.dev URL for a given brand name.
 */
export const getLogoDevUrl = (brandName: string): string | null => {
    const domain = resolveDomain(brandName);
    if (!domain) return null;
    
    const token = import.meta.env.VITE_LOGO_DEV_TOKEN;
    if (!token) return null;
    
    return `https://img.logo.dev/${domain}?token=${token}`;
};

/**
 * Generates the Google Favicon URL for a given brand name.
 */
export const getGoogleFaviconUrl = (brandName: string): string | null => {
    const domain = resolveDomain(brandName);
    if (!domain) return null;
    
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

/**
 * Generates a Simple Icons URL for common brands (SVG).
 */
export const getSimpleIconUrl = (brandName: string): string | null => {
    const brands = ['visa', 'mastercard', 'americanexpress', 'nubank', 'itau', 'santander', 'mercadopago', 'picpay'];
    const normalized = brandName.toLowerCase().replace(/\s+/g, '');
    
    if (brands.includes(normalized)) {
        return `https://cdn.simpleicons.org/${normalized}`;
    }
    
    return null;
};
