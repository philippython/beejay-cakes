import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Public, cookie-free Supabase client for read-only queries that don't
 * depend on who's logged in (categories, public product listings, etc).
 * Unlike src/lib/supabase/server.ts, this never touches cookies() —
 * using that one in a shared layout forces every page under it into
 * fully dynamic rendering, even pages that have nothing user-specific
 * on them. Use this one anywhere the data is the same for everybody.
 */
export function createPublicClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
    client = createSupabaseClient<Database>(url, anonKey);
  }
  return client;
}
