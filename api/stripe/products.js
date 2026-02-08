export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const products = {
      oneTime: [
        {
          id: 'product_starter_pack',
          name: 'Solopreneur Automation Starter Pack',
          description: 'Get started with 5 ready-to-use automation templates, email workflow setup guide, and customer support automation blueprint.',
          type: 'one-time',
          price: 3900,
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
          price: 5900,
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
          price: 5900,
          currency: 'usd',
          features: [
            'Database setup and organization guide',
            'Automated reporting templates',
            'Integration with Google Sheets, Airtable, Notion',
            'Monthly reporting dashboard setup',
            'Lifetime access to updates',
          ],
        },
      ],
      subscriptions: [
        {
          id: 'product_premium_monthly',
          name: 'Premium Membership - Monthly',
          description: 'Get monthly access to all premium guides, templates, and exclusive automation resources.',
          type: 'subscription',
          price: 2900,
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
          price: 29900,
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
          price: 9900,
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
          price: 99900,
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
      ],
    };

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
