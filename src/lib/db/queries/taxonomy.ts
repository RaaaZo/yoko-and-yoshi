import { logger } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/stub";
import type { Category, Species } from "@/types/domain";
import {
  MOCK_CATEGORIES,
  MOCK_CATEGORY_PATHS,
  MOCK_SPECIES,
} from "../mock";

export async function listSpecies(): Promise<Species[]> {
  if (!isSupabaseConfigured()) return MOCK_SPECIES;
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("species")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) {
    logger.error({ err: error }, "listSpecies failed");
    return [];
  }
  return (data ?? []) as unknown as Species[];
}

export async function getSpeciesBySlug(slug: string): Promise<Species | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_SPECIES.find((s) => s.slug === slug) ?? null;
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("species")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    logger.error({ err: error, slug }, "getSpeciesBySlug failed");
    return null;
  }
  if (!data) {
    logger.warn(
      { slug },
      "getSpeciesBySlug: slug not found (DB empty or seed not loaded?)",
    );
  }
  return (data as unknown as Species) ?? null;
}

export async function getCategoryByPath(
  path: string,
): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES.find((c) => c.path_cache === path) ?? null;
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("path_cache", path)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    logger.error({ err: error, path }, "getCategoryByPath failed");
    return null;
  }
  return (data as unknown as Category) ?? null;
}

export async function listCategoriesForSpecies(
  speciesId: string,
): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES.filter((c) => c.species_id === speciesId);
  }
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("species_id", speciesId)
    .eq("published", true)
    .order("sort_order");
  if (error) {
    logger.error({ err: error, speciesId }, "listCategoriesForSpecies failed");
    return [];
  }
  return (data ?? []) as unknown as Category[];
}

/**
 * Direct children of a category. Pass parentId=null to get top-level
 * categories of a species.
 */
export async function listSubcategories(
  speciesId: string,
  parentId: string | null,
): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES.filter(
      (c) => c.species_id === speciesId && c.parent_id === parentId,
    );
  }
  const supabase = await getSupabaseServerClient();
  let q = supabase
    .from("categories")
    .select("*")
    .eq("species_id", speciesId)
    .eq("published", true)
    .order("sort_order");
  q = parentId === null ? q.is("parent_id", null) : q.eq("parent_id", parentId);
  const { data, error } = await q;
  if (error) {
    logger.error(
      { err: error, speciesId, parentId },
      "listSubcategories failed",
    );
    return [];
  }
  return (data ?? []) as unknown as Category[];
}

/**
 * All published category paths — used by sitemap and
 * generateStaticParams for the catch-all route.
 */
export async function listAllCategoryPaths(): Promise<
  Array<{ path: string; updated_at: string | null }>
> {
  if (!isSupabaseConfigured()) return MOCK_CATEGORY_PATHS;
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("path_cache, updated_at")
    .eq("published", true)
    .not("path_cache", "is", null)
    .order("path_cache");
  if (error) {
    logger.error({ err: error }, "listAllCategoryPaths failed");
    return [];
  }
  type Row = { path_cache: string; updated_at: string | null };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    path: r.path_cache,
    updated_at: r.updated_at,
  }));
}

// See note in queries/products.ts about why unstable_cache is bypassed here.
export const getCachedSpecies = listSpecies;
