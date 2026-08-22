import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

// The browser can't upload directly to Cloudinary with the API secret
// (that would expose it to anyone who opens dev tools), so it asks this
// route for a signature first, then uploads straight to Cloudinary itself
// using that signature. Admin-gated the same way as the other admin API
// routes, since anyone able to sign uploads could otherwise abuse your
// Cloudinary quota.
export async function POST() {
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

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json({ error: "Cloudinary is not configured on the server" }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Cloudinary's documented signing algorithm: SHA-1 of the sorted
  // param string with the API secret appended.
  const signature = crypto.createHash("sha1").update(`timestamp=${timestamp}${apiSecret}`).digest("hex");

  return NextResponse.json({ timestamp, signature, apiKey, cloudName });
}
