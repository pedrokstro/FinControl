import {
  // Income Icons - Financial
  DollarSign,
  Briefcase,
  TrendingUp,
  Gift,
  PiggyBank,
  Wallet,
  BadgeDollarSign,
  Coins,
  Banknote,
  
  // Income Icons - Work & Business (NOVOS)
  Building2,
  Award,
  Trophy,
  Target,
  Rocket,
  LineChart,
  BarChart3,
  Percent,
  Calculator,
  
  // Income Icons - Investments & Assets (NOVOS)
  TrendingDown,
  CircleDollarSign,
  Landmark,
  ArrowUpCircle,
  CandlestickChart,
  CreditCard as PaymentIcon,
  
  // Income Icons - Side Income & Freelance (NOVOS)
  Lightbulb,
  Sparkles as Sparkle,
  Star,
  Crown,
  Gem,
  Medal,
  
  // Income Icons - Passive Income (NOVOS)
  Home as HomeIncome,
  Key,
  Store,
  ShoppingBasket,
  
  // Expense Icons - Food & Dining
  UtensilsCrossed,
  Coffee,
  Pizza,
  Wine,
  IceCream2 as IceCream,
  Apple,
  
  // Expense Icons - Transportation
  Car,
  Bus,
  Bike,
  Plane,
  Train,
  Fuel,
  
  // Expense Icons - Housing
  Home,
  Building,
  Lamp,
  Droplets,
  Zap,
  Hammer,
  
  // Expense Icons - Entertainment & Leisure
  Gamepad2,
  Film,
  Music,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Watch,
  Ticket,
  Palmtree,
  
  // Expense Icons - Health & Wellness
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Dumbbell,
  Smile,
  
  // Expense Icons - Education & Work
  GraduationCap,
  BookOpen,
  Laptop,
  Pencil,
  FileText,
  
  // Expense Icons - Bills & Services
  Smartphone,
  Wifi,
  CreditCard,
  Receipt,
  FileCheck,
  
  // Expense Icons - Personal Care
  Scissors,
  Sparkles,
  
  // Expense Icons - Pets
  Dog,
  Cat,
  
  // Expense Icons - Other
  Package,
  MapPin,
  Users,
  Baby,
  Cigarette,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'
import { forwardRef } from 'react'

const exclusiveIconModules = import.meta.glob('../assets/icons/exclusive/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const friendlyExclusiveLabels: Record<string, string> = {
  // Transporte
  'carrinho-de-compras': 'Carrinho Luxo',
  carrinho: 'Carrinho Neon',
  carro: 'Carro Executivo',
  'carro-novo': 'Carro Novo',
  aviao: 'Avião Prime',
  aviao1: 'Voo Executivo',
  'caminhao-de-entrega': 'Entrega VIP',
  'entrega-rapida': 'Entrega Rápida',
  
  // Finanças
  'cartao-de-credito': 'Cartão Black',
  dinheiro: 'Notas Premium',
  emprestimo: 'Carteira de Empréstimo',
  'real-brasileiro': 'Real Brasileiro',
  'bitcoin-seeklogo': 'Bitcoin',
  
  // Casa & Utilidades
  casa: 'Casa Moderna',
  mansao: 'Mansão Luxo',
  'energia-eletrica': 'Energia Elétrica',
  'painel-solar': 'Painel Solar',
  'painel-solar1': 'Energia Solar',
  'sinal-wifi': 'Conexão Premium',
  gotas: 'Serviços de Água',
  goticula: 'Consumo Sustentável',
  
  // Saúde & Educação
  'cruz-vermelha': 'Saúde Solidária',
  drogas: 'Medicamentos Premium',
  saude: 'Saúde Premium',
  educacao: 'Educação Plus',
  educacao1: 'Pós-graduação',
  
  // Fitness
  dumbell: 'Treino Pesado',
  energico: 'Modo Energia',
  halterofilista: 'Performance Elite',
  
  // Entretenimento & Streaming
  netflix: 'Netflix',
  netflix1: 'Netflix Plus',
  spotify: 'Spotify',
  spotifi: 'Spotifi',
  'icons8-amazon-prime-video-240': 'Prime Video',
  'vecteezy_youtube-logo-png-youtube-icon-transparent_18930572': 'YouTube Premium',
  'notas-musicais': 'Notas Musicais',
  
  // E-commerce & Produtividade
  'mercadolivreicon': 'Mercado Livre',
  'shopee-icon-symbol_28766370': 'Shopee',
  'microsoft-365-2022-seeklogo': 'Microsoft 365',
  'microsoft-365-copilot-seeklogo': 'Microsoft Copilot',
  
  // Outros
  capacete: 'Segurança Industrial',
  'globo-terrestre': 'Expansão Global',
  mulheres: 'Rede Feminina',
}

const slugifyExclusiveIcon = (fileName: string) => {
  const normalized = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase()

  return normalized || fileName.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase()
}

const labelizeExclusiveIcon = (fileName: string) => {
  const parts = fileName.split(/[-_]/).filter(Boolean)
  if (!parts.length) return 'Ícone Exclusivo'
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const makeCustomIcon = (displayName: string, svg: (props: LucideProps, ref: React.Ref<SVGSVGElement>) => JSX.Element) => {
  const Component = forwardRef<SVGSVGElement, LucideProps>((props, ref) => svg(props, ref))
  Component.displayName = displayName
  return Component as unknown as LucideIcon
}

const AuroraCardIcon = makeCustomIcon('AuroraCardIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="aurora-gradient" x1="5" y1="8" x2="43" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C3AED" />
        <stop offset="0.5" stopColor="#EC4899" />
        <stop offset="1" stopColor="#F97316" />
      </linearGradient>
    </defs>
    <rect x="5" y="10" width="38" height="26" rx="8" fill="url(#aurora-gradient)" />
    <rect x="9" y="18" width="30" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
    <rect x="28" y="26" width="10" height="6" rx="2" fill="white" fillOpacity="0.65" />
    <circle cx="15" cy="27" r="4" stroke="white" strokeOpacity="0.65" strokeWidth="2" />
    <circle cx="33" cy="15" r="3" fill="white" fillOpacity="0.45" />
  </svg>
))

const CrystalCoinIcon = makeCustomIcon('CrystalCoinIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="crystal-coin" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) scale(20)">
        <stop offset="0" stopColor="#FEF3C7" />
        <stop offset="0.5" stopColor="#FDE68A" />
        <stop offset="1" stopColor="#F59E0B" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="18" fill="url(#crystal-coin)" />
    <circle cx="24" cy="24" r="15" stroke="white" strokeOpacity="0.45" strokeWidth="2" />
    <path
      d="M24 14c-4 0-7 2.2-7 5.5 0 2.9 2.4 4.6 5.3 5l-.3 5.5h3.8L25.5 25c3-.4 5.7-2.4 5.7-5.5 0-3.3-3.4-5.5-7.2-5.5Zm.1 3c2.3 0 3.6.9 3.6 2.4 0 1.4-1.3 2.3-3.6 2.3s-3.7-.9-3.7-2.3c0-1.4 1.4-2.4 3.7-2.4Z"
      fill="#B45309"
      fillOpacity="0.85"
    />
  </svg>
))

