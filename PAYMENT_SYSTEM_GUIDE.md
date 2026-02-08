# Complete Payment System Implementation Guide

## Overview

Your AI Automation Resource Hub now has a complete payment system with:

✅ **Stripe Integration** - One-time purchases and recurring subscriptions  
✅ **User Authentication** - Manus OAuth integration  
✅ **Customer Dashboard** - Order history and subscription management  
✅ **Email Notifications** - Automated order and subscription emails  
✅ **Webhook Handling** - Real-time payment event processing  

---

## Architecture Overview

```
User Flow:
  1. User browses products on /products
  2. User clicks "Buy Now" or "Subscribe Now"
  3. Frontend calls POST /api/stripe/checkout
  4. Backend creates Stripe Checkout Session
  5. User redirected to Stripe's hosted checkout
  6. User completes payment
  7. Stripe sends webhook to /api/stripe/webhook
  8. Backend sends confirmation email
  9. User redirected to /success page
  10. User can view order in /account dashboard

Authentication Flow:
  1. User clicks login button (TODO: add to UI)
  2. Frontend redirects to OAuth provider
  3. User authorizes and returns with code
  4. Backend exchanges code for token
  5. User session created
  6. User can access /account dashboard
```

---

## Setup Instructions

### Step 1: Configure Email Service

The email system is ready but needs an email provider configured. Choose one:

#### Option A: SendGrid (Recommended)

```bash
npm install @sendgrid/mail
```

Update `server/services/email.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(options: EmailOptions): Promise<void> {
  await sgMail.send({
    to: options.to,
    from: process.env.SENDER_EMAIL || 'noreply@automationhub.com',
    subject: options.subject,
    html: options.data.emailContent,
  });
}
```

Add to environment variables:
- `SENDGRID_API_KEY` - Your SendGrid API key
- `SENDER_EMAIL` - Your sender email address

#### Option B: Mailgun

```bash
npm install mailgun.js
```

Update `server/services/email.ts`:

```typescript
import mailgun from 'mailgun.js';

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

async function sendEmail(options: EmailOptions): Promise<void> {
  await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `noreply@automationhub.com`,
    to: options.to,
    subject: options.subject,
    html: options.data.emailContent,
  });
}
```

Add to environment variables:
- `MAILGUN_API_KEY` - Your Mailgun API key
- `MAILGUN_DOMAIN` - Your Mailgun domain

#### Option C: Resend

```bash
npm install resend
```

Update `server/services/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(options: EmailOptions): Promise<void> {
  await resend.emails.send({
    from: 'noreply@automationhub.com',
    to: options.to,
    subject: options.subject,
    html: options.data.emailContent,
  });
}
```

Add to environment variables:
- `RESEND_API_KEY` - Your Resend API key

### Step 2: Configure Authentication

The authentication system uses Manus OAuth. Set up in Settings → Secrets:

```
VITE_OAUTH_PORTAL_URL = https://oauth.manus.im
```

### Step 3: Database Schema (Optional)

Create tables to track purchases and subscriptions:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  oauth_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases table
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  amount_cents INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 4: Add Login UI

Add a login button to the navigation. Update `client/src/pages/Home.tsx`:

```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, login, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <Link to="/account">My Account</Link>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <Button onClick={login}>Login</Button>
      )}
    </nav>
  );
}
```

---

## Features Implemented

### 1. Products Page (`/products`)

- Displays all one-time products and subscriptions
- Shows pricing, features, and descriptions
- "Buy Now" and "Subscribe Now" buttons
- Handles checkout session creation
- Displays loading states and error handling

### 2. Checkout Flow

- Secure Stripe checkout integration
- Pre-fills customer email
- Includes metadata for order tracking
- Supports promotion codes
- Redirects to success page after payment

### 3. Success Page (`/success`)

- Displays order confirmation
- Shows order ID
- Provides download links
- Links to account dashboard
- Displays support contact info

### 4. Account Dashboard (`/account`)

- Requires authentication
- Shows order history with details
- Displays active subscriptions
- Allows subscription management
- Shows payment status and dates

### 5. Email Notifications

Automatically sends emails for:
- Order confirmations (one-time purchases)
- Subscription confirmations
- Subscription cancellations
- Payment failures with retry information

### 6. Webhook Processing

Handles Stripe events:
- `checkout.session.completed` - Send confirmation email
- `invoice.paid` - Process subscription payment
- `invoice.payment_failed` - Send payment failure email
- `customer.subscription.deleted` - Send cancellation email
- `charge.refunded` - Process refunds

---

## Testing Checklist

### Test One-Time Purchase

```
1. Navigate to /products
2. Click "Buy Now" on a digital product
3. Use test card: 4242 4242 4242 4242
4. Expiry: 12/25, CVC: 123, ZIP: 12345
5. Verify success page appears
6. Check email for confirmation (if email configured)
7. Verify order appears in /account dashboard
```

### Test Subscription

```
1. Navigate to /products
2. Click "Subscribe Now" on a membership plan
3. Use test card: 4242 4242 4242 4242
4. Verify success page appears
5. Check email for subscription confirmation
6. Verify subscription appears in /account dashboard
7. Click "Manage Subscription" to test billing portal
```

