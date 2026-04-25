import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

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
let cached: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  cached = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
