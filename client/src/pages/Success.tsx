import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { useNotificationManager } from '@/hooks/useNotificationManager';

export default function Success() {
  const [, navigate] = useLocation();
  const { notifySuccess, notifyInApp } = useNotificationManager();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    setSessionId(id);

    if (id) {
      notifySuccess('Payment Successful!', 'Your purchase has been confirmed.');
      notifyInApp('success', 'Purchase Confirmed', 'Check your email for download links and further instructions.');
    }
  }, [notifySuccess, notifyInApp]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 border border-border">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">Payment Successful!</h1>
        <p className="text-center text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Session ID */}
        {sessionId && (
          <div className="bg-secondary/30 rounded p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-1">Order ID</p>
            <p className="text-sm font-mono text-foreground break-all">{sessionId}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Check Your Email</h3>
              <p className="text-xs text-muted-foreground">
                We've sent a confirmation email with your download links and access instructions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Download Your Product</h3>
              <p className="text-xs text-muted-foreground">
                Access your digital products and resources immediately.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/account')}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go to My Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground mb-2">Need help?</p>
          <a
            href="mailto:support@automationhub.com"
            className="text-sm text-primary hover:underline"
          >
            Contact Support
          </a>
        </div>
      </Card>
    </div>
  );
}
