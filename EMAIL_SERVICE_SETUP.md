# Email Service Configuration Guide

Your website has email notification templates ready. Choose ONE of these providers to send emails automatically.

## Option 1: SendGrid (Recommended - Free Tier Available)

**Pros:**
- Free tier: 100 emails/day
- Excellent deliverability
- Easy setup
- Great documentation

**Setup:**

1. **Create SendGrid Account**
   - Go to https://sendgrid.com/
   - Sign up for free account
   - Verify your email

2. **Get API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it "AI Automation Hub"
   - Select "Full Access"
   - Copy the key

3. **Verify Sender Email**
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Enter your email address
   - Click verification link in email

4. **Install Package**
   ```bash
   npm install @sendgrid/mail
   ```

5. **Update email.ts**
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

6. **Add Environment Variables**
   - Go to Settings → Secrets
   - Add: `SENDGRID_API_KEY` = your API key
   - Add: `SENDER_EMAIL` = your verified email

---

## Option 2: Mailgun (Free Tier Available)

**Pros:**
- Free tier: 100 emails/day
- Great for developers
- Powerful API
- Good documentation

**Setup:**

1. **Create Mailgun Account**
   - Go to https://www.mailgun.com/
   - Sign up for free account
   - Verify your email

2. **Get API Key**
   - Go to API Security → API Keys
   - Copy your Private API Key

3. **Get Domain**
   - Go to Sending → Domains
   - Add your domain or use sandbox domain
   - Copy the domain name

4. **Install Package**
   ```bash
   npm install mailgun.js
   ```

5. **Update email.ts**
   ```typescript
   import mailgun from 'mailgun.js';

   const mg = mailgun.client({
     username: 'api',
     key: process.env.MAILGUN_API_KEY,
   });

   async function sendEmail(options: EmailOptions): Promise<void> {
     await mg.messages.create(process.env.MAILGUN_DOMAIN, {
       from: `noreply@${process.env.MAILGUN_DOMAIN}`,
       to: options.to,
       subject: options.subject,
       html: options.data.emailContent,
     });
   }
   ```

6. **Add Environment Variables**
   - Go to Settings → Secrets
   - Add: `MAILGUN_API_KEY` = your API key
   - Add: `MAILGUN_DOMAIN` = your domain

---

## Option 3: Resend (Modern Alternative)

**Pros:**
- Free tier: 100 emails/day
- Built for developers
- Excellent DX
- Real-time analytics

**Setup:**

1. **Create Resend Account**
   - Go to https://resend.com/
   - Sign up for free account
   - Verify your email

2. **Get API Key**
   - Go to API Keys
   - Create new API key
   - Copy the key

3. **Verify Domain (Optional)**
   - Go to Domains
   - Add your domain
   - Follow verification steps
   - Or use default domain

4. **Install Package**
   ```bash
   npm install resend
   ```

5. **Update email.ts**
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

6. **Add Environment Variables**
   - Go to Settings → Secrets
   - Add: `RESEND_API_KEY` = your API key

---

## Email Events Configured

Your system automatically sends emails for:

1. **Order Confirmation** (`checkout.session.completed`)
   - Sent when customer completes one-time purchase
   - Includes order ID, product name, amount, date
   - Optional download link

2. **Subscription Confirmation** (`checkout.session.completed` - subscription mode)
   - Sent when customer starts subscription
   - Includes plan name, billing amount, next billing date
   - Link to manage subscription

3. **Subscription Cancelled** (`customer.subscription.deleted`)
   - Sent when subscription is cancelled
   - Includes cancellation date
   - Option to reactivate

4. **Payment Failed** (`invoice.payment_failed`)
   - Sent when payment fails
   - Includes retry date
   - Link to update payment method

---

## Testing Email Setup

### Test with SendGrid

```bash
# Install SendGrid CLI
npm install -g @sendgrid/cli

# Send test email
sendgrid mail:send \
  --to your-email@example.com \
  --from noreply@automationhub.com \
  --subject "Test Email" \
  --text "This is a test"
```

### Test with Mailgun

```bash
# Using curl
curl -s --user 'api:YOUR_API_KEY' \
  https://api.mailgun.net/v3/YOUR_DOMAIN/messages \
  -F from='noreply@automationhub.com' \
  -F to='your-email@example.com' \
  -F subject='Test Email' \
  -F text='This is a test'
```

### Test with Resend

```bash
# Using Node.js
import { Resend } from 'resend';

const resend = new Resend('YOUR_API_KEY');

await resend.emails.send({
  from: 'noreply@automationhub.com',
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<p>This is a test</p>',
});
```

---

## Troubleshooting

### Emails not sending

**Problem:** Emails configured but not arriving

**Solutions:**
1. Check API key is correct in Settings → Secrets
2. Verify sender email is authorized
3. Check spam folder
4. Look at server logs for errors
5. Test with provider's CLI/API directly

### High bounce rate

**Problem:** Many emails bouncing

**Solutions:**
1. Verify email list is clean
2. Check sender reputation
3. Ensure authentication (SPF, DKIM)
4. Use double opt-in for email signups

### Emails going to spam

**Problem:** Emails delivered but in spam folder

**Solutions:**
1. Add unsubscribe link to emails
2. Set up SPF/DKIM records
3. Use branded domain (not generic)
4. Avoid spam trigger words
5. Keep engagement rate high

---

## Scaling Beyond Free Tier

When you outgrow the free tier:

**SendGrid:**
- $19.95/month for 40,000 emails/month
- Scales to millions of emails

**Mailgun:**
- $35/month for 50,000 emails/month
- Scales to millions of emails

**Resend:**
- $20/month for unlimited emails
- Best value for high volume

---

## Email Templates

Your system includes templates for:

1. **Order Confirmation Email**
   - Professional HTML layout
   - Order details and amount
   - Download link (if applicable)
   - Support contact info

2. **Subscription Confirmation Email**
   - Subscription details
   - Billing information
   - Next billing date
   - Link to manage subscription

3. **Subscription Cancelled Email**
   - Cancellation confirmation
   - Feedback request
   - Option to reactivate

4. **Payment Failed Email**
   - Error explanation
   - Retry date
   - Link to update payment method
   - Support contact

---

## Next Steps

1. **Choose a provider** (SendGrid recommended for beginners)
2. **Create account** and get API key
3. **Install package** with npm
4. **Update email.ts** with provider code
5. **Add environment variables** in Settings → Secrets
6. **Test with test card** 4242 4242 4242 4242
7. **Verify email arrives** in your inbox

---

## Support

- **SendGrid Docs:** https://docs.sendgrid.com/
- **Mailgun Docs:** https://documentation.mailgun.com/
- **Resend Docs:** https://resend.com/docs/
- **Manus Help:** https://help.manus.im/
