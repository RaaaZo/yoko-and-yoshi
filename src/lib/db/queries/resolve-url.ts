import { logger } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product, ResolvedUrl } from "@/types/domain";

/**
 * Resolve a `/[species]/[...slug]` URL to a product, category, or 404.
 * Order:
 *   1. Try category by full path_cache match
 *   2. Try product by slug (last segment)
 *   3. null -> 404
 */
export async function resolveUrl(
  species: string,
  slugSegments: string[],
): Promise<ResolvedUrl | null> {
  if (slugSegments.length === 0) return null;
  const supabase = await getSupabaseServerClient();
  const fullPath = [species, ...slugSegments].join("/");

  // 1. Try category
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("*")
    .eq("path_cache", fullPath)
    .eq("published", true)
    .maybeSingle();
  if (catErr) {
    logger.error(
      { err: catErr, fullPath },
      "resolveUrl category lookup failed",
    );
  }
  if (cat) {
    return { kind: "category", data: cat as unknown as Category };
  }

  // 2. Try product by slug (last segment)
  const productSlug = slugSegments[slugSegments.length - 1];
  const { data: product, error: prodErr } = await supabase
    .from("products")
    .select(
      `id, slug, name, brand_id, short_description, full_description,
       own_recommendation, recommending_mascot, price_pln, price_old_pln,
       price_updated_at, allegro_url, allegro_offer_id, rating, rating_count,
       is_featured, is_recommended, sort_score, published,
       seo_title, seo_description, og_image_url,
       images:product_images(id, url, alt, sort_order, is_primary, width, height, blur_data_url),
       faqs:product_faqs(id, question, answer, sort_order),
       item_types:product_item_types(item_type:item_types(id, slug, name, icon_emoji, soft_color_token, count_cache, sort_order, published))`,
    )
    .eq("slug", productSlug)
    .eq("published", true)
    .maybeSingle();
  if (prodErr) {
    logger.error(
      { err: prodErr, productSlug },
      "resolveUrl product lookup failed",
    );
  }
  if (product) {
    return { kind: "product", data: product as unknown as Product };
  }

  return null;
}
