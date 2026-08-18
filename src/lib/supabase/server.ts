import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Server-side Supabase client for Server Components / Route Handlers /
 * Server Actions. Reads the user's auth cookies, so `.auth.getUser()`
 * reflects who's actually logged in. Uses the anon key — RLS still
 * applies, this just knows *which* user is asking.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component that can't set cookies (e.g.
          // during static rendering) — safe to ignore, middleware refreshes
          // the session on the next request instead.
        }
      },
    },
  });
}
