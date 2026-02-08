import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import {
  sendOrderConfirmation,
  sendSubscriptionConfirmation,
  sendSubscriptionCancelled,
  sendPaymentFailed,
} from '../services/email';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 * IMPORTANT: This route must be registered BEFORE express.json() middleware
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle test events
    if (event.id.startsWith('evt_test_')) {
      console.log('[Webhook] Test event detected, returning verification response');
      return res.json({
        verified: true,
      });
    }

    console.log(`[Webhook] Processing event: ${event.type} (${event.id})`);

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`[Webhook] Checkout session completed: ${session.id}`);

          // Extract metadata
          const userId = session.metadata?.user_id;
          const productId = session.metadata?.product_id;
          const customerEmail = session.metadata?.customer_email;
          const customerName = session.metadata?.customer_name;

          if (!userId) {
            console.warn('[Webhook] No user_id in session metadata');
            break;
          }

          // Log the transaction
          console.log(`[Webhook] Purchase recorded:`, {
            userId,
            productId,
            sessionId: session.id,
            paymentStatus: session.payment_status,
            mode: session.mode,
            amount: session.amount_total,
            currency: session.currency,
          });

          // Send confirmation email
          if (customerEmail) {
            try {
              if (session.mode === 'payment') {
                // One-time purchase
                await sendOrderConfirmation(customerEmail, {
                  orderId: session.id,
                  customerName: customerName || 'Customer',
                  productName: 'Digital Product',
                  amount: session.amount_total || 0,
                  date: new Date().toLocaleDateString(),
                });
              } else if (session.mode === 'subscription') {
                // Subscription
                const nextBillingDate = new Date();
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                await sendSubscriptionConfirmation(customerEmail, {
                  customerId: userId,
                  customerName: customerName || 'Customer',
                  productName: 'Premium Membership',
                  amount: session.amount_total || 0,
                  interval: 'month',
                  nextBillingDate: nextBillingDate.toLocaleDateString(),
                });
              }
            } catch (emailError) {
              console.error('[Webhook] Failed to send confirmation email:', emailError);
            }
          }

          // TODO: Update database with purchase information
          // - Record purchase in orders/purchases table
          // - Grant access to digital product if one-time purchase
          // - Create subscription record if subscription mode

          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`[Webhook] Payment intent succeeded: ${paymentIntent.id}`);

          // TODO: Handle payment success
          // - Update order status
          // - Send receipt email
          // - Trigger fulfillment

          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object as Stripe.Invoice;
          console.log(`[Webhook] Invoice paid: ${invoice.id}`);

          // TODO: Handle subscription payment
          // - Update subscription status
          // - Send payment receipt
          // - Grant access for the billing period

          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);

          // Get customer email
          if (invoice.customer) {
            try {
              const customer = await stripe.customers.retrieve(invoice.customer as string);
              const customerEmail = (customer as any).email;
              const customerName = (customer as any).name || 'Customer';

              if (customerEmail) {
                const retryDate = new Date();
                retryDate.setDate(retryDate.getDate() + 3);
                await sendPaymentFailed(customerEmail, {
                  customerName,
                  amount: invoice.amount_due || 0,
                  retryDate: retryDate.toLocaleDateString(),
                });
              }
            } catch (error) {
              console.error('[Webhook] Failed to send payment failed email:', error);
            }
          }

          // TODO: Handle payment failure
          // - Update subscription status

          break;
        }

        case 'customer.subscription.created': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[Webhook] Subscription created: ${subscription.id}`);

          // TODO: Handle subscription creation
          // - Record subscription in database
          // - Grant access to premium features
          // - Send welcome email

          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[Webhook] Subscription updated: ${subscription.id}`);

          // TODO: Handle subscription update
          // - Update subscription details in database
          // - Handle plan changes
          // - Handle cancellation requests

          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[Webhook] Subscription cancelled: ${subscription.id}`);

          // Get customer email
          if (subscription.customer) {
            try {
              const customer = await stripe.customers.retrieve(subscription.customer as string);
              const customerEmail = (customer as any).email;
              const customerName = (customer as any).name || 'Customer';

              if (customerEmail) {
                await sendSubscriptionCancelled(customerEmail, {
                  customerName,
                  productName: 'Premium Membership',
                  cancelledDate: new Date().toLocaleDateString(),
                });
              }
            } catch (error) {
              console.error('[Webhook] Failed to send cancellation email:', error);
            }
          }

          // TODO: Handle subscription cancellation
          // - Update subscription status to cancelled
          // - Revoke premium access

          break;
        }

        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge;
          console.log(`[Webhook] Charge refunded: ${charge.id}`);

          // TODO: Handle refund
          // - Update order status to refunded
          // - Revoke access if applicable
          // - Send refund confirmation

          break;
        }

        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }

      // Acknowledge receipt of event
      res.json({ received: true });
    } catch (error) {
      console.error(`[Webhook] Error processing event:`, error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

export default router;
