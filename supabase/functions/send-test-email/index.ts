import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { templateId } = await req.json();

    console.log(`Sending test email for template: ${templateId} to ${user.email}`);

    // Sample data for each template
    const sampleData: Record<string, Record<string, unknown>> = {
      welcome: {
        name: "Test User",
        shopUrl: "https://trazzybeauty.com/shop",
      },
      "order-confirmation": {
        orderNumber: "TRZ-12345",
        customerName: "Test User",
        items: [
          { name: "Brazilian Body Wave Wig", image: "https://via.placeholder.com/80", price: 299.99, quantity: 1 },
          { name: "Lace Front Closure", image: "https://via.placeholder.com/80", price: 89.99, quantity: 2 },
        ],
        subtotal: "479.97",
        shipping: "FREE",
        total: "479.97",
        trackingUrl: "https://trazzybeauty.com/orders/TRZ-12345",
      },
      "order-shipped": {
        orderNumber: "TRZ-12345",
        customerName: "Test User",
        trackingNumber: "1Z999AA10123456784",
        carrier: "UPS",
        estimatedDelivery: "March 15-17, 2024",
        trackingUrl: "https://ups.com/track/1Z999AA10123456784",
      },
      "abandoned-cart": {
        customerName: "Test User",
        items: [
          { name: "HD Lace Wig 24\"", image: "https://via.placeholder.com/80", price: 359.99 },
        ],
        cartUrl: "https://trazzybeauty.com/cart",
      },
      "wishlist-reminder": {
        customerName: "Test User",
        itemCount: 5,
        items: [
          { name: "Kinky Curly Wig", image: "https://via.placeholder.com/80", price: 279.99 },
          { name: "Straight Bob Wig", image: "https://via.placeholder.com/80", price: 199.99 },
        ],
        wishlistUrl: "https://trazzybeauty.com/wishlist",
      },
    };

    const data = sampleData[templateId] || {};
    
    // Call the main send-email function internally
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        to: user.email,
        template: templateId,
        data,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send test email: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: `Test email sent to ${user.email}` }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending test email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
