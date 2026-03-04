import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

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

interface MarketingEmailRequest {
  subject: string;
  preheader?: string;
  headline: string;
  body: string;
  ctaText?: string;
  ctaLink?: string;
  audience: "all" | "customers" | "cart-abandoners" | "wishlist-users";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabaseAdmin.auth.getClaims(token);
    if (claimsError || !claims?.claims) throw new Error("Unauthorized");

    const userId = claims.claims.sub as string;
    const { data: roleData } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").single();
    if (!roleData) throw new Error("Only admins can send marketing emails");

    const emailData: MarketingEmailRequest = await req.json();
    console.log(`Sending marketing email to audience: ${emailData.audience}`);

    const { data: profiles, error: profilesError } = await supabaseAdmin.from("profiles").select("user_id");
    if (profilesError) throw profilesError;

    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    const profileUserIds = new Set(profiles?.map(p => p.user_id) || []);
    const recipientEmails = users
      .filter(u => profileUserIds.has(u.id))
      .map(u => u.email)
      .filter((email): email is string => !!email);

    console.log(`Sending to ${recipientEmails.length} recipients`);

    if (recipientEmails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No recipients found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const batchSize = 50;
    let sentCount = 0;
    let errorCount = 0;

    for (let i = 0; i < recipientEmails.length; i += batchSize) {
      const batch = recipientEmails.slice(i, i + batchSize);

      const html = `
        <!DOCTYPE html><html><head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #2d2d2d; margin: 0; padding: 0; background-color: #f5f0eb; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 48px 30px; text-align: center; }
            .logo { font-size: 32px; font-weight: 700; color: #d4af37; letter-spacing: 3px; font-family: Georgia, 'Times New Roman', serif; }
            .tagline { color: rgba(255,255,255,0.6); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }
            .content { padding: 48px 36px; }
            .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #c49b2a 100%); color: #1a1a2e !important; text-decoration: none; padding: 16px 36px; border-radius: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-size: 13px; }
            .footer { background: #1a1a2e; color: rgba(255,255,255,0.5); padding: 36px; text-align: center; font-size: 12px; }
            .footer a { color: #d4af37; text-decoration: none; }
            h1 { font-family: Georgia, 'Times New Roman', serif; color: #1a1a2e; margin: 0 0 20px; font-size: 28px; }
            p { color: #555; font-size: 15px; }
          </style>
        </head><body>
          <div class="container">
            <div class="header">
              <div class="logo">TRAZZIE✦</div>
              <div class="tagline">Premium Hair & Beauty</div>
              ${emailData.preheader ? `<p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 10px;">${emailData.preheader}</p>` : ''}
            </div>
            <div class="content">
              <h1>${emailData.headline}</h1>
              <div style="white-space: pre-wrap; color: #555; font-size: 15px; line-height: 1.7;">${emailData.body}</div>
              ${emailData.ctaText ? `
                <p style="text-align: center; margin: 36px 0;">
                  <a href="${emailData.ctaLink || 'https://trazzie.com'}" class="button">${emailData.ctaText}</a>
                </p>
              ` : ''}
            </div>
            <div class="footer">
              <p>Questions? Email us at <a href="mailto:hello@trazzie.com">hello@trazzie.com</a></p>
              <p style="margin-top: 12px;"><a href="#">Unsubscribe</a> · <a href="#">View in browser</a></p>
              <p style="margin-top: 8px; opacity: 0.4;">© ${new Date().getFullYear()} Trazzie. All rights reserved.</p>
            </div>
          </div>
        </body></html>
      `;

      for (const email of batch) {
        try {
          await sendEmail([email], emailData.subject, html);
          sentCount++;
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err);
          errorCount++;
        }
      }
    }

    console.log(`Marketing email campaign complete. Sent: ${sentCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, errors: errorCount }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending marketing email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
