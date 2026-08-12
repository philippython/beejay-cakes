import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

type CheckoutBody = {
  items: { name: string; unitPrice: number; quantity: number }[];
  deliveryFee: number;
  customerEmail?: string;
};

// Creates a Stripe Checkout Session for the cart and returns its URL.
// The client redirects the browser to that URL to complete payment.
// Order status afterwards should be confirmed via a Stripe webhook
// (POST /api/webhooks/stripe) that flips the order to "Confirmed" —
// see README.md for the full flow this stubs out.
export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const stripe = getStripe();

    const line_items = body.items.map((item) => ({
      price_data: {
        currency: "ngn",
        product_data: { name: item.name },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));

    if (body.deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "ngn",
          product_data: { name: "Delivery fee" },
          unit_amount: Math.round(body.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: body.customerEmail,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
