import type { MetadataRoute } from "next";

import { listArticles, listBreeds } from "@/lib/db/queries/content";
import {
  listAllCategoryPaths,
  listSpecies,
  listItemTypes,
} from "@/lib/db/queries/taxonomy";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yokoyoshi.pl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, breeds, species, itemTypes, categoryPaths] =
    await Promise.all([
      listAllProductSlugs(),
      listArticles({ limit: 5000 }),
      listBreeds(),
      listSpecies(),
      listItemTypes(),
      listAllCategoryPaths(),
    ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    "",
    "/poradnik",
    "/o-nas",
    "/kontakt",
    "/newsletter",
    "/promocje",
    "/informacja-affiliate",
    "/polityka-prywatnosci",
    "/regulamin",
    "/polityka-cookies",
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.5,
  }));

  return [
    ...staticEntries,
    // Species hubs
    ...species.map((s) => ({
      url: `${SITE}/zwierzaki/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Nested category pages (path_cache already includes species prefix)
    ...categoryPaths.map(({ path, updated_at }) => ({
      url: `${SITE}/zwierzaki/${path}`,
      lastModified: updated_at ? new Date(updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: path.split("/").length === 2 ? 0.7 : 0.6,
    })),
    // Item-type listings (cross-species)
    ...itemTypes.map((it) => ({
      url: `${SITE}/typ/${it.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Products
    ...products.map(({ slug, updated_at }) => ({
      url: `${SITE}/produkt/${slug}`,
      lastModified: updated_at ? new Date(updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Articles
    ...articles.map((a) => ({
      url: `${SITE}/poradnik/${a.slug}`,
      lastModified: a.published_at ? new Date(a.published_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Breed hubs
    ...breeds.map((b) => ({
      url: `${SITE}/poradnik/rasy/${b.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

async function listAllProductSlugs(): Promise<
  Array<{ slug: string; updated_at: string | null }>
> {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("published", true)
    .order("sort_score", { ascending: false })
    .limit(5000);
  return (data ?? []) as unknown as Array<{
    slug: string;
    updated_at: string | null;
  }>;
}
