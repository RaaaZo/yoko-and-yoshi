import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/brand/empty-state";
import { getCachedRecommendedProducts } from "@/lib/db/queries/products";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Promocje",
  description:
    "Aktualne promocje i przeceny u sprzedawców na Allegro. Tylko sprawdzone produkty.",
  alternates: { canonical: "/promocje" },
};

export default async function PromosPage() {
  const products = await getCachedRecommendedProducts(40);
  const onSale = products.filter((p) => p.price_old_pln && p.price_pln);

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Badge tone="new">Promocje</Badge>
        <h1 className="mt-3 mb-3">Aktualne przeceny</h1>
        <p className="text-text-secondary mb-8 max-w-2xl text-lg">
          Wybrane produkty taniej niż zwykle. Sprawdzamy ceny u sprzedawców
          codziennie. Promocje wchodzą i znikają — kto pierwszy, ten lepszy.
        </p>

        {onSale.length === 0 ? (
          <EmptyState
            title="Brak aktywnych promocji"
            subtitle="Zaglądaj częściej — przeceny pojawiają się i znikają."
            action={
              <Button asChild variant="primary">
                <Link href="/szukaj">Przeglądaj sklep</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {onSale.map((p) => {
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
                  badge={{ label: "Promo", tone: "new" }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
