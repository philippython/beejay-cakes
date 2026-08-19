import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderReceivedEmail, sendAdminNewOrderEmail } from "@/lib/email";
import { getBankDetails } from "@/lib/data/settings";

type OrderItemInput = {
  productId?: string;
  name: string;
  size?: string;
  flavour?: string;
  unitPrice: number;
  quantity: number;
};

type OrderBody = {
  items: OrderItemInput[];
  deliveryFee: number;
  deliveryAddress: string;
  phone: string;
  deliveryInstructions?: string;
  userId?: string;
  customerEmail: string;
};

// Creates the order straight away (status "pending", payment not yet
// confirmed) — there's no payment gateway in this flow. Payment happens
// by bank transfer, using the details emailed to the customer here. The
// admin confirms it manually in /admin/orders once it lands, which is
// what actually moves the order to "confirmed".
export async function POST(req: NextRequest) {
  try {
    const body: OrderBody = await req.json();

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!body.deliveryAddress || !body.phone) {
      return NextResponse.json({ error: "Delivery address and phone are required" }, { status: 400 });
    }
    if (!body.customerEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const subtotal = body.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const total = subtotal + body.deliveryFee;

    const supabase = createAdminClient();

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: body.userId || null,
        status: "pending",
        subtotal,
        delivery_fee: body.deliveryFee,
        total,
        delivery_address: body.deliveryAddress,
        phone: body.phone,
        delivery_instructions: body.deliveryInstructions || null,
        customer_email: body.customerEmail,
        payment_confirmed: false,
      })
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json({ error: error?.message ?? "Could not create order" }, { status: 500 });
    }

    await supabase.from("order_items").insert(
      body.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId || null,
        name: item.name,
        size: item.size || null,
        flavour: item.flavour || null,
        unit_price: item.unitPrice,
        quantity: item.quantity,
      }))
    );

    const emailItems = body.items.map((i) => ({
      name: i.name,
      size: i.size,
      flavour: i.flavour,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }));

    const bankDetails = await getBankDetails(supabase);

    await Promise.all([
      sendOrderReceivedEmail({
        to: body.customerEmail,
        orderId: order.id,
        items: emailItems,
        subtotal,
        deliveryFee: body.deliveryFee,
        total,
        deliveryAddress: body.deliveryAddress,
        bankDetails,
      }),
      sendAdminNewOrderEmail({
        orderId: order.id,
        items: emailItems,
        subtotal,
        deliveryFee: body.deliveryFee,
        total,
        deliveryAddress: body.deliveryAddress,
        phone: body.phone,
        customerEmail: body.customerEmail,
      }),
    ]);

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
