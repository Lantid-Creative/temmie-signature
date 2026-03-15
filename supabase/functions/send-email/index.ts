import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Temmie Signature <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send email");
  }

  return response.json();
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "welcome" | "order_confirmation" | "shipping_update" | "abandoned_cart" | "wishlist_reminder" | "password_reset" | "custom";
  to: string;
  data?: Record<string, unknown>;
  subject?: string;
  html?: string;
}

const baseStyles = `
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #2d2d2d; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: #0d0d0d; padding: 48px 30px; text-align: center; }
    .logo { font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 3px; font-family: Georgia, 'Times New Roman', serif; }
    .tagline { color: rgba(255,255,255,0.6); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }
    .content { padding: 48px 36px; }
    .greeting { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
    .button { display: inline-block; background: #c42020; color: #ffffff !important; text-decoration: none; padding: 16px 36px; border-radius: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-size: 13px; }
    .button:hover { opacity: 0.9; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #e5e5e5, transparent); margin: 32px 0; }
    .info-box { background: #fafafa; border: 1px solid #eee; padding: 24px; border-radius: 8px; margin: 24px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #888; font-size: 13px; font-weight: 500; }
    .info-value { color: #0d0d0d; font-size: 14px; font-weight: 600; }
    .footer { background: #0d0d0d; color: rgba(255,255,255,0.5); padding: 36px; text-align: center; font-size: 12px; line-height: 1.8; }
    .footer a { color: #c42020; text-decoration: none; }
    .social-links { margin: 16px 0; }
    .social-links a { display: inline-block; margin: 0 8px; color: #c42020; text-decoration: none; font-size: 13px; }
    h1 { font-family: Georgia, 'Times New Roman', serif; color: #0d0d0d; margin: 0 0 20px; font-size: 28px; font-weight: 600; line-height: 1.3; }
    h2 { font-family: Georgia, 'Times New Roman', serif; color: #0d0d0d; margin: 0 0 16px; font-size: 20px; }
    p { color: #555; font-size: 15px; margin: 0 0 16px; }
    .highlight { background: #fff5f5; border-left: 3px solid #c42020; padding: 16px 20px; border-radius: 0 6px 6px 0; margin: 20px 0; }
    .feature-grid { display: table; width: 100%; margin: 20px 0; }
    .feature-item { display: table-cell; text-align: center; padding: 16px 8px; width: 25%; }
    .feature-icon { font-size: 24px; margin-bottom: 8px; }
    .feature-text { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
  </style>
`;

const headerHtml = `
  <div class="header">
    <div class="logo">TEMMIE SIGNATURE</div>
    <div class="tagline">Best Feet, Best Fits</div>
  </div>
`;

const footerHtml = `
  <div class="footer">
    <div class="social-links">
      <a href="#">Instagram</a> · <a href="#">Facebook</a>
    </div>
    <p style="margin: 12px 0 0;">Questions? Email us at <a href="mailto:hello@temmiesignature.com">hello@temmiesignature.com</a></p>
    <p style="margin: 16px 0 0; opacity: 0.6;"><a href="#">Unsubscribe</a> · <a href="#">View in browser</a></p>
    <p style="margin: 12px 0 0; opacity: 0.4;">© ${new Date().getFullYear()} Temmie Signature. All rights reserved.</p>
  </div>
`;

