import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. BYPASSES RLS.
 *
 * Use only from:
 *  - Server Actions in /admin
 *  - Cron / route handlers needing privileged access (Allegro sync, etc.)
 *
 * NEVER import from a Client Component or expose its operations to the client.
 * `import 'server-only'` above turns any accidental client import into a build error.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseAdminClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = createClient<any>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
