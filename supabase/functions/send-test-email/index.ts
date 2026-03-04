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
      from: "Trazzie <onboarding@resend.dev>",
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

interface TestEmailRequest {
  templateType: string;
  toEmail: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateType, toEmail }: TestEmailRequest = await req.json();

    const testData = {
      name: "Test User",
      orderNumber: "TEST-12345",
      orderDate: new Date().toLocaleDateString(),
      total: "299.99",
      shopUrl: "https://trazzie.com/shop",
      cartUrl: "https://trazzie.com/cart",
      wishlistUrl: "https://trazzie.com/wishlist",
      trackingUrl: "https://trazzie.com/account",
      trackingNumber: "1Z999AA10123456784",
      carrier: "UPS",
      estimatedDelivery: "January 25, 2026",
      resetUrl: "https://trazzie.com/reset-password?token=test",
    };

    const subject = `[TEST] ${templateType.replace(/_/g, ' ').toUpperCase()} Email — Trazzie`;
    const html = `
      <!DOCTYPE html><html><head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #2d2d2d; margin: 0; padding: 0; background-color: #f5f0eb; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 48px 30px; text-align: center; }
          .logo { font-size: 32px; font-weight: 700; color: #d4af37; letter-spacing: 3px; font-family: Georgia, 'Times New Roman', serif; }
          .content { padding: 48px 36px; }
          .footer { background: #1a1a2e; color: rgba(255,255,255,0.5); padding: 36px; text-align: center; font-size: 12px; }
          h1 { font-family: Georgia, 'Times New Roman', serif; color: #1a1a2e; font-size: 24px; }
          pre { background: #faf8f5; border: 1px solid #ebe6de; padding: 16px; border-radius: 8px; overflow: auto; font-size: 12px; }
        </style>
      </head><body>
        <div class="container">
          <div class="header">
            <div class="logo">TRAZZIE✦</div>
            <p style="color: #ff6b6b; font-size: 12px; margin-top: 8px;">⚠️ TEST EMAIL</p>
          </div>
          <div class="content">
            <h1>Test: ${templateType.replace(/_/g, ' ')}</h1>
            <p style="color: #555;">This is a test email for the <strong>${templateType}</strong> template.</p>
            <p style="color: #888; font-size: 13px;">Test data used:</p>
            <pre>${JSON.stringify(testData, null, 2)}</pre>
          </div>
          <div class="footer">
            <p>This is a test email from Trazzie Admin</p>
          </div>
        </div>
      </body></html>
    `;

    const data = await sendEmail([toEmail], subject, html);
    console.log("Test email sent:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending test email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
