import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard as CardIcon, Save } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import { useFinancialStore } from '@/store/financialStore'
import { CreditCard } from '@/types'
import { cn } from '@/lib/utils'
import CustomSelect from '@/components/common/CustomSelect'
import type { SelectOption } from '@/components/common/CustomSelect'
import BrandIcon from '@/components/common/BrandIcon'

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
      // Se "Outro", usa o texto digitado como brand
      const finalBrand = data.brand === 'Outro'
        ? (data.customBrand?.trim() || 'Outro')
        : data.brand

      const cardData = {
        name: data.name,
        brand: finalBrand,
        limit: data.limit ? parseFloat(data.limit) : 0,
        closingDay: data.closingDay ? parseInt(data.closingDay, 10) : 1,
        dueDay: data.dueDay ? parseInt(data.dueDay, 10) : 10,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay wrapper que centraliza no desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          >
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={e => e.stopPropagation()}
            className="w-full md:max-w-md bg-white dark:bg-neutral-900 md:rounded-3xl rounded-t-3xl shadow-xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
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
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto">
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
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
