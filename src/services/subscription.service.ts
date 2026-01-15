import api from './api'

export interface SubscriptionStatus {
  planType: 'free' | 'premium'
  isPremium: boolean
  planStartDate?: string | null
  planEndDate?: string | null
  daysRemaining?: number
  features: string[]
}

export interface ActivateSubscriptionRequest {
  durationMonths: number
}

export interface ActivateSubscriptionResponse {
  planType: string
  planStartDate: string
  planEndDate: string
  isPremium: boolean
}

export interface MonthlyUsage {
  currentCount: number
  limit: number
  percentage: number
  isPremium: boolean
}

class SubscriptionService {
  /**
   * Obter status da assinatura do usuário
   */
  async getStatus(): Promise<SubscriptionStatus> {
    const response = await api.get('/subscription/status')
    return response.data.data
  }

  /**
   * Ativar plano premium
   */
  async activate(durationMonths: number = 1): Promise<ActivateSubscriptionResponse> {
    const response = await api.post('/subscription/activate', { durationMonths })
    return response.data.data
  }

  /**
   * Cancelar plano premium
   */
  async cancel(): Promise<void> {
    await api.post('/subscription/cancel')
  }

  /**
   * Renovar plano premium
   */
  async renew(durationMonths: number = 1): Promise<ActivateSubscriptionResponse> {
    const response = await api.post('/subscription/renew', { durationMonths })
    return response.data.data
  }

  /**
   * Obter features disponíveis
   */
  async getFeatures(): Promise<{ features: string[]; isPremium: boolean }> {
    const response = await api.get('/subscription/features')
    return response.data.data
  }

  /**
   * Processar pagamento via Google Pay
   */
  async processGooglePay(paymentData: any): Promise<ActivateSubscriptionResponse> {
    const response = await api.post('/subscription/google-pay', { paymentData })
    return response.data.data
  }

  /**
   * Iniciar período de teste grátis de 7 dias
   */
  async startTrial(): Promise<ActivateSubscriptionResponse> {
    const response = await api.post('/subscription/start-trial')
    return response.data.data
  }

  /**
   * Obter uso mensal de transações
   */
  async getMonthlyUsage(): Promise<MonthlyUsage> {
    const response = await api.get('/subscription/usage')
    return response.data.data
  }
}

export const subscriptionService = new SubscriptionService()
