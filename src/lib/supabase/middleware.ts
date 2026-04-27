import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createStubSupabaseClient, isSupabaseConfigured } from "./stub";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Session refresh helper for middleware. Mutates the response cookies
 * so the browser keeps a valid session after silent token rotation.
 *
 * Returns the (possibly modified) response and the resolved user — callers
 * can use the user to gate /admin/* routes.
 *
 * When env is missing, returns a no-op stub so middleware doesn't crash.
 * `user` is null in that case → admin routes redirect to /admin/login.
 */
export async function updateSupabaseSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return {
      response,
      user: null,
      supabase: createStubSupabaseClient() as unknown as ReturnType<
        typeof createServerClient
      >,
    };
  }

  let mutableResponse = response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient<any>(
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
          mutableResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            mutableResponse.cookies.set(name, value, options);
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

  return { response: mutableResponse, user, supabase };
}
