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
} from 'lucide-react'

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
}

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
    { name: 'Package', label: 'Encomenda' },
    { name: 'MapPin', label: 'Localizacao' },
    { name: 'Users', label: 'Familia' },
    { name: 'Baby', label: 'Bebe' },
    { name: 'Cigarette', label: 'Vicios' },
  ] as const,
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
