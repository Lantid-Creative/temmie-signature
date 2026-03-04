import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // If webhook secret is configured, verify signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event: Stripe.Event;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Processing Stripe event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const shippingAddress = metadata.shipping_address
          ? JSON.parse(metadata.shipping_address)
          : null;
        const shippingAmount = parseFloat(metadata.shipping_amount || "0");
        const taxAmount = parseFloat(metadata.tax_amount || "0");

        const orderNum = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const subtotal = (session.amount_total || 0) / 100 - shippingAmount - taxAmount;

        // Create order
        const { data: order, error: orderError } = await supabaseAdmin
          .from("orders")
          .insert([
            {
              order_number: orderNum,
              user_id: metadata.user_id || null,
              email: session.customer_details?.email || session.customer_email || "",
              phone: shippingAddress?.phone || "",
              status: "paid",
              subtotal: subtotal,
              shipping_amount: shippingAmount,
              discount_amount: 0,
              total: (session.amount_total || 0) / 100,
              shipping_address: shippingAddress,
              billing_address: shippingAddress,
            },
          ])
          .select()
          .single();

        if (orderError) {
          console.error("Error creating order:", orderError);
          throw orderError;
        }

        console.log(`Order ${orderNum} created for session ${session.id}`);

        // Retrieve line items to create order_items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        const orderItems = lineItems.data
          .filter((item) => item.description !== "Shipping")
          .map((item) => ({
            order_id: order.id,
            product_name: item.description || "Unknown Product",
            quantity: item.quantity || 1,
            price: (item.amount_total || 0) / 100 / (item.quantity || 1),
            product_image: null,
            color: null,
            cap_size: null,
          }));

        if (orderItems.length > 0) {
          const { error: itemsError } = await supabaseAdmin
            .from("order_items")
            .insert(orderItems);

          if (itemsError) {
            console.error("Error creating order items:", itemsError);
          }
        }

        // Send confirmation email
        try {
          const emailResponse = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "order_confirmation",
                to: session.customer_details?.email || session.customer_email,
                data: {
                  name: shippingAddress
                    ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
                    : "Valued Customer",
                  orderNumber: orderNum,
                  orderDate: new Date().toLocaleDateString(),
                  total: ((session.amount_total || 0) / 100).toFixed(2),
                },
              }),
            }
          );
          console.log("Email sent:", emailResponse.status);
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }

        break;
      }

      case "checkout.session.expired": {
        console.log("Checkout session expired:", event.data.object.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