const getEmailTemplate = (type: string, data: Record<string, unknown> = {}) => {
  const templates: Record<string, { subject: string; html: string }> = {
    welcome: {
      subject: "Welcome to Temmie Signature! ✨ Your fashion journey starts here",
      html: `
        <!DOCTYPE html><html><head>${baseStyles}</head><body>
        <div class="container">
          ${headerHtml}
          <div class="content">
            <p class="greeting">Welcome to the family</p>
            <h1>Hey ${data.name || "there"}, we're so glad you're here!</h1>
            <p>You've just joined a community of stylish, confident men who know that great fashion changes everything. At Temmie Signature, we craft premium fashion pieces so you can look and feel your absolute best.</p>
            
            <div class="highlight">
              <p style="margin: 0; font-weight: 600; color: #0d0d0d;">🎁 Your Welcome Gift</p>
              <p style="margin: 8px 0 0;">Use code <strong style="color: #c42020; font-size: 18px;">WELCOME15</strong> for 15% off your first order!</p>
            </div>

            <div class="feature-grid">
              <div class="feature-item"><div class="feature-icon">✨</div><div class="feature-text">Premium Fashion</div></div>
              <div class="feature-item"><div class="feature-icon">🚚</div><div class="feature-text">Worldwide Shipping</div></div>
              <div class="feature-item"><div class="feature-icon">↩️</div><div class="feature-text">Easy Returns</div></div>
              <div class="feature-item"><div class="feature-icon">💎</div><div class="feature-text">Quality Guaranteed</div></div>
            </div>

            <p style="text-align: center; margin: 36px 0 16px;">
              <a href="${data.shopUrl || 'https://temmiesignature.com/shop'}" class="button">Start Shopping</a>
            </p>
          </div>
          ${footerHtml}
        </div>
        </body></html>
      `,
    },

    order_confirmation: {
      subject: `Order Confirmed! 🎉 Your Temmie Signature order #${data.orderNumber || ''} is being prepared`,
      html: `
        <!DOCTYPE html><html><head>${baseStyles}</head><body>
        <div class="container">
          ${headerHtml}
          <div class="content">
            <p class="greeting">Order confirmed</p>
            <h1>Thank you for your order, ${data.name || 'there'}!</h1>
            <p>We've received your order and our team is already preparing your items with care. You'll receive a shipping confirmation email with tracking details once your order is on its way.</p>
            
            <div class="info-box">
              <h2 style="margin-bottom: 16px;">Order Summary</h2>
              <div class="info-row">
                <span class="info-label">Order Number</span>
                <span class="info-value">#${data.orderNumber || ''}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Date</span>
                <span class="info-value">${data.orderDate || new Date().toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Total</span>
                <span class="info-value" style="color: #c42020; font-size: 18px;">₦${data.total || '0'}</span>
              </div>
            </div>

            <p style="text-align: center; margin: 36px 0 16px;">
              <a href="${data.trackingUrl || 'https://temmiesignature.com/account'}" class="button">View Your Order</a>
            </p>
            
            <div class="divider"></div>
            <p style="font-size: 13px; color: #999; text-align: center;">Need to make changes? Contact us at <a href="mailto:hello@temmiesignature.com" style="color: #c42020;">hello@temmiesignature.com</a></p>
          </div>
          ${footerHtml}
        </div>
        </body></html>
      `,
    },

    shipping_update: {
      subject: `Your Temmie Signature order is on its way! 📦 Track your package`,
      html: `
        <!DOCTYPE html><html><head>${baseStyles}</head><body>
        <div class="container">
          ${headerHtml}
          <div class="content">
            <p class="greeting">Shipping update</p>
            <h1>Your order has shipped! 🎉</h1>
            <p>Great news, ${data.name || 'there'}! Your order <strong>#${data.orderNumber || ''}</strong> is on its way to you. Here are your tracking details:</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Tracking Number</span>
                <span class="info-value">${data.trackingNumber || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Carrier</span>
                <span class="info-value">${data.carrier || 'Standard Shipping'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estimated Delivery</span>
                <span class="info-value" style="color: #c42020;">${data.estimatedDelivery || '3-5 business days'}</span>
              </div>
            </div>

            <p style="text-align: center; margin: 36px 0 16px;">
              <a href="${data.trackingUrl || '#'}" class="button">Track Your Package</a>
            </p>
          </div>
          ${footerHtml}
        </div>
        </body></html>
      `,
    },

    abandoned_cart: {
      subject: "Still thinking about it? Your cart is waiting 🛒",
      html: `
        <!DOCTYPE html><html><head>${baseStyles}</head><body>
        <div class="container">
          ${headerHtml}
          <div class="content">
            <p class="greeting">Don't forget</p>
            <h1>Your perfect style is just one click away</h1>
            <p>Hey ${data.name || 'there'}, we noticed you left some items in your cart. They're still waiting for you!</p>
            
            <div class="highlight">
              <p style="margin: 0; font-weight: 600; color: #0d0d0d;">🎁 Special Offer Just for You</p>
              <p style="margin: 8px 0 0;">Complete your order now and get <strong style="color: #c42020; font-size: 18px;">10% OFF</strong> with code: <strong>COMEBACK10</strong></p>
            </div>

            <p style="text-align: center; margin: 36px 0 16px;">
              <a href="${data.cartUrl || 'https://temmiesignature.com/cart'}" class="button">Complete Your Order</a>
            </p>
            
            <div class="divider"></div>
            <p style="font-size: 13px; color: #999; text-align: center;">⏰ This offer expires in 24 hours</p>
          </div>
          ${footerHtml}
        </div>
        </body></html>
      `,
    },

    wishlist_reminder: {
      subject: "Your wishlist items are calling! 💫",
      html: `
        <!DOCTYPE html><html><head>${baseStyles}</head><body>
        <div class="container">
          ${headerHtml}
          <div class="content">
            <p class="greeting">Wishlist reminder</p>
            <h1>Your saved favorites are still available!</h1>
            <p>Hey ${data.name || 'there'}, the items you've been eyeing on your wishlist are still in stock — but they might not be around for long.</p>
            
            <p>Treat yourself today. You deserve it. ✨</p>

            <p style="text-align: center; margin: 36px 0 16px;">
              <a href="${data.wishlistUrl || 'https://temmiesignature.com/wishlist'}" class="button">View Your Wishlist</a>
            </p>
          </div>
          ${footerHtml}
        </div>
        </body></html>
      `,
    },

    password_reset: {
      subject: "Reset your Temmie Signature password",
      html: `
        <!DOCTYPE html><html><head>${baseStyles}</head><body>
        <div class="container">
          ${headerHtml}
          <div class="content">
            <p class="greeting">Password reset</p>
            <h1>Let's get you back in</h1>
            <p>Hi ${data.name || 'there'}, we received a request to reset your account password. Click the button below to create a new one.</p>
            
            <p style="text-align: center; margin: 36px 0 16px;">
              <a href="${data.resetUrl || '#'}" class="button">Reset Password</a>
            </p>
            
            <div class="divider"></div>
            <p style="font-size: 13px; color: #999;">If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>
          </div>
          ${footerHtml}
        </div>
        </body></html>
      `,
    },
  };

  return templates[type] || { subject: "Message from Temmie Signature", html: "" };
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();

    let subject = emailRequest.subject;
    let html = emailRequest.html;

    if (emailRequest.type !== "custom") {
      const template = getEmailTemplate(emailRequest.type, emailRequest.data);
      subject = subject || template.subject;
      html = html || template.html;
    }

    if (!subject || !html) {
      throw new Error("Subject and HTML content are required");
    }

    const emailResult = await sendEmail([emailRequest.to], subject, html);
    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});