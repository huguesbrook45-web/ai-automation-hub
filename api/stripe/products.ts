import { VercelRequest, VercelResponse } from '@vercel/node';
import { ALL_PRODUCTS } from '../../server/products';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Separate one-time and subscription products
    const oneTime = ALL_PRODUCTS.filter(p => p.type === 'one-time');
    const subscriptions = ALL_PRODUCTS.filter(p => p.type === 'subscription');
    
    res.status(200).json({
      oneTime,
      subscriptions
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
