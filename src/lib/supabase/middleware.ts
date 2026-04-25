import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Database } from "@/types/database";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Session refresh helper for middleware. Mutates the response cookies
 * so the browser keeps a valid session after silent token rotation.
 *
 * Returns the (possibly modified) response and the resolved user — callers
 * can use the user to gate /admin/* routes.
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // IMPORTANT: do not run additional logic between createServerClient and
  // getUser — the call refreshes the session and serializes new cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, supabase };
}
