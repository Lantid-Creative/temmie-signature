import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      throw new Error("Only admins can send marketing emails");
    }

    const emailData: MarketingEmailRequest = await req.json();

    console.log(`Sending marketing email to audience: ${emailData.audience}`);

    // Get recipient emails based on audience
    // For now, we'll get all users from profiles
    // In production, you'd want a proper email subscription table
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("user_id");

    if (profilesError) {
      throw profilesError;
    }

    // Get user emails from auth.users (admin only)
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }

    const profileUserIds = new Set(profiles?.map(p => p.user_id) || []);
    const recipientEmails = users
      .filter(u => profileUserIds.has(u.id))
      .map(u => u.email)
      .filter((email): email is string => !!email);

    console.log(`Sending to ${recipientEmails.length} recipients`);

    if (recipientEmails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No recipients found" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send emails in batches
    const batchSize = 50;
    let sentCount = 0;
    let errorCount = 0;

    for (let i = 0; i < recipientEmails.length; i += batchSize) {
      const batch = recipientEmails.slice(i, i + batchSize);
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f8f8; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; color: #d4af37; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%); color: #1a1a2e !important; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
            .footer { background-color: #1a1a2e; color: #999; padding: 30px; text-align: center; font-size: 12px; }
            .footer a { color: #d4af37; text-decoration: none; }
            h1 { color: #1a1a2e; margin: 0 0 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ TRAZZY BEAUTY</div>
              ${emailData.preheader ? `<p style="color: #999; font-size: 12px; margin-top: 10px;">${emailData.preheader}</p>` : ''}
            </div>
            <div class="content">
              <h1>${emailData.headline}</h1>
              <div style="white-space: pre-wrap;">${emailData.body}</div>
              ${emailData.ctaText ? `
                <p style="text-align: center;">
                  <a href="${emailData.ctaLink || '#'}" class="button">${emailData.ctaText}</a>
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
      `;

      for (const email of batch) {
        try {
          await resend.emails.send({
            from: "Trazzy Beauty <noreply@resend.dev>",
            to: [email],
            subject: emailData.subject,
            html,
          });
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
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending marketing email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
