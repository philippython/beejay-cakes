import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

type CheckoutItem = {
  productId: string;
  name: string;
  size: string;
  flavour: string;
  unitPrice: number;
  quantity: number;
};

type CheckoutBody = {
  items: CheckoutItem[];
  deliveryFee: number;
  deliveryAddress: string;
  phone: string;
  deliveryInstructions?: string;
  userId?: string;
  customerEmail?: string;
};

// Creates a Stripe Checkout Session for the cart and returns its URL. The
// client redirects the browser there to complete payment. The order isn't
// written to the database yet at this point — that happens in
// /api/webhooks/stripe once Stripe confirms the payment actually went
// through, using the details packed into this session's metadata.
export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!body.deliveryAddress || !body.phone) {
      return NextResponse.json({ error: "Delivery address and phone are required" }, { status: 400 });
    }

    const stripe = getStripe();

    const line_items = body.items.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));

    if (body.deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: { name: "Delivery fee" },
          unit_amount: Math.round(body.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const subtotal = body.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    // Stripe metadata values are capped at 500 chars — fine for a small
    // cart. A very large order could exceed this; see README for the
    // note on moving to a `pending_orders` staging table if that matters
    // for your catalogue.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: body.customerEmail,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        cart: JSON.stringify(
          body.items.map((i) => ({
            p: i.productId,
            n: i.name,
            s: i.size,
            f: i.flavour,
            u: i.unitPrice,
            q: i.quantity,
          }))
        ),
        subtotal: String(subtotal),
        deliveryFee: String(body.deliveryFee),
        deliveryAddress: body.deliveryAddress,
        phone: body.phone,
        deliveryInstructions: body.deliveryInstructions ?? "",
        userId: body.userId ?? "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
