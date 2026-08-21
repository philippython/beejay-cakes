import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Loud in dev, harmless in prod builds — prevents silent auth/data failures.
  // eslint-disable-next-line no-console
  console.error(
    "%c⚠ Supabase is NOT configured — using placeholder credentials, every auth/data call will fail.\n" +
      "NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing from the environment " +
      "this app is actually running in. If you're testing a deployed site, your local .env file does not " +
      "reach it — add these two vars in that platform's environment variable settings and redeploy.",
    "font-size: 13px; font-weight: bold; color: #c71880;"
  );
}

/**
 * Browser-side Supabase client (Client Components). Safe to use the anon
 * key here — access is controlled by Row Level Security policies, not by
 * keeping this key secret.
 */
export const supabase = createBrowserClient<Database>(url, anonKey);