const SunsetFlightIcon = makeCustomIcon('SunsetFlightIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="sunset-flight" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="0.5" stopColor="#FB7185" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="18" fill="url(#sunset-flight)" />
    <path
      d="M14 24h8l8.5-11c.3-.4.9-.5 1.3-.2.4.3.5.9.2 1.3L24 24h8l5.4 5.4c.6.6.2 1.6-.7 1.6H14l-3.5-4.2c-.6-.7-.1-1.8.9-1.8Z"
      fill="white"
      fillOpacity="0.85"
    />
    <path d="M15 30h18" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
  </svg>
))

const NeonGroceriesIcon = makeCustomIcon('NeonGroceriesIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="neon-groceries" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="0.5" stopColor="#10B981" />
        <stop offset="1" stopColor="#0EA5E9" />
      </linearGradient>
    </defs>
    <rect x="12" y="12" width="24" height="26" rx="6" fill="url(#neon-groceries)" />
    <path d="M18 12c0-3 2.2-5 6-5s6 2 6 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 21h12" stroke="white" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 26h12" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 31h8" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
  </svg>
))

const LuminaSafeIcon = makeCustomIcon('LuminaSafeIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="lumina-safe" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="0.5" stopColor="#6366F1" />
        <stop offset="1" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <rect x="10" y="12" width="28" height="24" rx="4" fill="url(#lumina-safe)" />
    <rect x="14" y="16" width="20" height="16" rx="3" stroke="white" strokeOpacity="0.6" strokeWidth="2" />
    <circle cx="24" cy="24" r="5" stroke="white" strokeWidth="2" strokeOpacity="0.9" />
    <circle cx="24" cy="24" r="2" fill="white" fillOpacity="0.9" />
    <path d="M24 19v2.5M24 26.5V29M19 24h2.5M26.5 24H29" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
))

