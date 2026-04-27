import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/brand/breadcrumbs";
import { EmptyState } from "@/components/brand/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { listProductsByItemTypeSlug } from "@/lib/db/queries/products";
import { getItemTypeBySlug, listItemTypes } from "@/lib/db/queries/taxonomy";
import type { Metadata } from "next";

export const revalidate = 3600;

type Params = Promise<{ itemType: string }>;

export async function generateStaticParams() {
  const types = await listItemTypes();
  return types.map((t) => ({ itemType: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { itemType } = await params;
  const data = await getItemTypeBySlug(itemType);
  if (!data) return { title: "Typ nieznaleziony" };
  return {
    title: `${data.name} — Yoko & Yoshi`,
    description: `Wszystkie produkty z kategorii ${data.name.toLowerCase()} — wybór Yoko & Yoshi spośród ofert na Allegro.`,
    alternates: { canonical: `/typ/${data.slug}` },
  };
}

export default async function ItemTypePage({ params }: { params: Params }) {
  const { itemType } = await params;
  const data = await getItemTypeBySlug(itemType);
  if (!data) notFound();

  const products = await listProductsByItemTypeSlug(itemType, 60);

  return (
    <article className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[
            { label: "Start", href: "/" },
            { label: "Typy produktów" },
            { label: data.name },
          ]}
        />

        <ItemTypeJsonLd name={data.name} products={products} />

        <header className="mt-6 mb-8 flex items-center gap-5">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-full text-4xl"
            style={{ background: "var(--color-bg-warm)" }}
          >
            {data.icon_emoji ?? "·"}
          </span>
          <div>
            <Badge tone="cyan">Typ produktu</Badge>
            <h1 className="mt-2 text-[2.6rem] leading-tight">{data.name}</h1>
          </div>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const primaryImage =
                p.images?.find((i) => i.is_primary) ?? p.images?.[0] ?? null;
              return (
                <ProductCard
                  key={p.id}
                  href={`/produkt/${p.slug}`}
                  kicker={data.name}
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
            title={`Brak produktów: ${data.name.toLowerCase()}`}
            subtitle="Sprawdź inne typy produktów albo zajrzyj później."
          />
        )}
      </div>
    </article>
  );
}

function ItemTypeJsonLd({
  name,
  products,
}: {
  name: string;
  products: Awaited<ReturnType<typeof listProductsByItemTypeSlug>>;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/produkt/${p.slug}`,
      name: p.name,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
