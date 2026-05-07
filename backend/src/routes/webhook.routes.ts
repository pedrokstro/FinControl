import express, { Router } from 'express';
import Stripe from 'stripe';
import { subscriptionService } from '../services/subscription.service';
import { logger } from '../utils/logger';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      webhookSecret
    );
  } catch (err: any) {
    logger.error(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      
      if (!userId) {
        logger.warn('⚠️ Webhook Checkout Completed: client_reference_id missing!');
        break;
      }

      logger.info(`✅ Processing Premium Activation for User ID: ${userId}`);
      
      try {
        // Encontrar período (mensal ou anual)
        // O Stripe não envia o período diretamente no checkout do Payment Link facilmente, 
        // mas podemos ver o total ou o nome do produto se necessário.
        // No entanto, o `activatePremiumPlan` já seta uma data de término.
        
        // Vamos verificar se é mensal ou anual pelo total (ou podemos olhar os line_items se expandido)
        const isAnnual = session.amount_total === 14999;
        const durationMonths = isAnnual ? 12 : 1;

        // Capturar IDs do Stripe para permitir cancelamento posterior
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        await subscriptionService.activatePremiumPlan(
          userId, 
          durationMonths, 
          stripeCustomerId, 
          stripeSubscriptionId
        );
        logger.info(`✨ User ${userId} successfully upgraded to Premium (${isAnnual ? 'Yearly' : 'Monthly'})`);
        logger.info(`   Stripe Sub: ${stripeSubscriptionId} | Customer: ${stripeCustomerId}`);
      } catch (error) {
        logger.error(`❌ Failed to activate premium for user ${userId}:`, error);
      }
      break;
    
    // case 'customer.subscription.deleted':
    //   // Desativar premium do banco
    //   break;

    default:
      logger.debug(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router;
