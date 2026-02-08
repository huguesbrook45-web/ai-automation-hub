/**
 * Product definitions for Stripe integration
 * Define all products and subscriptions here for centralized management
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'one-time' | 'subscription';
  price: number; // in cents (e.g., 3900 = $39.00)
  currency: string;
  interval?: 'month' | 'year'; // for subscriptions
  features: string[];
  image?: string;
}

// One-time purchase products
export const ONE_TIME_PRODUCTS: Product[] = [
  {
    id: 'product_starter_pack',
    name: 'Solopreneur Automation Starter Pack',
    description: 'Get started with 5 ready-to-use automation templates, email workflow setup guide, and customer support automation blueprint.',
    type: 'one-time',
    price: 3900, // $39.00
    currency: 'usd',
    features: [
      '5 ready-to-use automation templates',
      'Email workflow setup guide',
      'Customer support automation blueprint',
      'Quick-start video walkthrough',
      'Lifetime access to updates',
    ],
  },
  {
    id: 'product_support_blueprint',
    name: 'Customer Support Automation Blueprint',
    description: 'Complete guide to automating customer support with pre-built templates for Zendesk, Intercom, and Help Scout.',
    type: 'one-time',
    price: 5900, // $59.00
    currency: 'usd',
    features: [
      'Step-by-step implementation guide (2000+ words)',
      'Pre-built templates for 3 major platforms',
      'Integration guide with popular CRM systems',
      'Email response automation templates',
      'Lifetime access to updates',
    ],
  },
  {
    id: 'product_data_management',
    name: 'Data Management & Reporting Automation',
    description: 'Master database setup and automated reporting with integration guides for Google Sheets, Airtable, and Notion.',
    type: 'one-time',
    price: 5900, // $59.00
    currency: 'usd',
    features: [
      'Database setup and organization guide',
      'Automated reporting templates',
      'Integration with Google Sheets, Airtable, Notion',
      'Monthly reporting dashboard setup',
      'Lifetime access to updates',
    ],
  },
];

// Subscription products
export const SUBSCRIPTION_PRODUCTS: Product[] = [
  {
    id: 'product_premium_monthly',
    name: 'Premium Membership - Monthly',
    description: 'Get monthly access to all premium guides, templates, and exclusive automation resources.',
    type: 'subscription',
    price: 2900, // $29.00/month
    currency: 'usd',
    interval: 'month',
    features: [
      'Access to all premium guides and templates',
      'Weekly automation tips and strategies',
      'Monthly group Q&A sessions',
      'Priority email support',
      'Early access to new resources',
    ],
  },
  {
    id: 'product_premium_yearly',
    name: 'Premium Membership - Yearly',
    description: 'Get yearly access to all premium guides, templates, and exclusive automation resources with 2 months free.',
    type: 'subscription',
    price: 29900, // $299.00/year (equivalent to $24.92/month)
    currency: 'usd',
    interval: 'year',
    features: [
      'Access to all premium guides and templates',
      'Weekly automation tips and strategies',
      'Monthly group Q&A sessions',
      'Priority email support',
      'Early access to new resources',
      '2 months free (save $58)',
    ],
  },
  {
    id: 'product_pro_monthly',
    name: 'Pro Membership - Monthly',
    description: 'Advanced automation strategies, 1-on-1 consulting calls, and custom workflow design.',
    type: 'subscription',
    price: 9900, // $99.00/month
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Premium',
      'Two 30-minute 1-on-1 consulting calls per month',
      'Custom workflow design assistance',
      'Access to private community',
      'Dedicated Slack channel',
    ],
  },
  {
    id: 'product_pro_yearly',
    name: 'Pro Membership - Yearly',
    description: 'Advanced automation strategies, 1-on-1 consulting calls, and custom workflow design with 2 months free.',
    type: 'subscription',
    price: 99900, // $999.00/year
    currency: 'usd',
    interval: 'year',
    features: [
      'Everything in Premium',
      'Two 30-minute 1-on-1 consulting calls per month',
      'Custom workflow design assistance',
      'Access to private community',
      'Dedicated Slack channel',
      '2 months free (save $198)',
    ],
  },
];

// All products combined
export const ALL_PRODUCTS = [...ONE_TIME_PRODUCTS, ...SUBSCRIPTION_PRODUCTS];

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return ALL_PRODUCTS.find((product) => product.id === id);
};

// Helper function to format price
export const formatPrice = (priceInCents: number, currency: string = 'usd'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  return formatter.format(priceInCents / 100);
};

// Helper function to get subscription interval label
export const getIntervalLabel = (interval?: 'month' | 'year'): string => {
  switch (interval) {
    case 'month':
      return '/month';
    case 'year':
      return '/year';
    default:
      return '';
  }
};
