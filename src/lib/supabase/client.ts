import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

/**
 * Supabase client for client components.
 * Used sparingly — most reads happen server-side. Reserved for things
 * like real-time subscriptions or browser-only flows.
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
