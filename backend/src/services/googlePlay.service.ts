import { google } from 'googleapis';
import { config } from '../config/env';
import { getGooglePlayCredentialsPath } from '../config/googlePlay';

/**
 * Serviço para integração com Google Play Billing API
 * Documentação: https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2
 */

interface GooglePlaySubscription {
  kind: string;
  startTimeMillis: string;
  expiryTimeMillis: string;
  autoRenewing: boolean;
  priceCurrencyCode: string;
  priceAmountMicros: string;
  countryCode: string;
  paymentState: number;
  cancelReason?: number;
  userCancellationTimeMillis?: string;
  orderId: string;
  linkedPurchaseToken?: string;
  purchaseType?: number;
}

interface VerifyPurchaseResult {
  isValid: boolean;
  expiryDate?: Date;
  autoRenewing?: boolean;
  orderId?: string;
  error?: string;
}

export class GooglePlayService {
  private androidPublisher: any;
  private packageName: string;

  constructor() {
    this.packageName = config.googlePlay.packageName;
    this.initializeClient();
  }

  /**
   * Inicializar cliente do Google Play API
   */
  private async initializeClient() {
    try {
      const credentialsPath = getGooglePlayCredentialsPath();
      
      const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      });

      this.androidPublisher = google.androidpublisher({
        version: 'v3',
        auth,
      });

      console.log('✅ Google Play API client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Play API client:', error);
      throw error;
    }
  }

  /**
   * Verificar recibo de compra de assinatura
   * @param purchaseToken - Token de compra fornecido pelo Google Play
   * @param subscriptionId - ID do produto de assinatura (ex: 'premium_monthly')
   */
  async verifySubscription(
    purchaseToken: string,
    subscriptionId: string
  ): Promise<VerifyPurchaseResult> {
    try {
      const response = await this.androidPublisher.purchases.subscriptions.get({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });

      const subscription: GooglePlaySubscription = response.data;

      // Verificar se a assinatura está ativa
      const expiryDate = new Date(parseInt(subscription.expiryTimeMillis));
      const isActive = expiryDate > new Date();
      const isPaid = subscription.paymentState === 1; // 1 = Payment received

      return {
        isValid: isActive && isPaid,
        expiryDate,
        autoRenewing: subscription.autoRenewing,
        orderId: subscription.orderId,
      };
    } catch (error: any) {
      console.error('Error verifying Google Play subscription:', error);
      return {
        isValid: false,
        error: error.message || 'Failed to verify subscription',
      };
    }
  }

  /**
   * Cancelar assinatura
   * @param purchaseToken - Token de compra
   * @param subscriptionId - ID do produto de assinatura
   */
  async cancelSubscription(
    purchaseToken: string,
    subscriptionId: string
  ): Promise<boolean> {
    try {
      await this.androidPublisher.purchases.subscriptions.cancel({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });

      console.log('✅ Subscription cancelled successfully');
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  /**
   * Reconhecer compra (acknowledge)
   * Necessário para que a compra seja confirmada
   */
  async acknowledgePurchase(
    purchaseToken: string,
    subscriptionId: string
  ): Promise<boolean> {
    try {
      await this.androidPublisher.purchases.subscriptions.acknowledge({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });

      console.log('✅ Purchase acknowledged successfully');
      return true;
    } catch (error) {
      console.error('Error acknowledging purchase:', error);
      return false;
    }
  }

  /**
   * Processar notificação em tempo real (Real-time Developer Notification)
   * @param notificationData - Dados da notificação do Google Play
   */
  async processNotification(notificationData: any): Promise<void> {
    try {
      const { subscriptionNotification } = notificationData;

      if (!subscriptionNotification) {
        console.log('Not a subscription notification');
        return;
      }

      const {
        notificationType,
        purchaseToken,
        subscriptionId,
      } = subscriptionNotification;

      console.log('Processing notification:', {
        type: notificationType,
        subscriptionId,
      });

      // Tipos de notificação:
      // 1 = SUBSCRIPTION_RECOVERED
      // 2 = SUBSCRIPTION_RENEWED
      // 3 = SUBSCRIPTION_CANCELED
      // 4 = SUBSCRIPTION_PURCHASED
      // 5 = SUBSCRIPTION_ON_HOLD
      // 6 = SUBSCRIPTION_IN_GRACE_PERIOD
      // 7 = SUBSCRIPTION_RESTARTED
      // 8 = SUBSCRIPTION_PRICE_CHANGE_CONFIRMED
      // 9 = SUBSCRIPTION_DEFERRED
      // 10 = SUBSCRIPTION_PAUSED
      // 11 = SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED
      // 12 = SUBSCRIPTION_REVOKED
      // 13 = SUBSCRIPTION_EXPIRED

      switch (notificationType) {
        case 2: // RENEWED
        case 4: // PURCHASED
          console.log('✅ Subscription active/renewed');
          break;
        case 3: // CANCELED
        case 12: // REVOKED
        case 13: // EXPIRED
          console.log('❌ Subscription ended');
          break;
        default:
          console.log('ℹ️ Other notification type:', notificationType);
      }
    } catch (error) {
      console.error('Error processing notification:', error);
      throw error;
    }
  }

  /**
   * Obter detalhes completos da assinatura
   */
  async getSubscriptionDetails(
    purchaseToken: string,
    subscriptionId: string
  ): Promise<GooglePlaySubscription | null> {
    try {
      const response = await this.androidPublisher.purchases.subscriptions.get({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });

      return response.data;
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }
  }
}

export const googlePlayService = new GooglePlayService();
