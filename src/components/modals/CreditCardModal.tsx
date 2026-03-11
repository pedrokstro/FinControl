import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X, CreditCard as CardIcon, Save } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { useFinancialStore } from '@/store/financialStore'
import { CreditCard } from '@/types'
import { cn } from '@/lib/utils'
import CustomSelect from '@/components/common/CustomSelect'
import type { SelectOption } from '@/components/common/CustomSelect'
import BrandIcon from '@/components/common/BrandIcon'
import { useIsMobile } from '@/hooks'

const KNOWN_BRANDS = ['Visa','Mastercard','Elo','Hipercard','Amex','Nubank','Inter','Neon','C6','Outro']

const cardSchema = z.object({
  name: z.string().min(1, 'Nome do cartão é obrigatório'),
  brand: z.string().min(1, 'Bandeira é obrigatória'),
  customBrand: z.string().optional(),
  limit: z.string().optional(),
  closingDay: z.string().optional(),
  dueDay: z.string().optional(),
})

type CardFormData = z.infer<typeof cardSchema>

interface Props {
  isOpen: boolean
  onClose: () => void
  card?: CreditCard | null
}

const BRAND_OPTIONS: SelectOption[] = [
  { value: 'Visa',       label: 'Visa',            icon: <BrandIcon brand="Visa"       slug="visa.png"             /> },
  { value: 'Mastercard', label: 'Mastercard',       icon: <BrandIcon brand="Mastercard" slug="Mastercard.png"       /> },
  { value: 'Elo',        label: 'Elo',              icon: <BrandIcon brand="Elo"        slug="elo.png"              /> },
  { value: 'Hipercard',  label: 'Hipercard',        icon: <BrandIcon brand="Hipercard"  slug="hipercard.png"        /> },
  { value: 'Amex',       label: 'American Express', icon: <BrandIcon brand="Amex"       slug="American_Express.png" /> },
  { value: 'Nubank',     label: 'Nubank',           icon: <BrandIcon brand="Nubank"     slug="nubank.png"           /> },
  { value: 'Inter',      label: 'Inter',            icon: <BrandIcon brand="Inter"      slug="banco-inter.png"      /> },
  { value: 'Neon',       label: 'Neon',             icon: <BrandIcon brand="Neon"       slug="banco-neon.png"       /> },
  { value: 'C6',         label: 'C6 Bank',          icon: <BrandIcon brand="C6"         slug="c6-bank.png"          /> },
  { value: 'Outro',      label: 'Outro banco...' },
]

export default function CreditCardModal({ isOpen, onClose, card }: Props) {
  const { addCreditCard, updateCreditCard, isLoading } = useFinancialStore()
  const isMobile = useIsMobile()
  const dragControls = useDragControls()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: '',
      brand: 'Visa',
      customBrand: '',
      limit: '',
      closingDay: '',
      dueDay: '',
    },
  })

  const brandValue = watch('brand')
  const isCustomBrand = brandValue === 'Outro'

  useEffect(() => {
    if (isOpen) {
      if (card) {
        const isKnown = KNOWN_BRANDS.includes(card.brand)
        reset({
          name: card.name,
          brand: isKnown ? card.brand : 'Outro',
          customBrand: isKnown ? '' : card.brand,
          limit: card.limit ? card.limit.toString() : '',
          closingDay: card.closingDay ? card.closingDay.toString() : '',
          dueDay: card.dueDay ? card.dueDay.toString() : '',
        })
      } else {
        reset({
          name: '',
          brand: 'Visa',
          customBrand: '',
          limit: '',
          closingDay: '',
          dueDay: '',
        })
      }
    }
  }, [isOpen, card, reset])

  const onSubmit = async (data: CardFormData) => {
    try {
      haptics.light()
      const finalBrand = data.brand === 'Outro'
        ? (data.customBrand?.trim() || 'Outro')
        : data.brand

      const limitVal  = parseFloat(data.limit || '0')
      const closingVal = parseInt(data.closingDay || '1', 10)
      const dueVal     = parseInt(data.dueDay    || '10', 10)

      const cardData = {
        name:       data.name,
        brand:      finalBrand,
        limit:      isNaN(limitVal)   ? 0  : limitVal,
        closingDay: isNaN(closingVal) ? 1  : closingVal,
        dueDay:     isNaN(dueVal)     ? 10 : dueVal,
      }

      if (card) {
        await updateCreditCard(card.id, cardData)
      } else {
        await addCreditCard(cardData)
      }
      onClose()
    } catch (error) {
      haptics.error()
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Modal Container */}
          <div className={`fixed inset-0 flex justify-center z-[200] pointer-events-none ${isMobile ? 'items-end' : 'items-center p-4'}`}>
            <motion.div
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              drag={isMobile ? 'y' : false}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={isMobile ? { top: 0, bottom: 0 } : undefined}
              dragElastic={isMobile ? { top: 0, bottom: 0.4 } : undefined}
              onDragEnd={isMobile ? ((_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 400) {
                  onClose()
                }
              }) : undefined}
              className={`bg-white dark:bg-neutral-900 z-[200] shadow-2xl w-full max-w-md flex flex-col overflow-hidden pointer-events-auto ${
                isMobile ? 'rounded-t-[3xl] border-t border-gray-100 dark:border-neutral-800' : 'rounded-3xl'
              }`}
            >
              <div className={`flex flex-col h-full overflow-hidden ${isMobile ? 'max-h-[85vh]' : ''}`}>
                {/* Drag indicator no mobile */}
                {isMobile && (
                  <div
                    className="py-3 w-full flex justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                    onPointerDown={(e) => dragControls.start(e)}
                  >
                    <div className="w-10 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                  </div>
                )}

                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800 flex-shrink-0 ${isMobile ? 'pt-0' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <CardIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {card ? 'Editar Cartão' : 'Novo Cartão'}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      haptics.light()
                      onClose()
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Cartão
                    </label>
                    <input
                      {...register('name')}
                      placeholder="Ex: Nubank, Itaú..."
                      className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-primary-500 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1 font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Bandeira/Instituição
                    </label>
                    <CustomSelect
                      options={BRAND_OPTIONS}
                      value={brandValue}
                      onChange={(val) => {
                        setValue('brand', val, { shouldValidate: true })
                        if (val !== 'Outro') setValue('customBrand', '')
                      }}
                      dropdownTitle="Bandeira/Instituição"
                      placeholder="Selecione a bandeira..."
                    />

                    {/* Campo livre para bank personalizado */}
                    <AnimatePresence>
                      {isCustomBrand && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <input
                            {...register('customBrand')}
                            autoFocus
                            placeholder="Ex: Bradesco, Santander, C6 Bank..."
                            className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-primary-300 dark:border-primary-700 focus:border-primary-500 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400"
                          />
                          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1.5 ml-1">
                            Digite o nome do banco ou instituição
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {errors.brand && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1 font-medium">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Limite (Opcional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        {...register('limit')}
                        placeholder="0,00"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-primary-500 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Dia do Fechamento (Opcional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        {...register('closingDay')}
                        placeholder="Ex: 1"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-primary-500 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Dia do Vencimento (Opcional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        {...register('dueDay')}
                        placeholder="Ex: 10"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-primary-500 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-4 font-bold transition-all active:scale-[0.98] shadow-lg shadow-primary-500/30",
                      isLoading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {card ? 'Salvar Alterações' : 'Adicionar Cartão'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
