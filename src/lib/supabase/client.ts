import { createBrowserClient } from "@supabase/ssr";

import { createStubSupabaseClient, isSupabaseConfigured } from "./stub";

/**
 * Supabase client for client components.
 * Used sparingly — most reads happen server-side. Reserved for things
 * like real-time subscriptions or browser-only flows.
 *
 * Falls back to a stub when env is missing (see ./stub.ts).
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return createStubSupabaseClient() as unknown as ReturnType<
      typeof createBrowserClient
    >;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
