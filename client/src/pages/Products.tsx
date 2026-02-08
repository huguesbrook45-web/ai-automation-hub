import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useNotificationManager } from '@/hooks/useNotificationManager';

interface Product {
  id: string;
  name: string;
  description: string;
  type: 'one-time' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
  features: string[];
}

interface ProductsResponse {
  oneTime: Product[];
  subscriptions: Product[];
}

export default function Products() {
  const [, navigate] = useLocation();
  const { notifySuccess, notifyError, notifyInfo } = useNotificationManager();
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/stripe/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        notifyError('Error', 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [notifyError]);

  const handleCheckout = async (productId: string) => {
    try {
      setCheckoutLoading(productId);
      notifyInfo('Processing', 'Redirecting to checkout...');

      console.log('Starting checkout for product:', productId);

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      console.log('Checkout response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout error response:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      console.log('Checkout response data:', data);

      const checkoutUrl = data.checkoutUrl || data.url;

      if (checkoutUrl) {
        // Open checkout in new tab
        window.open(checkoutUrl, '_blank');
        notifySuccess('Checkout', 'Opening Stripe checkout in a new tab');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      notifyError('Checkout Error', error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const getIntervalLabel = (interval?: 'month' | 'year') => {
    switch (interval) {
      case 'month':
        return '/month';
      case 'year':
        return '/year';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-foreground">Products & Services</h1>
          <p className="text-muted-foreground mt-2">
            Choose the perfect plan to accelerate your automation journey
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container py-12">
        {/* One-Time Products */}
        {products?.oneTime && products.oneTime.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Digital Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {products.oneTime.map((product) => (
                <Card key={product.id} className="p-6 flex flex-col h-full border border-border">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                      <p className="text-sm text-muted-foreground">One-time purchase</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleCheckout(product.id)}
                    disabled={checkoutLoading === product.id}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {checkoutLoading === product.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Products */}
        {products?.subscriptions && products.subscriptions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Membership Plans</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {products.subscriptions.map((product) => (
                <Card
                  key={product.id}
                  className={`p-6 flex flex-col h-full border ${
                    product.interval === 'year' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  {product.interval === 'year' && (
                    <div className="mb-4 inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold w-fit">
                      Best Value
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {getIntervalLabel(product.interval)}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleCheckout(product.id)}
                    disabled={checkoutLoading === product.id}
                    className={`w-full ${
                      product.interval === 'year'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    }`}
                  >
                    {checkoutLoading === product.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="bg-secondary/30 py-12 mt-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription anytime from your account settings. You'll retain access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a money-back guarantee?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee on all purchases. Contact support if you're not satisfied.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe's secure payment processing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer team licenses?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Contact our sales team at sales@automationhub.com for custom team pricing and licensing options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
