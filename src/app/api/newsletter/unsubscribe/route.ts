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
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({
      confirmed: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("confirm_token", token);

  if (error) {
    logger.error({ err: error }, "newsletter unsubscribe failed");
    return redirectTo("/newsletter?status=error");
  }
  return redirectTo("/newsletter?status=unsubscribed");
}

function redirectTo(path: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${site}${path}`);
}
