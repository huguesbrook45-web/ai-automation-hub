import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { getProductById, ONE_TIME_PRODUCTS, SUBSCRIPTION_PRODUCTS } from '../products';
import { AuthenticatedRequest, AuthUser } from '../types/auth';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Middleware to verify user is authenticated
const requireAuth = (req: AuthenticatedRequest, res: Response, next: Function) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

/**
 * POST /api/stripe/checkout
 * Create a Stripe checkout session for a product
 */
router.post('/checkout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const origin = req.headers.origin || 'https://ai-automation-hub.manus.space';

    // Build line items based on product type
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (product.type === 'one-time') {
      // One-time purchase
      lineItems = [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ];
    } else {
      // Subscription
      lineItems = [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
            recurring: {
              interval: product.interval || 'month',
            },
          },
          quantity: 1,
        },
      ];
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: product.type === 'one-time' ? 'payment' : 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products`,
      customer_email: req.user!.email,
      client_reference_id: req.user!.id.toString(),
      metadata: {
        user_id: req.user!.id.toString(),
        customer_email: req.user!.email,
        customer_name: req.user!.name || 'Customer',
        product_id: productId,
      },
      allow_promotion_codes: true,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/stripe/manage-subscription
 * Create a Stripe billing portal session for subscription management
 */
router.post('/manage-subscription', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const origin = req.headers.origin || 'https://ai-automation-hub.manus.space';

    // Get or create Stripe customer
    let customerId = req.user!.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user!.email,
        name: req.user!.name || 'Customer',
        metadata: {
          user_id: req.user!.id.toString(),
        },
      });
      customerId = customer.id;
      // Save customer ID to database
      // await db.users.update(req.user.id, { stripe_customer_id: customerId });
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account/subscriptions`,
    });

    res.json({ portalUrl: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

/**
 * GET /api/stripe/products
 * Get all available products (PUBLIC - no auth required)
 */
router.get('/products', async (req: Request, res: Response) => {
  try {
    res.json({
      oneTime: ONE_TIME_PRODUCTS,
      subscriptions: SUBSCRIPTION_PRODUCTS,
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/stripe/subscription-status
 * Get current subscription status for authenticated user
 */
router.get('/subscription-status', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user!.stripe_customer_id) {
      return res.json({ hasSubscription: false, subscription: null });
    }

    // Get customer subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: req.user!.stripe_customer_id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return res.json({ hasSubscription: false, subscription: null });
    }

    const subscription = subscriptions.data[0];
    res.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        items: subscription.items.data.map((item: any) => ({
          id: item.id,
          priceId: item.price.id,
          productId: item.price.product,
        })),
      },
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

/**
 * GET /api/stripe/payment-history
 * Get payment history for authenticated user
 */
router.get('/payment-history', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user!.stripe_customer_id) {
      return res.json({ payments: [] });
    }

    // Get customer charges
    const charges = await stripe.charges.list({
      customer: req.user!.stripe_customer_id,
      limit: 50,
    });

    const payments = charges.data.map((charge: any) => ({
      id: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      status: charge.status,
      created: new Date(charge.created * 1000),
      description: charge.description,
      receiptUrl: charge.receipt_url,
    }));

    res.json({ payments });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;
