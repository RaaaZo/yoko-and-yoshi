import { logger } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, ItemType, Species } from "@/types/domain";

export async function listSpecies(): Promise<Species[]> {
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
  return (data as unknown as Species) ?? null;
}

export async function listItemTypes(): Promise<ItemType[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("item_types")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) {
    logger.error({ err: error }, "listItemTypes failed");
    return [];
  }
  return (data ?? []) as unknown as ItemType[];
}

export async function getItemTypeBySlug(
  slug: string,
): Promise<ItemType | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("item_types")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    logger.error({ err: error, slug }, "getItemTypeBySlug failed");
    return null;
  }
  return (data as unknown as ItemType) ?? null;
}

export async function getCategoryByPath(
  path: string,
): Promise<Category | null> {
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

// See note in queries/products.ts about why unstable_cache is bypassed here.
export const getCachedItemTypes = listItemTypes;
export const getCachedSpecies = listSpecies;
