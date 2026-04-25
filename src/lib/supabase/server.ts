import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };

// NOTE: clients are intentionally untyped while the Database stub is in place
// (see src/types/database.ts). Once `pnpm db:types` runs against the live
// project, add the <Database> generic back to enforce column-level typing.

/**
 * Supabase client for Server Components, Route Handlers, and Server Actions.
 * Uses the anon key + the user's session cookies — RLS is enforced.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll throws when called from a Server Component;
            // safe to ignore — the middleware will refresh the session.
          }
        },
      },
    },
  );
}
