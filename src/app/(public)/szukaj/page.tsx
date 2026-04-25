import Link from "next/link";

import { EmptyState } from "@/components/brand/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  listProductsByItemTypeSlug,
  searchProducts,
} from "@/lib/db/queries/products";
import {
  getCachedItemTypes,
  getItemTypeBySlug,
} from "@/lib/db/queries/taxonomy";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Szukaj",
  description:
    "Wyszukaj produkty po nazwie, kategorii lub typie. Polecane przez Yoko & Yoshi, kupowane na Allegro.",
  robots: { index: false, follow: true },
};

type SP = Promise<{ q?: string; type?: string; recommended?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const typeSlug = (sp.type ?? "").trim();
  const showRecommended = sp.recommended === "1";

  const itemType = typeSlug ? await getItemTypeBySlug(typeSlug) : null;
  const allItemTypes = await getCachedItemTypes();

  const products = query
    ? await searchProducts(query, 60)
    : typeSlug
      ? await listProductsByItemTypeSlug(typeSlug, 60)
      : showRecommended
        ? (
            await import("@/lib/db/queries/products")
          ).getCachedRecommendedProducts(60)
        : [];

  const resolvedProducts = Array.isArray(products) ? products : await products;

  const heading = query
    ? `Wyniki: "${query}"`
    : itemType
      ? itemType.name
      : showRecommended
        ? "Polecane przez Yoko & Yoshi"
        : "Wszystkie produkty";

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4">{heading}</h1>

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

        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/szukaj">
            <Badge tone={typeSlug ? "outline" : "cyan"}>Wszystkie</Badge>
          </Link>
          {allItemTypes.map((it) => (
            <Link key={it.id} href={`/szukaj?type=${it.slug}`}>
              <Badge tone={typeSlug === it.slug ? "cyan" : "outline"}>
                {it.icon_emoji} {it.name}
              </Badge>
            </Link>
          ))}
        </div>

        {resolvedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {resolvedProducts.map((p) => {
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
            title={query ? "Nic nie znaleźliśmy" : "Wybierz kategorię"}
            subtitle={
              query
                ? "Spróbuj innych słów albo przeglądaj polecane kategorie."
                : "Filtruj produkty po typie powyżej, albo wpisz, czego szukasz."
            }
          />
        )}
      </div>
    </section>
  );
}
