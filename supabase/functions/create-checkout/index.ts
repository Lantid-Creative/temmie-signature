import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, shippingAddress, shipping, tax, discount, couponId } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    const email = shippingAddress?.email;

    // Build line items from cart
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product_name,
          images: item.product_image ? [item.product_image] : [],
          metadata: {
            color: item.color || "",
            cap_size: item.cap_size || "",
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            images: [],
            metadata: {},
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
            images: [],
            metadata: {},
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") || "https://temmiesignature.com";

    // Build session params
    const sessionParams: any = {
      customer_email: email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?status=cancelled`,
      metadata: {
        shipping_address: JSON.stringify(shippingAddress),
        shipping_amount: shipping.toString(),
        tax_amount: tax.toString(),
        discount_amount: (discount || 0).toString(),
        coupon_id: couponId || "",
      },
    };

    // Apply discount as a coupon in Stripe
    if (discount && discount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: "usd",
        duration: "once",
        name: "Temmie Signature Discount",
      });
      sessionParams.discounts = [{ coupon: stripeCoupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
