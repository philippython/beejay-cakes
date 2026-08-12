import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Loud in dev, harmless in prod builds — prevents silent auth/data failures.
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars are missing. Copy .env.example to .env.local and fill in your project's URL and anon key."
  );
}

// Single shared browser client. For Server Components / Route Handlers that
// need a cookie-aware client (e.g. reading the logged-in user), use
// @supabase/ssr's createServerClient instead — see README.md.
export const supabase = createClient<Database>(url, anonKey);
