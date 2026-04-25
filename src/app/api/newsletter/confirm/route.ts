import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return redirectTo("/newsletter?status=missing-token");
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token)
    .select("email")
    .maybeSingle();

  if (error || !data) {
    if (error) logger.error({ err: error }, "newsletter confirm failed");
    return redirectTo("/newsletter?status=invalid");
  }
  return redirectTo("/newsletter?status=confirmed");
}

function redirectTo(path: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${site}${path}`);
}
