import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Loud in dev, harmless in prod builds — prevents silent auth/data failures.
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars are missing. Copy .env.example to .env.local and fill in your project's URL and anon key."
  );
}

/**
 * Browser-side Supabase client (Client Components). Safe to use the anon
 * key here — access is controlled by Row Level Security policies, not by
 * keeping this key secret.
 */
export const supabase = createBrowserClient<Database>(url, anonKey);
