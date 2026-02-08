import Stripe from 'stripe';

// Product definitions (same as server/products.ts)
const PRODUCTS = {
  product_starter_pack: {
    name: 'Solopreneur Automation Starter Pack',
    price: 3900,
  },
  product_support_blueprint: {
    name: 'Customer Support Automation Blueprint',
    price: 5900,
  },
  product_data_management: {
    name: 'Data Management & Reporting Automation',
    price: 5900,
  },
  product_premium_monthly: {
    name: 'Premium Membership - Monthly',
    price: 2900,
    recurring: { interval: 'month' },
  },
  product_premium_yearly: {
    name: 'Premium Membership - Yearly',
    price: 29900,
    recurring: { interval: 'year' },
  },
  product_pro_monthly: {
    name: 'Pro Membership - Monthly',
    price: 9900,
    recurring: { interval: 'month' },
  },
  product_pro_yearly: {
    name: 'Pro Membership - Yearly',
    price: 99900,
    recurring: { interval: 'year' },
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    const stripe = new Stripe(stripeKey);
    const { productId } = req.body;

    console.log('Checkout request for product:', productId);

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Look up product
    const product = PRODUCTS[productId];
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Creating checkout session for:', product.name, 'Price:', product.price);

    // Create a checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.price),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin || 'https://automate-business.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://automate-business.vercel.app'}/products`,
    };

    // Add mode based on product type
    if (product.recurring) {
      sessionConfig.mode = 'subscription';
    } else {
      sessionConfig.mode = 'payment';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', session.id);
    res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
}
