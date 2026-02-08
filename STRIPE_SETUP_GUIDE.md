# Stripe Payment Integration Setup Guide

## Overview

Your AI Automation Resource Hub now has full Stripe payment integration supporting both one-time purchases and recurring subscriptions. This guide walks you through setup, testing, and deployment.

---

## Step 1: Verify Stripe Sandbox Setup

Your Stripe sandbox is already created but not yet claimed. You must claim it to activate the test environment.

**Action Required:**
1. Visit: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU3g5REw4cmNxeThsMW5yLDE3NzA4NDg1OTQv100UR7UyQnz
2. Complete the setup process
3. Verify your email address
4. Note your **Publishable Key** and **Secret Key**

**Deadline:** Before 2026-04-05T22:23:14.000Z

---

## Step 2: Configure Stripe Keys

Once you've claimed your sandbox:

1. Go to your Manus project **Settings → Payment**
2. Enter your Stripe keys:
   - **Publishable Key:** `pk_test_...` (starts with `pk_test_`)
   - **Secret Key:** `sk_test_...` (starts with `sk_test_`)
3. Save the configuration

The webhook secret is automatically configured by Manus.

---

## Step 3: Test Payment Processing

### Test Card Numbers

Use these card numbers in the Stripe checkout to test different scenarios:

| Card Number | Scenario |
| :--- | :--- |
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0025 0000 3155 | Requires authentication |

**For all test cards:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Testing Workflow

1. **Test One-Time Purchase:**
   - Navigate to `/products`
   - Click "Buy Now" on a digital product
   - Use card `4242 4242 4242 4242`
   - Verify success page appears
   - Check email for confirmation

2. **Test Subscription:**
   - Navigate to `/products`
   - Click "Subscribe Now" on a membership plan
   - Use card `4242 4242 4242 4242`
   - Verify success page appears
   - Check Stripe dashboard for subscription

3. **Test Webhook:**
   - Stripe automatically sends webhooks to `/api/stripe/webhook`
   - Check Stripe Dashboard → Developers → Webhooks for delivery status
   - Verify events are being received and processed

---

## Step 4: Understand the Payment Flow

### One-Time Purchase Flow

```
User clicks "Buy Now"
    ↓
Frontend calls POST /api/stripe/checkout
    ↓
Backend creates Stripe Checkout Session
    ↓
User redirected to Stripe Checkout
    ↓
User completes payment
    ↓
Stripe sends webhook: checkout.session.completed
    ↓
Backend processes order (TODO: implement fulfillment)
    ↓
User redirected to /success page
```

### Subscription Flow

```
User clicks "Subscribe Now"
    ↓
Frontend calls POST /api/stripe/checkout
    ↓
Backend creates Stripe Checkout Session (mode: subscription)
    ↓
User redirected to Stripe Checkout
    ↓
User completes payment
    ↓
Stripe creates subscription
    ↓
Stripe sends webhook: checkout.session.completed
    ↓
Stripe sends webhook: customer.subscription.created
    ↓
Backend processes subscription (TODO: implement access grant)
    ↓
User redirected to /success page
```

---

## Step 5: Implement Webhook Handlers

The webhook endpoint is already created at `/api/stripe/webhook`. You need to implement the TODO sections:

### Key Events to Handle

**checkout.session.completed**
- Extract user ID and product ID from metadata
- Record purchase in database
- For one-time: Grant product access
- For subscription: Create subscription record
- Send confirmation email

**invoice.paid**
- Update subscription status
- Send payment receipt
- Grant/renew access for billing period

**customer.subscription.deleted**
- Update subscription status to cancelled
- Revoke premium access
- Send cancellation confirmation

**charge.refunded**
- Update order status to refunded
- Revoke product access if applicable
- Send refund confirmation

---

## Step 6: Database Schema (Optional)

If you want to track purchases locally, create these tables:

