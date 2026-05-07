import Stripe from 'stripe';
import { config } from '../config/env';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe?.secretKey || process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16' as any,
    });
  }

  /**
   * Cancelar uma assinatura no Stripe
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error('❌ Erro ao cancelar assinatura no Stripe:', error);
      throw error;
    }
  }

  /**
   * Reativar uma assinatura no Stripe (opcional, dependendo do fluxo)
   */
  async reactivateSubscription(subscriptionId: string) {
    try {
      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    } catch (error) {
      console.error('❌ Erro ao reativar assinatura no Stripe:', error);
      throw error;
    }
  }

  /**
   * Obter detalhes da assinatura
   */
  async getSubscription(subscriptionId: string) {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('❌ Erro ao obter assinatura no Stripe:', error);
      throw error;
    }
  }

  /**
   * Gerar link para o Portal do Cliente Stripe
   */
  async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session.url;
    } catch (error) {
      console.error('❌ Erro ao criar Portal do Cliente no Stripe:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
