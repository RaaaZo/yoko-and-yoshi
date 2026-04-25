import { NextResponse } from "next/server";

import { refreshAccessToken } from "@/lib/allegro/client";
import { syncStaleProducts } from "@/lib/allegro/sync";
import { logger } from "@/lib/logger";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min — typical sync run

/**
 * Daily Allegro sync. Schedule: 03:00 Europe/Warsaw via vercel.json
 * cron config (add `{ "path": "/api/cron/allegro-sync", "schedule": "0 3 * * *" }`).
 *
 * Auth: x-cron-secret header (Vercel cron sets `Authorization: Bearer
 * <CRON_SECRET>`; we shadow that with our own check that uses the
 * REVALIDATE_TOKEN env, since we're already provisioning that secret).
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.REVALIDATE_TOKEN ?? ""}`;
  if (!process.env.REVALIDATE_TOKEN || auth !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "admin.allegro_refresh_token")
    .maybeSingle();

  const refreshToken = (setting as { value?: string } | null)?.value;
  if (!refreshToken) {
    logger.warn("admin.allegro_refresh_token not set — skipping cron");
    return NextResponse.json({ ok: false, error: "no refresh token" });
  }

  const tokens = await refreshAccessToken(refreshToken);
  if (!tokens) {
    return NextResponse.json({ ok: false, error: "token refresh failed" });
  }

  // Persist rotated refresh token
  await supabase
    .from("settings")
    .upsert({ key: "admin.allegro_refresh_token", value: tokens.refreshToken });

  const result = await syncStaleProducts(tokens.accessToken);
  return NextResponse.json({ ok: true, ...result });
}
