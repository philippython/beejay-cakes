import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderStatusUpdateEmail } from "@/lib/email";
import type { OrderStatusDb } from "@/lib/database.types";

const VALID_STATUSES: OrderStatusDb[] = [
  "pending",
  "confirmed",
  "baking",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

// Also protected by src/proxy.ts at the page level for /admin/*, but this
// route can be called directly, so it re-checks admin status itself —
// never trust the caller just because the request came from the admin UI.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await req.json();
  const status: OrderStatusDb = body.status;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: order, error } = await admin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("id, customer_email")
    .single();

  if (error || !order) {
    return NextResponse.json({ error: error?.message ?? "Order not found" }, { status: 404 });
  }

  if (order.customer_email) {
    await sendOrderStatusUpdateEmail({ to: order.customer_email, orderId: order.id, status });
  }

  return NextResponse.json({ ok: true });
}
