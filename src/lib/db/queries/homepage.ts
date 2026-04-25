import { logger } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { HomepageSection } from "@/types/domain";

export async function listHomepageSections(): Promise<HomepageSection[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) {
    logger.error({ err: error }, "listHomepageSections failed");
    return [];
  }
  return (data ?? []) as unknown as HomepageSection[];
}

// See note in queries/products.ts about why unstable_cache is bypassed here.
export const getCachedHomepageSections = listHomepageSections;
