import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Service-role Supabase client. NEVER import this into a Client Component —
 * the service role key bypasses Row Level Security entirely. Use it only
 * from Route Handlers / Server Actions that have already verified the
 * request is legitimate (e.g. a signature-checked Stripe webhook, or an
 * admin-only server action).
 */
export function createAdminClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      throw new Error(
        "Supabase service role is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local — see .env.example."
      );
    }
    client = createSupabaseClient<Database>(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}