```sql
-- Users table (add to existing)
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);

-- Purchases table
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  product_id VARCHAR(255) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Step 7: Go Live with Production Keys

When you're ready to accept real payments:

1. **Complete Stripe KYC (Know Your Customer):**
   - Go to Stripe Dashboard → Settings → Account
   - Complete identity verification
   - Provide business information
   - Wait for approval (usually 1-2 days)

2. **Get Production Keys:**
   - Once approved, you'll receive production keys
   - Publishable Key: `pk_live_...`
   - Secret Key: `sk_live_...`

3. **Update Manus Settings:**
   - Go to Settings → Payment
   - Replace test keys with production keys
   - Verify webhook secret is updated

4. **Test with Real Payments:**
   - Use a real card with a small amount
   - Verify transaction appears in Stripe Dashboard
   - Confirm webhook events are processed

---

## Step 8: Monitor and Troubleshoot

### Check Webhook Status

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on the webhook endpoint
3. View recent events and their delivery status
4. Check response codes:
   - `200` = Success
   - `400` = Bad request (check webhook handler)
   - `500` = Server error (check logs)

### Common Issues

**Webhook not receiving events:**
- Verify webhook secret is correct in Settings → Payment
- Check that `/api/stripe/webhook` route is registered BEFORE `express.json()`
- Ensure route uses `express.raw({ type: 'application/json' })`

**Checkout session creation fails:**
- Verify Stripe keys are correct
- Check that user is authenticated
- Verify product ID exists in products.ts

**Payment succeeds but no confirmation email:**
- Implement email sending in webhook handler
- Use your email service (SendGrid, Mailgun, etc.)

---

## Step 9: Email Notifications (TODO)

Add email notifications for key events:

```typescript
// In webhook handler
case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session;
  
  // Send confirmation email
  await sendEmail({
    to: session.customer_email,
    subject: 'Order Confirmation',
    template: 'order-confirmation',
    data: {
      orderId: session.id,
      amount: session.amount_total,
      downloadLink: generateDownloadLink(productId),
    },
  });
  
  break;
}
```

---

## Step 10: Security Best Practices

1. **Never log sensitive data:**
   - Don't log full card numbers
   - Don't log API keys or secrets
   - Don't log webhook payloads with sensitive info

2. **Always verify webhook signatures:**
   - Use `stripe.webhooks.constructEvent()`
   - Never trust webhook data without verification

3. **Use HTTPS only:**
   - Stripe requires HTTPS for all communications
   - Manus automatically provides SSL

4. **Rotate secrets regularly:**
   - Generate new webhook secrets periodically
   - Update in Settings → Payment

5. **Rate limit checkout endpoint:**
   - Prevent abuse by limiting checkout session creation
   - Implement rate limiting middleware

---

## Pricing & Fees

- **Stripe Processing Fee:** 2.9% + $0.30 per transaction
- **Minimum Transaction:** $0.50 USD
- **No setup fees or monthly fees**

Example:
- $39.00 product → Stripe fee: $1.43 → You receive: $37.57
- $299.00/year subscription → Stripe fee: $9.97 → You receive: $289.03

---

## Support Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Webhook Events:** https://stripe.com/docs/api/events
- **Testing Guide:** https://stripe.com/docs/testing
- **Manus Support:** https://help.manus.im

---

## Checklist

- [ ] Claim Stripe sandbox
- [ ] Configure Stripe keys in Settings → Payment
- [ ] Test one-time purchase with 4242 4242 4242 4242
- [ ] Test subscription with 4242 4242 4242 4242
- [ ] Verify webhook events in Stripe Dashboard
- [ ] Implement webhook handlers (checkout.session.completed, etc.)
- [ ] Add email notifications
- [ ] Test with test card 4000 0000 0000 0002 (decline scenario)
- [ ] Complete Stripe KYC verification
- [ ] Switch to production keys
- [ ] Test with real payment
- [ ] Monitor webhook delivery and errors

---

## Next Steps

1. **Claim your Stripe sandbox** (link above)
2. **Configure keys** in Settings → Payment
3. **Test the payment flow** using test cards
4. **Implement webhook handlers** to process orders
5. **Add email notifications** for customers
6. **Go live** with production keys after KYC verification
