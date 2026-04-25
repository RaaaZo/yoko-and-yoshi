import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for client components.
 * Used sparingly — most reads happen server-side. Reserved for things
 * like real-time subscriptions or browser-only flows.
 */
export function getSupabaseBrowserClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
