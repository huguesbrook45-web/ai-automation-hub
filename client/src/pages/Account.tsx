import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, LogOut, Download, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useNotificationManager } from '@/hooks/useNotificationManager';

interface Order {
  id: string;
  date: string;
  amount: number;
  product: string;
  status: 'completed' | 'pending' | 'failed';
  downloadUrl?: string;
}

interface Subscription {
  id: string;
  product: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodEnd: string;
  amount: number;
  interval: 'month' | 'year';
}

export default function Account() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { notifyError, notifySuccess } = useNotificationManager();

  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch orders and subscriptions
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersResponse = await fetch('/api/stripe/payment-history', {
          credentials: 'include',
        });

        if (ordersResponse.ok) {
          const { payments } = await ordersResponse.json();
          setOrders(
            payments.map((payment: any) => ({
              id: payment.id,
              date: new Date(payment.created).toLocaleDateString(),
              amount: payment.amount / 100,
              product: payment.description || 'Digital Product',
              status: payment.status === 'succeeded' ? 'completed' : 'failed',
              downloadUrl: payment.receiptUrl,
            }))
          );
        }

        // Fetch subscriptions
        const subsResponse = await fetch('/api/stripe/subscription-status', {
          credentials: 'include',
        });

        if (subsResponse.ok) {
          const { hasSubscription, subscription } = await subsResponse.json();
          if (hasSubscription && subscription) {
            setSubscriptions([
              {
                id: subscription.id,
                product: 'Premium Membership',
                status: subscription.status,
                currentPeriodEnd: new Date(subscription.currentPeriodEnd).toLocaleDateString(),
                amount: subscription.items?.[0]?.amount || 0,
                interval: subscription.items?.[0]?.interval || 'month',
              },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        notifyError('Error', 'Failed to load account data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, notifyError]);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/manage-subscription', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const { portalUrl } = await response.json();
        window.open(portalUrl, '_blank');
        notifySuccess('Redirecting', 'Opening Stripe billing portal');
      }
    } catch (error) {
      console.error('Error:', error);
      notifyError('Error', 'Failed to open billing portal');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">My Account</h1>
              <p className="text-muted-foreground mt-2">Welcome, {user.name || user.email}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

              {orders.length === 0 ? (
                <Card className="p-8 text-center border border-border">
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button
                    onClick={() => navigate('/products')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Browse Products
                  </Button>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="p-6 border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{order.product}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {order.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${order.amount.toFixed(2)}
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      {order.downloadUrl && (
                        <Button
                          onClick={() => window.open(order.downloadUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="mt-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Active Subscriptions</h2>

              {subscriptions.length === 0 ? (
                <Card className="p-8 text-center border border-border">
                  <p className="text-muted-foreground mb-4">No active subscriptions</p>
                  <Button
                    onClick={() => navigate('/products')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Browse Subscriptions
                  </Button>
                </Card>
              ) : (
                subscriptions.map((sub) => (
                  <Card key={sub.id} className="p-6 border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{sub.product}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              sub.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : sub.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Renews {sub.currentPeriodEnd}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${(sub.amount / 100).toFixed(2)}/{sub.interval}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleManageSubscription}
                      variant="outline"
                      className="w-full"
                    >
                      Manage Subscription
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
