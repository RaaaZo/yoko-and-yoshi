import { logger } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/stub";
import type {
  Product,
  ProductImage,
  ProductFaq,
  ItemType,
} from "@/types/domain";
import {
  MOCK_PRODUCTS,
  mockProductsForCategoryPath,
  mockProductsForItemType,
  mockProductsForSpeciesId,
  mockSearchProducts,
} from "../mock";

const PRODUCT_COLUMNS = `
  id, slug, name, brand_id, short_description, full_description,
  own_recommendation, recommending_mascot, price_pln, price_old_pln,
  price_updated_at, allegro_url, allegro_offer_id, rating, rating_count,
  is_featured, is_recommended, sort_score, published,
  seo_title, seo_description, og_image_url
` as const;

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS},
       images:product_images(id, url, alt, sort_order, is_primary, width, height, blur_data_url),
       faqs:product_faqs(id, question, answer, sort_order),
       item_types:product_item_types(item_type:item_types(id, slug, name, icon_emoji, soft_color_token, count_cache, sort_order, published))
      `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    logger.error({ err: error, slug }, "getProductBySlug failed");
    return null;
  }
  if (!data) return null;

  type RawRow = Omit<Product, "images" | "faqs" | "item_types"> & {
    images?: ProductImage[];
    faqs?: ProductFaq[];
    item_types?: Array<{ item_type: ItemType }>;
  };
  const row = data as unknown as RawRow;
  return {
    ...row,
    images: (row.images ?? []).sort((a, b) => a.sort_order - b.sort_order),
    faqs: (row.faqs ?? []).sort((a, b) => a.sort_order - b.sort_order),
    item_types: (row.item_types ?? []).map((rel) => rel.item_type),
  };
}

export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS.filter((p) => p.is_featured)
      .sort((a, b) => b.sort_score - a.sort_score)
      .slice(0, limit);
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS},
       images:product_images(url, alt, sort_order, is_primary, blur_data_url),
       item_types:product_item_types(item_type:item_types(slug, name))`,
    )
    .eq("published", true)
    .eq("is_featured", true)
    .order("sort_score", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ err: error }, "getFeaturedProducts failed");
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

export async function getRecommendedProducts(limit = 8): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS.filter((p) => p.is_recommended)
      .sort((a, b) => b.sort_score - a.sort_score)
      .slice(0, limit);
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS},
       images:product_images(url, alt, sort_order, is_primary, blur_data_url),
       item_types:product_item_types(item_type:item_types(slug, name))`,
    )
    .eq("published", true)
    .eq("is_recommended", true)
    .order("sort_score", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ err: error }, "getRecommendedProducts failed");
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

export async function listProductsByItemTypeSlug(
  slug: string,
  limit = 24,
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProductsForItemType(slug)
      .sort((a, b) => b.sort_score - a.sort_score)
      .slice(0, limit);
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS},
       images:product_images(url, alt, sort_order, is_primary, blur_data_url),
       item_types:product_item_types!inner(item_type:item_types!inner(slug, name))`,
    )
    .eq("published", true)
    .eq("product_item_types.item_types.slug", slug)
    .order("sort_score", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ err: error, slug }, "listProductsByItemTypeSlug failed");
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

export async function listProductsByCategoryPath(
  pathCache: string,
  limit = 24,
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProductsForCategoryPath(pathCache)
      .sort((a, b) => b.sort_score - a.sort_score)
      .slice(0, limit);
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      `id,
       products:product_categories!inner(product:products(${PRODUCT_COLUMNS},
         images:product_images(url, alt, sort_order, is_primary, blur_data_url)
       ))`,
    )
    .eq("path_cache", pathCache)
    .maybeSingle();

  if (error || !data) {
    if (error)
      logger.error(
        { err: error, pathCache },
        "listProductsByCategoryPath failed",
      );
    return [];
  }

  type Row = { products?: Array<{ product?: Product }> };
  const products = ((data as unknown as Row).products ?? [])
    .map((r) => r.product)
    .filter((p): p is Product => Boolean(p && (p as Product).published))
    .sort((a, b) => (b.sort_score ?? 0) - (a.sort_score ?? 0));
  return products.slice(0, limit);
}

export async function searchProducts(
  query: string,
  limit = 30,
): Promise<Product[]> {
  if (!query.trim()) return [];
  if (!isSupabaseConfigured()) {
    return mockSearchProducts(query)
      .sort((a, b) => b.sort_score - a.sort_score)
      .slice(0, limit);
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS},
       images:product_images(url, alt, sort_order, is_primary, blur_data_url)`,
    )
    .eq("published", true)
    .ilike("name", `%${query.trim()}%`)
    .order("sort_score", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ err: error, query }, "searchProducts failed");
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

/**
 * All products mapped to any category in the species tree. Joins via
 * product_categories → categories.species_id. Used by /zwierzaki/[species]
 * for the "Polecane w {gatunku}" section.
 */
export async function listProductsBySpecies(
  speciesId: string,
  limit = 24,
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProductsForSpeciesId(speciesId)
      .sort((a, b) => b.sort_score - a.sort_score)
      .slice(0, limit);
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS},
       images:product_images(url, alt, sort_order, is_primary, blur_data_url),
       item_types:product_item_types(item_type:item_types(slug, name)),
       categories:product_categories!inner(category:categories!inner(species_id))`,
    )
    .eq("published", true)
    .eq("product_categories.categories.species_id", speciesId)
    .order("sort_score", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ err: error, speciesId }, "listProductsBySpecies failed");
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

// NOTE: page-level `export const revalidate = 3600` handles caching for these
// queries via ISR. We can't use unstable_cache here because the queries call
// cookies() inside the supabase server client. Re-introduce unstable_cache
// once we have a separate anon-only client (no cookies) for public reads.
export const getCachedFeaturedProducts = getFeaturedProducts;
export const getCachedRecommendedProducts = getRecommendedProducts;
