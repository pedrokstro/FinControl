/**
 * Utility to map common bank and brand names to their official domains.
 * This is used to fetch high-quality logos from services like Logo.dev.
 */

const BRAND_DOMAIN_MAP: Record<string, string> = {
    // Brazilian Banks & Finance
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
    
    // Services & Tech
    'netflix': 'netflix.com',
    'spotify': 'spotify.com',
    'amazon': 'amazon.com',
    'apple': 'apple.com',
    'google': 'google.com',
    'disney': 'disneyplus.com',
    'disney+': 'disneyplus.com',
    'hbo max': 'hbomax.com',
    'hbomax': 'hbomax.com',
    'globoplay': 'globoplay.globo.com',
    'youtube': 'youtube.com',
    'uber': 'uber.com',
    'ifood': 'ifood.com.br',
    '99app': '99app.com',
    'mercado livre': 'mercadolivre.com.br',
    'airbnb': 'airbnb.com',
    'playstation': 'playstation.com',
    'xbox': 'xbox.com',
    'steam': 'steampowered.com',
    'adobe': 'adobe.com',
    'canva': 'canva.com',
    'office 365': 'office.com',
    'microsoft': 'microsoft.com',
    
    // Telecom & Utilities
    'claro': 'claro.com.br',
    'vivo': 'vivo.com.br',
    'tim': 'tim.com.br',
    'oi': 'oi.com.br',
    'enel': 'enel.com.br',
    'sabesp': 'sabesp.com.br',
    'comgas': 'comgas.com.br',
    'sem parar': 'semparar.com.br',
    'veloe': 'veloe.com.br',
    
    // Fuel & Retail
    'shell': 'shell.com',
    'ipiranga': 'ipiranga.com.br',
    'petrobras': 'petrobras.com.br',
    'carrefour': 'carrefour.com.br',
    'extra': 'extra.com.br',
    'pão de açúcar': 'paodeacucar.com',
    'assai': 'assai.com.br',
    'assaí': 'assai.com.br',
    'atacadao': 'atacadao.com.br',
    'atacadão': 'atacadao.com.br',
    'gpa': 'gpabr.com',
    'smartfit': 'smartfit.com.br',
    'bluefit': 'bluefit.com.br',
    'nike': 'nike.com',
    'adidas': 'adidas.com',
    'zara': 'zara.com',
    'h&m': 'hm.com',
    'shein': 'shein.com',
    'shopee': 'shopee.com.br',
    'aliexpress': 'aliexpress.com',
    'amazon prime': 'amazon.com',
    
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
 * Verifica se a marca tem um ícone local definido.
 */
export const isLocalBrand = (brand: string): boolean => {
    const normalized = brand.toLowerCase().trim();
    return !!BRAND_SLUG_MAP[normalized];
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
    
    // Heuristic: try common suffixes if not in map
    if (normalized.length > 2) {
        // If it's a common Brazilian service name, .com.br is likely
        return `${normalized.replace(/\s+/g, '')}.com.br`;
    }
    
    return null;
};

/**
 * Generates the Logo.dev URL for a given brand name.
 */
export const getLogoDevUrl = (brandName: string): string | null => {
    const domain = resolveDomain(brandName);
    if (!domain) return null;
    
    // We use a public token or a fallback if not provided
    const token = import.meta.env.VITE_LOGO_DEV_TOKEN;
    if (!token) {
        // If no token, we fallback to Google which is more reliable for free
        return null;
    }
    
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
    const brands = [
        'visa', 'mastercard', 'americanexpress', 'nubank', 'itau', 'santander', 
        'mercadopago', 'picpay', 'netflix', 'spotify', 'amazon', 'apple', 
        'google', 'disneyplus', 'youtube', 'uber', 'ifood', 'airbnb', 
        'playstation', 'xbox', 'steam', 'adobe', 'canva', 'microsoft'
    ];
    const normalized = brandName.toLowerCase().replace(/\s+/g, '');
    
    if (brands.includes(normalized)) {
        return `https://cdn.simpleicons.org/${normalized}`;
    }
    
    return null;
};
