export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const hasKey = !!stripeKey;
  const keyPreview = stripeKey ? stripeKey.substring(0, 10) + '...' : 'NOT SET';

  res.status(200).json({
    status: 'ok',
    hasStripeKey: hasKey,
    keyPreview: keyPreview,
    timestamp: new Date().toISOString(),
  });
}
