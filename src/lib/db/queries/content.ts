import { logger } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Article, Breed } from "@/types/domain";

export async function listArticles(
  opts: {
    limit?: number;
    category?: Article["category"];
  } = {},
): Promise<Article[]> {
  const supabase = await getSupabaseServerClient();
  let q = supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, hero_image_url, category, reading_minutes, published, published_at, seo_title, seo_description, og_image_url",
    )
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (opts.category) q = q.eq("category", opts.category);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    logger.error({ err: error }, "listArticles failed");
    return [];
  }
  return (data ?? []) as unknown as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    logger.error({ err: error, slug }, "getArticleBySlug failed");
    return null;
  }
  return (data as unknown as Article) ?? null;
}

export async function getBreedBySlug(slug: string): Promise<Breed | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("breeds")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    logger.error({ err: error, slug }, "getBreedBySlug failed");
    return null;
  }
  return (data as unknown as Breed) ?? null;
}

export async function listBreeds(): Promise<Breed[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("breeds")
    .select("*")
    .eq("published", true)
    .order("name");
  if (error) {
    logger.error({ err: error }, "listBreeds failed");
    return [];
  }
  return (data ?? []) as unknown as Breed[];
}
