import { useState, useCallback } from 'react'
import { subscriptionService, type MonthlyUsage } from '@/services/subscription.service'

export const useTransactionLimit = () => {
  const [usage, setUsage] = useState<MonthlyUsage | null>(null)
  const [loading, setLoading] = useState(false)

  const checkLimit = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true)
      const data = await subscriptionService.getMonthlyUsage()
      setUsage(data)

      // Premium tem transações ilimitadas
      if (data.isPremium) {
        return true
      }

      // Verificar se atingiu o limite
      if (data.currentCount >= data.limit) {
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao verificar limite:', error)
      // Em caso de erro, permitir a transação
      return true
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshUsage = useCallback(async () => {
    try {
      const data = await subscriptionService.getMonthlyUsage()
      setUsage(data)
    } catch (error) {
      console.error('Erro ao atualizar uso:', error)
    }
  }, [])

  return {
    usage,
    loading,
    checkLimit,
    refreshUsage,
  }
}
