/**
 * Email notification service
 * Handles sending transactional emails for orders, subscriptions, and confirmations
 */

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  productName: string;
  amount: number;
  downloadLink?: string;
  date: string;
}

interface SubscriptionConfirmationData {
  customerId: string;
  customerName: string;
  productName: string;
  amount: number;
  interval: string;
  nextBillingDate: string;
}

interface SubscriptionCancelledData {
  customerName: string;
  productName: string;
  cancelledDate: string;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  email: string,
  data: OrderConfirmationData
): Promise<void> {
  const emailContent = generateOrderConfirmationEmail(data);

  await sendEmail({
    to: email,
    subject: `Order Confirmation - ${data.orderId}`,
    template: 'order-confirmation',
    data: {
      ...data,
      emailContent,
    },
  });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmation(
  email: string,
  data: SubscriptionConfirmationData
): Promise<void> {
  const emailContent = generateSubscriptionConfirmationEmail(data);

  await sendEmail({
    to: email,
    subject: `Subscription Confirmed - ${data.productName}`,
    template: 'subscription-confirmation',
    data: {
      ...data,
      emailContent,
    },
  });
}

/**
 * Send subscription cancelled email
 */
export async function sendSubscriptionCancelled(
  email: string,
  data: SubscriptionCancelledData
): Promise<void> {
  const emailContent = generateSubscriptionCancelledEmail(data);

  await sendEmail({
    to: email,
    subject: `Subscription Cancelled - ${data.productName}`,
    template: 'subscription-cancelled',
    data: {
      ...data,
      emailContent,
    },
  });
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailed(
  email: string,
  data: {
    customerName: string;
    amount: number;
    retryDate: string;
  }
): Promise<void> {
  const emailContent = generatePaymentFailedEmail(data);

  await sendEmail({
    to: email,
    subject: 'Payment Failed - Action Required',
    template: 'payment-failed',
    data: {
      ...data,
      emailContent,
    },
  });
}

/**
 * Core email sending function
 * TODO: Integrate with email service provider (SendGrid, Mailgun, Resend, etc.)
 */
async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    console.log(`[Email] Sending ${options.template} to ${options.to}`);
    console.log(`[Email] Subject: ${options.subject}`);
    console.log(`[Email] Data:`, options.data);

    // TODO: Implement actual email sending
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: options.to,
    //   from: process.env.SENDER_EMAIL || 'noreply@automationhub.com',
    //   subject: options.subject,
    //   html: options.data.emailContent,
    // });

    // Example with Mailgun:
    // const mailgun = require('mailgun.js');
    // const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    // await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    //   from: `noreply@automationhub.com`,
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.data.emailContent,
    // });

    // For now, just log the email
    console.log(`[Email] Email would be sent (not configured yet)`);
  } catch (error) {
    console.error(`[Email] Failed to send email:`, error);
    throw error;
  }
}

/**
 * Email template generators
 */

function generateOrderConfirmationEmail(data: OrderConfirmationData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Order Confirmation</h2>
          <p>Hi ${data.customerName},</p>
          <p>Thank you for your purchase! Your order has been confirmed.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Product:</strong> ${data.productName}</p>
            <p><strong>Amount:</strong> $${(data.amount / 100).toFixed(2)}</p>
            <p><strong>Date:</strong> ${data.date}</p>
          </div>

          ${
            data.downloadLink
              ? `<p><a href="${data.downloadLink}" style="background-color: #0066CC; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Your Product</a></p>`
              : ''
          }

          <p>If you have any questions, please don't hesitate to contact us at support@automationhub.com</p>
          
          <p>Best regards,<br/>The AI Automation Hub Team</p>
        </div>
      </body>
    </html>
  `;
}

function generateSubscriptionConfirmationEmail(data: SubscriptionConfirmationData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Subscription Confirmed</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your subscription has been successfully activated!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0;">Subscription Details</h3>
            <p><strong>Plan:</strong> ${data.productName}</p>
            <p><strong>Billing Amount:</strong> $${(data.amount / 100).toFixed(2)}/${data.interval}</p>
            <p><strong>Next Billing Date:</strong> ${data.nextBillingDate}</p>
          </div>

          <p>You now have access to all premium features. Log in to your account to get started.</p>
          
          <p>You can manage your subscription anytime from your account settings.</p>
          
          <p>If you have any questions, please don't hesitate to contact us at support@automationhub.com</p>
          
          <p>Best regards,<br/>The AI Automation Hub Team</p>
        </div>
      </body>
    </html>
  `;
}

function generateSubscriptionCancelledEmail(data: SubscriptionCancelledData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Subscription Cancelled</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your subscription has been cancelled as requested.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0;">Cancellation Details</h3>
            <p><strong>Plan:</strong> ${data.productName}</p>
            <p><strong>Cancelled Date:</strong> ${data.cancelledDate}</p>
          </div>

          <p>You will lose access to premium features at the end of your current billing period.</p>
          
          <p>If you'd like to reactivate your subscription, you can do so anytime from your account settings.</p>
          
          <p>We'd love to hear your feedback. If there's anything we can improve, please let us know at support@automationhub.com</p>
          
          <p>Best regards,<br/>The AI Automation Hub Team</p>
        </div>
      </body>
    </html>
  `;
}

function generatePaymentFailedEmail(data: {
  customerName: string;
  amount: number;
  retryDate: string;
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Payment Failed</h2>
          <p>Hi ${data.customerName},</p>
          <p>We were unable to process your payment. Please update your payment method to continue your subscription.</p>
          
          <div style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0;">Action Required</h3>
            <p><strong>Amount:</strong> $${(data.amount / 100).toFixed(2)}</p>
            <p><strong>Retry Date:</strong> ${data.retryDate}</p>
            <p>We'll automatically retry your payment on the date above. To update your payment method now, log in to your account.</p>
          </div>

          <p>If you have any questions or need assistance, please contact us at support@automationhub.com</p>
          
          <p>Best regards,<br/>The AI Automation Hub Team</p>
        </div>
      </body>
    </html>
  `;
}
