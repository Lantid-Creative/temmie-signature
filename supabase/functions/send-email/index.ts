import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  template: string;
  data: Record<string, unknown>;
}

const getEmailTemplate = (template: string, data: Record<string, unknown>) => {
  const baseStyles = `
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f8f8; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center; }
    .logo { font-size: 28px; font-weight: bold; color: #d4af37; letter-spacing: 2px; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%); color: #1a1a2e !important; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
    .footer { background-color: #1a1a2e; color: #999; padding: 30px; text-align: center; font-size: 12px; }
    .footer a { color: #d4af37; text-decoration: none; }
    h1, h2 { color: #1a1a2e; margin: 0 0 20px; }
    .product-card { border: 1px solid #eee; border-radius: 8px; padding: 15px; margin: 10px 0; display: flex; gap: 15px; }
    .product-image { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
    .highlight { color: #d4af37; font-weight: 600; }
    .divider { border-top: 1px solid #eee; margin: 30px 0; }
  `;

  const templates: Record<string, { subject: string; html: string }> = {
    welcome: {
      subject: "Welcome to Trazzy Beauty! 💕",
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ TRAZZY BEAUTY</div>
            </div>
            <div class="content">
              <h1>Welcome to Trazzy Beauty, ${data.name || 'Beautiful'}! 💕</h1>
              <p>We're thrilled to have you join our community of confident, beautiful women who love quality wigs and hair extensions.</p>
              <p>As a new member, here's what you can look forward to:</p>
              <ul>
                <li>🎁 Exclusive member-only discounts</li>
                <li>💫 Early access to new arrivals</li>
                <li>💇‍♀️ Expert hair care tips & tutorials</li>
                <li>🚚 Free shipping on orders over $100</li>
              </ul>
              <p style="text-align: center;">
                <a href="${data.shopUrl || '#'}" class="button">Start Shopping</a>
              </p>
              <p>Questions? Our team is here to help you find the perfect look!</p>
            </div>
            <div class="footer">
              <p>© 2024 Trazzy Beauty. All rights reserved.</p>
              <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    "order-confirmation": {
      subject: `Order Confirmed! #${data.orderNumber} 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ TRAZZY BEAUTY</div>
            </div>
            <div class="content">
              <h1>Thank You for Your Order! 🎉</h1>
              <p>Hi ${data.customerName || 'there'},</p>
              <p>Your order <span class="highlight">#${data.orderNumber}</span> has been confirmed and is being prepared with care.</p>
              
              <div class="divider"></div>
              
              <h2>Order Summary</h2>
              ${(data.items as Array<{name: string; image: string; price: number; quantity: number}>)?.map((item) => `
                <div class="product-card">
                  <img src="${item.image}" alt="${item.name}" class="product-image" />
                  <div>
                    <strong>${item.name}</strong>
                    <p>Qty: ${item.quantity} × $${item.price}</p>
                  </div>
                </div>
              `).join('') || ''}
              
              <div class="divider"></div>
              
              <table style="width: 100%;">
                <tr><td>Subtotal</td><td style="text-align: right;">$${data.subtotal}</td></tr>
                <tr><td>Shipping</td><td style="text-align: right;">$${data.shipping || 'FREE'}</td></tr>
                <tr style="font-weight: bold; font-size: 18px;"><td>Total</td><td style="text-align: right;">$${data.total}</td></tr>
              </table>
              
              <p style="text-align: center;">
                <a href="${data.trackingUrl || '#'}" class="button">Track Your Order</a>
              </p>
            </div>
            <div class="footer">
              <p>Questions about your order? Reply to this email or contact us.</p>
              <p>© 2024 Trazzy Beauty. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    "order-shipped": {
      subject: `Your Order is On Its Way! 📦 #${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ TRAZZY BEAUTY</div>
            </div>
            <div class="content">
              <h1>Your Order is On Its Way! 📦</h1>
              <p>Great news, ${data.customerName || 'Beautiful'}!</p>
              <p>Your order <span class="highlight">#${data.orderNumber}</span> has been shipped and is heading your way!</p>
              
              <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Tracking Number:</strong> ${data.trackingNumber || 'N/A'}</p>
                <p><strong>Carrier:</strong> ${data.carrier || 'Standard Shipping'}</p>
                <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery || '3-5 business days'}</p>
              </div>
              
              <p style="text-align: center;">
                <a href="${data.trackingUrl || '#'}" class="button">Track Your Package</a>
              </p>
              
              <p>We can't wait for you to receive your new look! 💕</p>
            </div>
            <div class="footer">
              <p>© 2024 Trazzy Beauty. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    "abandoned-cart": {
      subject: "You Left Something Behind! 🛒",
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ TRAZZY BEAUTY</div>
            </div>
            <div class="content">
              <h1>Forgot Something? 🛒</h1>
              <p>Hi ${data.customerName || 'Beautiful'},</p>
              <p>We noticed you left some gorgeous items in your cart. They're waiting for you!</p>
              
              ${(data.items as Array<{name: string; image: string; price: number}>)?.map((item) => `
                <div class="product-card">
                  <img src="${item.image}" alt="${item.name}" class="product-image" />
                  <div>
                    <strong>${item.name}</strong>
                    <p class="highlight">$${item.price}</p>
                  </div>
                </div>
              `).join('') || ''}
              
              <p style="text-align: center;">
                <a href="${data.cartUrl || '#'}" class="button">Complete Your Order</a>
              </p>
              
              <p>🎁 <strong>Psst...</strong> Use code <span class="highlight">COMEBACK10</span> for 10% off your order!</p>
            </div>
            <div class="footer">
              <p>This is an automated reminder. Don't want these emails? <a href="#">Unsubscribe</a></p>
              <p>© 2024 Trazzy Beauty. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    "wishlist-reminder": {
      subject: "Your Wishlist is Waiting! 💖",
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ TRAZZY BEAUTY</div>
            </div>
            <div class="content">
              <h1>Your Wishlist Misses You! 💖</h1>
              <p>Hi ${data.customerName || 'Beautiful'},</p>
              <p>Just a friendly reminder that you have ${data.itemCount || 'some'} amazing items saved in your wishlist!</p>
              
              ${(data.items as Array<{name: string; image: string; price: number}>)?.slice(0, 3).map((item) => `
                <div class="product-card">
                  <img src="${item.image}" alt="${item.name}" class="product-image" />
                  <div>
                    <strong>${item.name}</strong>
                    <p class="highlight">$${item.price}</p>
                  </div>
                </div>
              `).join('') || ''}
              
              <p style="text-align: center;">
                <a href="${data.wishlistUrl || '#'}" class="button">View Wishlist</a>
              </p>
              
              <p>🔥 Items in wishlists sell out fast. Grab yours before they're gone!</p>
            </div>
            <div class="footer">
              <p>© 2024 Trazzy Beauty. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    marketing: {
      subject: data.subject as string || "Special Offer from Trazzy Beauty! 🎁",
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ TRAZZY BEAUTY</div>
              ${data.preheader ? `<p style="color: #999; font-size: 12px; margin-top: 10px;">${data.preheader}</p>` : ''}
            </div>
            <div class="content">
              <h1>${data.headline || 'Special Offer!'}</h1>
              <div style="white-space: pre-wrap;">${data.body || ''}</div>
              
              ${data.ctaText ? `
                <p style="text-align: center;">
                  <a href="${data.ctaLink || '#'}" class="button">${data.ctaText}</a>
                </p>
              ` : ''}
            </div>
            <div class="footer">
              <p><a href="#">Unsubscribe</a> | <a href="#">View in browser</a></p>
              <p>© 2024 Trazzy Beauty. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  };

  return templates[template] || templates.marketing;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, template, data }: EmailRequest = await req.json();

    console.log(`Sending ${template} email to ${to}`);

    const emailContent = getEmailTemplate(template, data);

    const { data: emailResult, error } = await resend.emails.send({
      from: "Trazzy Beauty <noreply@resend.dev>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, id: emailResult?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
