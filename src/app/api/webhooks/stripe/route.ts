import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

// Point Stripe's webhook (Dashboard → Developers → Webhooks) at
// https://yourdomain.com/api/webhooks/stripe, subscribed to
// checkout.session.completed. Add the signing secret it gives you as
// STRIPE_WEBHOOK_SECRET in .env.local / your host's env vars.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await createOrderFromSession(session);
  }

  return NextResponse.json({ received: true });
}

async function createOrderFromSession(session: Stripe.Checkout.Session) {
  const meta = session.metadata;
  if (!meta?.cart) return;

  const cart: { p: string; n: string; s: string; f: string; u: number; q: number }[] = JSON.parse(meta.cart);
  const subtotal = Number(meta.subtotal ?? 0);
  const deliveryFee = Number(meta.deliveryFee ?? 0);

  const supabase = createAdminClient();

  // Idempotency: Stripe can retry webhook delivery — don't double-create.
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing) return;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: meta.userId || null,
      status: "confirmed",
      subtotal,
      delivery_fee: deliveryFee,
      total: subtotal + deliveryFee,
      delivery_address: meta.deliveryAddress ?? "",
      phone: meta.phone ?? "",
      delivery_instructions: meta.deliveryInstructions || null,
      stripe_session_id: session.id,
      payment_confirmed: true,
    })
    .select()
    .single();

  if (error || !order) {
    console.error("Failed to create order from Stripe session", error);
    return;
  }

  await supabase.from("order_items").insert(
    cart.map((item) => ({
      order_id: order.id,
      product_id: item.p || null,
      name: item.n,
      size: item.s || null,
      flavour: item.f || null,
      unit_price: item.u,
      quantity: item.q,
    }))
  );

  // TODO: send order confirmation notification here (email/SMS) —
  // see README "Next steps".
}
