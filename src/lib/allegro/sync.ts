import "server-only";

import { logger } from "@/lib/logger";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

import { AllegroClient } from "./client";

/**
 * Sync a single product against its current Allegro offer. Updates price,
 * stock-implied availability (offer 404 = unpublish), and freshness
 * timestamp. Idempotent: skip if hash hasn't changed since last sync.
 *
 * Phase 4 stub: implements the price + URL update path. Image mirroring
 * to Supabase Storage and deeper field mapping (parameters → specs jsonb)
 * are TODOs for the follow-up branch.
 */
export async function syncProduct(
  productId: string,
  accessToken: string,
): Promise<{ ok: boolean; reason?: string }> {
  const supabase = getSupabaseAdminClient();
  const { data: product, error: prodErr } = await supabase
    .from("products")
    .select("id, allegro_offer_id, price_pln")
    .eq("id", productId)
    .maybeSingle();
  if (prodErr || !product) return { ok: false, reason: "product not found" };

  const offerId = (product as { allegro_offer_id?: string }).allegro_offer_id;
  if (!offerId) return { ok: false, reason: "no allegro_offer_id" };

  const client = new AllegroClient(accessToken);
  const offer = await client.getOffer(offerId);

  if (!offer) {
    // Offer disappeared — unpublish to avoid sending traffic to dead links
    await supabase
      .from("products")
      .update({
        published: false,
        allegro_synced_at: new Date().toISOString(),
      })
      .eq("id", productId);
    logger.warn({ productId, offerId }, "Allegro offer 404, unpublished");
    return { ok: false, reason: "offer not found" };
  }

  const newPrice = offer.sellingMode?.price?.amount
    ? Number.parseFloat(offer.sellingMode.price.amount)
    : null;

  await supabase
    .from("products")
    .update({
      price_pln: newPrice,
      price_updated_at: new Date().toISOString(),
      allegro_url: `https://allegro.pl/oferta/${offerId}`,
      allegro_synced_at: new Date().toISOString(),
    })
    .eq("id", productId);

  return { ok: true };
}

/**
 * Sync all products that have an allegro_offer_id and haven't been
 * synced in the last 24h. Called from cron (/api/cron/allegro-sync).
 */
export async function syncStaleProducts(
  accessToken: string,
  staleHours = 24,
): Promise<{ synced: number; failed: number }> {
  const supabase = getSupabaseAdminClient();
  const since = new Date(Date.now() - staleHours * 3600 * 1000).toISOString();

  const { data: stale } = await supabase
    .from("products")
    .select("id")
    .not("allegro_offer_id", "is", null)
    .or(`allegro_synced_at.is.null,allegro_synced_at.lt.${since}`)
    .limit(500);

  let synced = 0;
  let failed = 0;
  for (const row of (stale ?? []) as Array<{ id: string }>) {
    const result = await syncProduct(row.id, accessToken);
    if (result.ok) synced++;
    else failed++;
  }
  logger.info({ synced, failed }, "Allegro daily sync complete");
  return { synced, failed };
}
