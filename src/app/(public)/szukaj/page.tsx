import Link from "next/link";
import { permanentRedirect } from "next/navigation";

import { EmptyState } from "@/components/brand/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/lib/db/queries/products";
import { getCachedItemTypes } from "@/lib/db/queries/taxonomy";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Szukaj",
  description:
    "Wyszukaj produkty po nazwie. Polecane przez Yoko & Yoshi, kupowane na Allegro.",
  robots: { index: false, follow: true },
};

type SP = Promise<{
  q?: string;
  // legacy params — redirected to canonical SEO URLs
  type?: string;
  species?: string;
  for?: string;
  recommended?: string;
}>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;

  // Legacy redirect: ?type= → /typ/[slug]; ?species= → /zwierzaki/[slug].
  // permanentRedirect() returns 308, search engines pass authority along.
  if (sp.type) permanentRedirect(`/typ/${sp.type}`);
  if (sp.species) permanentRedirect(`/zwierzaki/${sp.species}`);
  if (sp.recommended === "1") permanentRedirect("/promocje");
  if (sp.for === "shiba") permanentRedirect("/poradnik/rasy/shiba-inu");

  const query = (sp.q ?? "").trim();
  const allItemTypes = await getCachedItemTypes();
  const products = query ? await searchProducts(query, 60) : [];

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4">
          {query ? `Wyniki: "${query}"` : "Szukaj produktów"}
        </h1>

        <form
          action="/szukaj"
          className="bg-bg-surface border-border-soft mb-6 flex flex-wrap gap-3 rounded-lg border-2 border-dashed p-4"
        >
          <Input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Szukaj zabawek, smyczy, trymerów…"
            className="min-w-0 flex-1"
          />
          <Button type="submit" variant="primary">
            Szukaj
          </Button>
        </form>

        <div className="mb-6">
          <p className="text-text-muted mb-3 text-[0.85rem]">
            Albo przeglądaj po typie produktu:
          </p>
          <div className="flex flex-wrap gap-2">
            {allItemTypes.map((it) => (
              <Link key={it.id} href={`/typ/${it.slug}`}>
                <Badge tone="outline">
                  {it.icon_emoji} {it.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {query ? (
          products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => {
                const primaryImage =
                  p.images?.find((i) => i.is_primary) ?? p.images?.[0] ?? null;
                return (
                  <ProductCard
                    key={p.id}
                    href={`/produkt/${p.slug}`}
                    kicker={p.item_types?.[0]?.name ?? null}
                    name={p.name}
                    imageUrl={primaryImage?.url}
                    imageAlt={primaryImage?.alt ?? p.name}
                    blurDataUrl={primaryImage?.blur_data_url}
                    price={p.price_pln}
                    oldPrice={p.price_old_pln}
                    recommended={p.recommending_mascot}
                    rating={p.rating}
                    ratingCount={p.rating_count}
                    allegroUrl={p.allegro_url}
                    productId={p.id}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Nic nie znaleźliśmy"
              subtitle="Spróbuj innych słów albo przeglądaj kategorie powyżej."
            />
          )
        ) : null}
      </div>
    </section>
  );
}