const GalaxyBonusIcon = makeCustomIcon('GalaxyBonusIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="galaxy-bonus" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) scale(22)">
        <stop offset="0" stopColor="#FDE68A" />
        <stop offset="0.5" stopColor="#F97316" />
        <stop offset="1" stopColor="#DB2777" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="20" fill="url(#galaxy-bonus)" />
    <path d="M24 15l2.6 5.8 6.3.7-4.6 4.3 1.1 6.2-5.4-3.1-5.4 3.1 1.1-6.2-4.6-4.3 6.3-.7L24 15Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="24" cy="24" r="3" fill="white" fillOpacity="0.9" />
  </svg>
))

const SapphireTravelIcon = makeCustomIcon('SapphireTravelIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="sapphire-travel" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" />
        <stop offset="0.5" stopColor="#2563EB" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    <rect x="12" y="14" width="24" height="22" rx="6" fill="url(#sapphire-travel)" />
    <path d="M18 14v-2c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <rect x="17" y="20" width="14" height="10" rx="3" stroke="white" strokeWidth="2" />
    <circle cx="19.5" cy="31.5" r="2.5" fill="white" fillOpacity="0.85" />
    <circle cx="28.5" cy="31.5" r="2.5" fill="white" fillOpacity="0.85" />
  </svg>
))

