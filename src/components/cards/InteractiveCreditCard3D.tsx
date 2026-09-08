import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CreditCard as CreditCardType } from '@/types'
import BrandIcon from '@/components/common/BrandIcon'
import { Wifi } from 'lucide-react'

interface InteractiveCreditCard3DProps {
  card: CreditCardType
  spent: number
  limit: number
  dueStatus?: { label: string; color: string } | null
}

const getBrandGradient = (brand: string) => {
  switch (brand?.toLowerCase()) {
    case 'nubank':
      return 'from-[#820AD1] via-[#61079e] to-[#430270]'
    case 'inter':
      return 'from-[#FF7A00] via-[#E05A00] to-[#B33E00]'
    case 'c6':
    case 'c6 bank':
      return 'from-[#242424] via-[#171717] to-[#0A0A0A]'
    case 'neon':
      return 'from-[#00E5FF] via-[#00A3FF] to-[#0057FF]'
    case 'itau':
    case 'itaú':
      return 'from-[#EC7000] via-[#003399] to-[#001D5C]'
    case 'bradesco':
      return 'from-[#CC092F] via-[#940020] to-[#590011]'
    case 'santander':
      return 'from-[#EC0000] via-[#B30000] to-[#730000]'
    case 'mastercard':
      return 'from-[#EB001B] via-[#F79E1B] to-[#FF5F00]'
    case 'visa':
      return 'from-[#1A1F71] via-[#0D47A1] to-[#01579B]'
    default:
      return 'from-slate-900 via-primary-950 to-neutral-900'
  }
}

export const InteractiveCreditCard3D = ({
  card,
  spent,
  limit,
  dueStatus,
}: InteractiveCreditCard3DProps) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showFullDigits, setShowFullDigits] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg'])
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const gradient = getBrandGradient(card.brand)
  const hasLimit = limit > 0
  const progress = hasLimit ? Math.min((spent / limit) * 100, 100) : 0

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full select-none cursor-pointer py-2"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-[1.586/1] rounded-[24px] sm:rounded-[28px] shadow-2xl transition-shadow hover:shadow-primary-500/20"
      >
        {/* ================= FRENTE DO CARTÃO ================= */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 text-white bg-gradient-to-br ${gradient} border border-white/20 overflow-hidden flex flex-col justify-between shadow-inner`}
        >
          {/* Brilho Holográfico que segue o mouse */}
          <motion.div
            style={{
              left: sheenX,
              top: sheenY,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/15 blur-2xl pointer-events-none"
          />

          {/* Topo do Cartão: Chip EMV, Contactless & Brand */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* Chip metálico dourado */}
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/80 shadow-md flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-[1px] bg-amber-700/40 absolute" />
                <div className="h-full w-[1px] bg-amber-700/40 absolute" />
                <div className="w-4 h-3 rounded-sm border border-amber-700/30" />
              </div>
              <Wifi className="w-5 h-5 text-white/80 rotate-90" />
            </div>

            <div className="flex items-center gap-2">
              {dueStatus && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${dueStatus.color} shadow-sm backdrop-blur-md`}>
                  {dueStatus.label}
                </span>
              )}
              <div className="h-7 w-12 flex items-center justify-end">
                <BrandIcon brand={card.brand} className="h-full w-auto object-contain brightness-125" />
              </div>
            </div>
          </div>

          {/* Centro: Número Mascarado */}
          <div className="relative z-10 my-auto">
            <div className="flex items-center gap-3 font-mono text-base sm:text-lg tracking-widest text-white/90 drop-shadow">
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span>{showFullDigits && card.name ? card.name.slice(-4) : '8842'}</span>
            </div>
          </div>

          {/* Rodapé: Nome do Cartão, Vencimento e Dica 3D */}
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/60 font-semibold font-mono">Titular / Cartão</p>
              <h4 className="font-bold text-sm sm:text-base tracking-wide truncate max-w-[180px] drop-shadow">
                {card.name}
              </h4>
            </div>

            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-white/60 font-semibold font-mono">Vencimento</p>
              <p className="font-bold text-sm font-mono drop-shadow">
                Dia {card.dueDay || '10'}
              </p>
            </div>
          </div>
        </div>

        {/* ================= VERSO DO CARTÃO (180deg) ================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className={`absolute inset-0 rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 text-white bg-gradient-to-br ${gradient} border border-white/20 overflow-hidden flex flex-col justify-between shadow-inner`}
        >
          {/* Tarja Magnética */}
          <div className="absolute top-6 left-0 right-0 h-10 bg-black/80 shadow-md" />

          {/* Painel de Assinatura & CVV */}
          <div className="mt-14 relative z-10">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-8 bg-white/90 rounded-md flex items-center px-3 justify-end text-slate-800 font-mono text-xs italic tracking-wider">
                fincontrol auth
              </div>
              <div className="h-8 px-3 bg-white rounded-md flex items-center justify-center text-slate-900 font-mono text-xs font-bold shadow-inner">
                {showFullDigits ? '392' : '•••'}
              </div>
            </div>
          </div>

          {/* Informações de Limite no Verso */}
          <div className="relative z-10 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-white/70">Consumo de Limite</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  progress > 90
                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : progress > 75
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/60 mt-1 font-mono">
              <span>Gasto: R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>Limite: {hasLimit ? `R$ ${limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sem limite'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-white/50 font-mono relative z-10">
            <span>FinControl Secure Card</span>
            <span className="underline cursor-pointer" onClick={(e) => { e.stopPropagation(); setShowFullDigits(!showFullDigits); }}>
              {showFullDigits ? 'Ocultar CVV' : 'Revelar CVV'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default InteractiveCreditCard3D