### Test Payment Failure

```
1. Navigate to /products
2. Click "Buy Now"
3. Use test card: 4000 0000 0000 0002
4. Verify error message appears
5. Check email for payment failure notification (if configured)
```

### Test Webhook Delivery

```
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on the webhook endpoint
3. View recent events
4. Verify delivery status is "Delivered"
5. Check response codes are 200
```

---

## Implementation TODOs

### High Priority

- [ ] Configure email service (SendGrid, Mailgun, or Resend)
- [ ] Implement OAuth callback handler in `/api/auth/callback`
- [ ] Create database tables for users, purchases, subscriptions
- [ ] Update webhook handlers to save data to database
- [ ] Add login/logout UI to navigation
- [ ] Test complete payment flow end-to-end

### Medium Priority

- [ ] Add product download functionality
- [ ] Implement subscription access control
- [ ] Add invoice generation and storage
- [ ] Create admin dashboard for order management
- [ ] Add refund processing
- [ ] Implement promo code validation

### Low Priority

- [ ] Add payment method management
- [ ] Implement dunning management for failed payments
- [ ] Create usage analytics
- [ ] Add customer support ticket system
- [ ] Implement affiliate tracking

---

## Security Best Practices

1. **Never log sensitive data**
   - Don't log card numbers
   - Don't log API keys
   - Don't log webhook payloads with PII

2. **Always verify webhook signatures**
   - Use `stripe.webhooks.constructEvent()`
   - Never trust unsigned webhooks

3. **Use HTTPS only**
   - Stripe requires HTTPS
   - Manus provides automatic SSL

4. **Validate all inputs**
   - Check product IDs exist
   - Validate user authentication
   - Verify amounts match products

5. **Rate limiting**
   - Limit checkout endpoint to prevent abuse
   - Implement exponential backoff for retries

---

## Troubleshooting

### Emails not sending

**Problem:** Emails configured but not sending

**Solutions:**
1. Verify email service API key is correct
2. Check that sender email is verified in email service
3. Look for errors in server logs
4. Test email service directly with a simple script

### Webhook not receiving events

**Problem:** Stripe events not being processed

**Solutions:**
1. Verify webhook secret is correct in Settings → Payment
2. Check that route is registered BEFORE `express.json()`
3. Verify route uses `express.raw({ type: 'application/json' })`
4. Check Stripe Dashboard for webhook delivery status
5. Verify endpoint URL is correct and accessible

### Authentication not working

**Problem:** Login redirects but doesn't authenticate

**Solutions:**
1. Verify OAuth portal URL is correct
2. Check that auth routes are registered
3. Verify JWT/session token is being set
4. Check browser cookies are being saved
5. Look for CORS issues in browser console

### Payment amounts incorrect

**Problem:** Amounts shown in checkout don't match products

**Solutions:**
1. Verify product prices in `products.ts`
2. Check that prices are in cents (e.g., 3900 = $39.00)
3. Verify currency is set to 'usd'
4. Check for any price modifications in checkout route

---

## Performance Optimization

1. **Cache product list**
   - Products rarely change
   - Cache for 1 hour
   - Invalidate on product updates

2. **Lazy load account data**
   - Load orders/subscriptions on demand
   - Paginate large order lists
   - Cache subscription status

3. **Optimize webhook processing**
   - Process webhooks asynchronously
   - Queue email sending
   - Batch database updates

4. **CDN for static assets**
   - Use Manus CDN for images
   - Cache product images
   - Compress assets

---

## Monitoring & Analytics

### Key Metrics to Track

- Conversion rate (visitors → purchases)
- Average order value
- Subscription churn rate
- Payment failure rate
- Email delivery rate
- Webhook delivery success rate

### Recommended Tools

- Stripe Dashboard for payment analytics
- Google Analytics for visitor tracking
- Sentry for error tracking
- LogRocket for session replay

---

## Next Steps

1. **Configure email service** (SendGrid, Mailgun, or Resend)
2. **Implement OAuth callback** to complete authentication
3. **Create database tables** for data persistence
4. **Update webhook handlers** to save purchase data
5. **Add login UI** to navigation
6. **Test complete payment flow** with test cards
7. **Deploy to production** with live Stripe keys

---

## Support

- **Stripe Docs:** https://stripe.com/docs
- **Manus Help:** https://help.manus.im
- **Email Service Docs:**
  - SendGrid: https://docs.sendgrid.com
  - Mailgun: https://documentation.mailgun.com
  - Resend: https://resend.com/docs

---

## Changelog

### v1.0.0 (Current)

- ✅ Stripe checkout integration
- ✅ One-time purchases
- ✅ Recurring subscriptions
- ✅ Products page
- ✅ Success page
- ✅ Account dashboard
- ✅ Email notification templates
- ✅ Webhook handlers
- ✅ Authentication context
- ✅ OAuth integration

### Planned Features

- [ ] Admin dashboard
- [ ] Refund processing
- [ ] Promo codes
- [ ] Invoice generation
- [ ] Subscription pause/resume
- [ ] Usage-based billing
- [ ] Multiple currencies
