import type { MetadataRoute } from "next";

import { listArticles, listBreeds } from "@/lib/db/queries/content";
import { listSpecies, listItemTypes } from "@/lib/db/queries/taxonomy";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yokoyoshi.pl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, breeds, species, itemTypes] = await Promise.all([
    listAllProductSlugs(),
    listArticles({ limit: 5000 }),
    listBreeds(),
    listSpecies(),
    listItemTypes(),
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
    ...itemTypes.map((it) => ({
      url: `${SITE}/szukaj?type=${it.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...species.map((s) => ({
      url: `${SITE}/szukaj?species=${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...products.map(({ slug, updated_at }) => ({
      url: `${SITE}/produkt/${slug}`,
      lastModified: updated_at ? new Date(updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${SITE}/poradnik/${a.slug}`,
      lastModified: a.published_at ? new Date(a.published_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
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
