import { NextResponse, type NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

/**
 * Edge middleware — runs on every request.
 *
 * Order matters:
 *   1. Refresh Supabase session cookies (silent token rotation)
 *   2. Check /admin/* gating (logged-in + admin role)
 *   3. Apply security headers
 *
 * Redirects table lookup is intentionally NOT here yet — will be added
 * once the admin redirects module ships and a KV cache is wired.
 */
export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  const { response, user, supabase } = await updateSupabaseSession(request);

  if (isAdminRoute) {
    if (!user && !isAdminLogin) {
      const loginUrl = url.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && !isAdminLogin) {
      // Verify the user has admin role. Cheap query, no caching for now —
      // can be moved to a JWT claim once profile sync is in place.
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = (profile as { role?: string } | null)?.role;
      if (role !== "admin") {
        const home = url.clone();
        home.pathname = "/";
        return NextResponse.redirect(home);
      }
    }

    if (user && isAdminLogin) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      const role = (profile as { role?: string } | null)?.role;
      if (role === "admin") {
        const dashboard = url.clone();
        dashboard.pathname = "/admin";
        dashboard.search = "";
        return NextResponse.redirect(dashboard);
      }
    }
  }

  return applySecurityHeaders(response, isAdminRoute);
}

function applySecurityHeaders(
  response: NextResponse,
  isAdminRoute: boolean,
): NextResponse {
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  if (isAdminRoute) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  // Match everything except Next internals + static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
