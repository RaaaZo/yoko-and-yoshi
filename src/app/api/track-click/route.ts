import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { trackClickLimiter } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashForTelemetry } from "@/lib/utils";

export const runtime = "nodejs";

const schema = z.object({
  productId: z.string().uuid(),
  referrerPath: z.string().optional().nullable(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const ua = hdrs.get("user-agent") ?? "";
  const country =
    hdrs.get("x-vercel-ip-country") ?? hdrs.get("cf-ipcountry") ?? null;

  if (trackClickLimiter) {
    const { success } = await trackClickLimiter.limit(ip);
    if (!success) {
      return NextResponse.json({ ok: false, throttled: true }, { status: 429 });
    }
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("allegro_clicks").insert({
    product_id: parsed.data.productId,
    referrer_path: parsed.data.referrerPath ?? null,
    user_agent_hash: ua ? await hashForTelemetry(ua) : null,
    country_code: country,
    utm_source: parsed.data.utmSource ?? null,
    utm_medium: parsed.data.utmMedium ?? null,
    utm_campaign: parsed.data.utmCampaign ?? null,
  });

  if (error) {
    logger.error({ err: error }, "track-click insert failed");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