const VelvetDiningIcon = makeCustomIcon('VelvetDiningIcon', ({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="velvet-dining" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB7185" />
        <stop offset="0.5" stopColor="#EC4899" />
        <stop offset="1" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M12 30c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="url(#velvet-dining)" strokeWidth="3" strokeLinecap="round" />
    <path d="M16 30h16" stroke="white" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" />
    <rect x="13" y="30" width="22" height="7" rx="3" fill="url(#velvet-dining)" />
    <path d="M24 18v-4" stroke="url(#velvet-dining)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="12" r="3" fill="url(#velvet-dining)" />
  </svg>
))

type ExclusiveImageIcon = { name: string; label: string; src: string }

export const exclusiveImageIcons: readonly ExclusiveImageIcon[] = Object.entries(exclusiveIconModules)
  .map(([path, src]) => {
    const fileNameWithExt = path.split('/').pop() ?? ''
    const fileName = fileNameWithExt.replace(/\.png$/i, '')
    const slug = slugifyExclusiveIcon(fileName)
    const label = friendlyExclusiveLabels[slug] ?? labelizeExclusiveIcon(fileName)

    return {
      name: `exclusive:${slug}`,
      label,
      src,
    }
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))

const exclusiveImageIconMap = exclusiveImageIcons.reduce<Record<string, ExclusiveImageIcon>>((acc, icon) => {
  acc[icon.name] = icon
  return acc
}, {})

export const getExclusiveImageIcon = (name: string) => exclusiveImageIconMap[name]

export type IconName = 
  // Income - Financial
  | 'DollarSign' | 'Briefcase' | 'TrendingUp' | 'Gift' | 'PiggyBank' 
  | 'Wallet' | 'BadgeDollarSign' | 'Coins' | 'Banknote'
  // Income - Work & Business
  | 'Building2' | 'Award' | 'Trophy' | 'Target' | 'Rocket' 
  | 'LineChart' | 'BarChart3' | 'Percent' | 'Calculator'
  // Income - Investments
  | 'TrendingDown' | 'CircleDollarSign' | 'Landmark' | 'ArrowUpCircle'
  | 'CandlestickChart' | 'PaymentIcon'
  // Income - Side Income
  | 'Lightbulb' | 'Sparkle' | 'Star' | 'Crown' | 'Gem' | 'Medal'
  // Income - Passive Income
  | 'HomeIncome' | 'Key' | 'Store' | 'ShoppingBasket'
  // Food & Dining
  | 'UtensilsCrossed' | 'Coffee' | 'Pizza' | 'Wine' | 'IceCream' | 'Apple'
  // Transportation
  | 'Car' | 'Bus' | 'Bike' | 'Plane' | 'Train' | 'Fuel'
  // Housing
  | 'Home' | 'Building' | 'Lamp' | 'Droplets' | 'Zap' | 'Hammer'
  // Entertainment
  | 'Gamepad2' | 'Film' | 'Music' | 'ShoppingBag' | 'ShoppingCart' 
  | 'Shirt' | 'Watch' | 'Ticket' | 'Palmtree'
  // Health
  | 'Heart' | 'Activity' | 'Stethoscope' | 'Pill' | 'Dumbbell' | 'Smile'
  // Education
  | 'GraduationCap' | 'BookOpen' | 'Laptop' | 'Pencil' | 'FileText'
  // Bills
  | 'Smartphone' | 'Wifi' | 'CreditCard' | 'Receipt' | 'FileCheck'
  // Personal
  | 'Scissors' | 'Sparkles'
  // Pets
  | 'Dog' | 'Cat'
  // Other
  | 'Package' | 'MapPin' | 'Users' | 'Baby' | 'Cigarette'
  // Exclusive realistic icons
  | 'AuroraCardIcon' | 'CrystalCoinIcon' | 'SunsetFlightIcon' | 'NeonGroceriesIcon'
  | 'LuminaSafeIcon' | 'GalaxyBonusIcon' | 'SapphireTravelIcon' | 'VelvetDiningIcon'

export type IconCategoryItem = {
  name: IconName | string
  label: string
}

export const iconMap: Record<IconName, LucideIcon> = {
  // Income Icons - Financial
  DollarSign,
  Briefcase,
  TrendingUp,
  Gift,
  PiggyBank,
  Wallet,
  BadgeDollarSign,
  Coins,
  Banknote,
  
  // Income Icons - Work & Business
  Building2,
  Award,
  Trophy,
  Target,
  Rocket,
  LineChart,
  BarChart3,
  Percent,
  Calculator,
  
  // Income Icons - Investments
  TrendingDown,
  CircleDollarSign,
  Landmark,
  ArrowUpCircle,
  CandlestickChart,
  PaymentIcon,
  
  // Income Icons - Side Income
  Lightbulb,
  Sparkle,
  Star,
  Crown,
  Gem,
  Medal,
  
  // Income Icons - Passive Income
  HomeIncome,
  Key,
  Store,
  ShoppingBasket,
  
  // Food & Dining
  UtensilsCrossed,
  Coffee,
  Pizza,
  Wine,
  IceCream,
  Apple,
  
  // Transportation
  Car,
  Bus,
  Bike,
  Plane,
  Train,
  Fuel,
  
  // Housing
  Home,
  Building,
  Lamp,
  Droplets,
  Zap,
  Hammer,
  
  // Entertainment
  Gamepad2,
  Film,
  Music,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Watch,
  Ticket,
  Palmtree,
  
  // Health
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Dumbbell,
  Smile,
  
  // Education
  GraduationCap,
  BookOpen,
  Laptop,
  Pencil,
  FileText,
  
  // Bills
  Smartphone,
  Wifi,
  CreditCard,
  Receipt,
  FileCheck,
  
  // Personal
  Scissors,
  Sparkles,
  
  // Pets
  Dog,
  Cat,
  
  // Other
  Package,
  MapPin,
  Users,
  Baby,
  Cigarette,
  AuroraCardIcon,
  CrystalCoinIcon,
  SunsetFlightIcon,
  NeonGroceriesIcon,
  LuminaSafeIcon,
  GalaxyBonusIcon,
  SapphireTravelIcon,
  VelvetDiningIcon,
}

const exclusiveIconSet: readonly IconCategoryItem[] = exclusiveImageIcons.map(({ name, label }) => ({
  name,
  label,
}))

export const getIcon = (iconName: IconName): LucideIcon => {
  return iconMap[iconName] || DollarSign
}

// Organized icon categories for easy selection
export const iconCategories = {
  income: {
    financial: [
      { name: 'DollarSign', label: 'Dinheiro' },
      { name: 'Coins', label: 'Moedas' },
      { name: 'Banknote', label: 'Cedula' },
      { name: 'Wallet', label: 'Carteira' },
      { name: 'PiggyBank', label: 'Poupanca' },
      { name: 'CircleDollarSign', label: 'Valor' },
      { name: 'PaymentIcon', label: 'Pagamento' },
    ] as const,
    
    workAndBusiness: [
      { name: 'Briefcase', label: 'Trabalho' },
      { name: 'Building2', label: 'Empresa' },
      { name: 'BadgeDollarSign', label: 'Bonus' },
      { name: 'Award', label: 'Premiacao' },
      { name: 'Trophy', label: 'Conquista' },
      { name: 'Target', label: 'Meta Atingida' },
      { name: 'Rocket', label: 'Startup' },
      { name: 'Calculator', label: 'Contabilidade' },
    ] as const,
    
    investments: [
      { name: 'TrendingUp', label: 'Investimento' },
      { name: 'TrendingDown', label: 'Acoes' },
      { name: 'LineChart', label: 'Fundos' },
      { name: 'BarChart3', label: 'Rendimentos' },
      { name: 'CandlestickChart', label: 'Trading' },
      { name: 'Landmark', label: 'Banco' },
      { name: 'ArrowUpCircle', label: 'Lucro' },
      { name: 'Percent', label: 'Juros' },
    ] as const,
    
    sideIncome: [
      { name: 'Lightbulb', label: 'Freelance' },
      { name: 'Sparkle', label: 'Criativo' },
      { name: 'Star', label: 'Premium' },
      { name: 'Crown', label: 'VIP' },
      { name: 'Gem', label: 'Valioso' },
      { name: 'Medal', label: 'Reconhecimento' },
    ] as const,
    
    passiveIncome: [
      { name: 'Gift', label: 'Presente' },
      { name: 'HomeIncome', label: 'Aluguel' },
      { name: 'Key', label: 'Imovel' },
      { name: 'Store', label: 'Loja Online' },
      { name: 'ShoppingBasket', label: 'Vendas' },
    ] as const,
    exclusive: [
      { name: 'AuroraCardIcon', label: 'Cartao Luxo' },
      { name: 'CrystalCoinIcon', label: 'Moeda Cristal' },
      { name: 'LuminaSafeIcon', label: 'Cofre Lumina' },
      { name: 'GalaxyBonusIcon', label: 'Bonus Galaxia' },
    ] as const,
  },
  
  foodAndDining: [
    { name: 'UtensilsCrossed', label: 'Restaurante' },
    { name: 'Coffee', label: 'Cafe' },
    { name: 'Pizza', label: 'Pizza' },
    { name: 'Wine', label: 'Bebidas' },
    { name: 'IceCream', label: 'Sobremesa' },
    { name: 'Apple', label: 'Supermercado' },
  ] as const,
  
  transportation: [
    { name: 'Car', label: 'Carro' },
    { name: 'Bus', label: 'Onibus' },
    { name: 'Bike', label: 'Bicicleta' },
    { name: 'Plane', label: 'Aviao' },
    { name: 'Train', label: 'Trem' },
    { name: 'Fuel', label: 'Combustivel' },
  ] as const,
  
  housing: [
    { name: 'Home', label: 'Casa' },
    { name: 'Building', label: 'Predio' },
    { name: 'Lamp', label: 'Iluminacao' },
    { name: 'Droplets', label: 'Agua' },
    { name: 'Zap', label: 'Energia' },
    { name: 'Hammer', label: 'Reparos' },
  ] as const,
  
  entertainment: [
    { name: 'Gamepad2', label: 'Games' },
    { name: 'Film', label: 'Cinema' },
    { name: 'Music', label: 'Musica' },
    { name: 'ShoppingBag', label: 'Compras' },
    { name: 'ShoppingCart', label: 'Varejo' },
    { name: 'Shirt', label: 'Roupas' },
    { name: 'Watch', label: 'Acessorios' },
    { name: 'Ticket', label: 'Eventos' },
    { name: 'Palmtree', label: 'Viagem' },
  ] as const,
  
  health: [
    { name: 'Heart', label: 'Saude' },
    { name: 'Activity', label: 'Fitness' },
    { name: 'Stethoscope', label: 'Medico' },
    { name: 'Pill', label: 'Farmacia' },
    { name: 'Dumbbell', label: 'Academia' },
    { name: 'Smile', label: 'Bem-estar' },
  ] as const,
  
  education: [
    { name: 'GraduationCap', label: 'Educacao' },
    { name: 'BookOpen', label: 'Livros' },
    { name: 'Laptop', label: 'Cursos Online' },
    { name: 'Pencil', label: 'Material' },
    { name: 'FileText', label: 'Documentos' },
  ] as const,
  
  bills: [
    { name: 'Smartphone', label: 'Telefone' },
    { name: 'Wifi', label: 'Internet' },
    { name: 'CreditCard', label: 'Cartao' },
    { name: 'Receipt', label: 'Contas' },
    { name: 'FileCheck', label: 'Assinatura' },
  ] as const,
  
  personal: [
    { name: 'Scissors', label: 'Cabelo' },
    { name: 'Sparkles', label: 'Beleza' },
  ] as const,
  
  pets: [
    { name: 'Dog', label: 'Cachorro' },
    { name: 'Cat', label: 'Gato' },
  ] as const,
  
  other: [
    { name: 'Package', label: 'Entrega' },
    { name: 'MapPin', label: 'Localizacao' },
    { name: 'Users', label: 'Familia' },
    { name: 'Baby', label: 'Criancas' },
    { name: 'Cigarette', label: 'Habitos' },
  ] as const,
  exclusive: exclusiveIconSet,
}

// Helper to get all available icons
export const getAllIcons = () => {
  const incomeIcons = Object.values(iconCategories.income).flat()
  const expenseIcons = [
    ...iconCategories.foodAndDining,
    ...iconCategories.transportation,
    ...iconCategories.housing,
    ...iconCategories.entertainment,
    ...iconCategories.health,
    ...iconCategories.education,
    ...iconCategories.bills,
    ...iconCategories.personal,
    ...iconCategories.pets,
    ...iconCategories.other,
  ]
  return [...incomeIcons, ...expenseIcons]
}

// Helper to get icons by type
export const getIconsByType = (type: 'income' | 'expense') => {
  if (type === 'income') {
    return Object.values(iconCategories.income).flat()
  }
  
  // For expenses, return all categories except income
  return [
    ...iconCategories.foodAndDining,
    ...iconCategories.transportation,
    ...iconCategories.housing,
    ...iconCategories.entertainment,
    ...iconCategories.health,
    ...iconCategories.education,
    ...iconCategories.bills,
    ...iconCategories.personal,
    ...iconCategories.pets,
    ...iconCategories.other,
  ]
}
