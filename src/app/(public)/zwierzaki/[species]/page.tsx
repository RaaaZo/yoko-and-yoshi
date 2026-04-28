import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/brand/breadcrumbs";
import { Carousel } from "@/components/brand/carousel";
import { YokoSitting, type SpeciesKind } from "@/components/brand/icons";
import { PawDivider } from "@/components/brand/paw-divider";
import { CategoryTile } from "@/components/product/category-tile";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listProductsBySpecies } from "@/lib/db/queries/products";
import {
  getSpeciesBySlug,
  listSpecies,
  listSubcategories,
} from "@/lib/db/queries/taxonomy";
import { speciesDativus } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type Params = Promise<{ species: string }>;

export async function generateStaticParams() {
  const species = await listSpecies();
  return species.map((s) => ({ species: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { species } = await params;
  const data = await getSpeciesBySlug(species);
  if (!data) return { title: "Gatunek nieznaleziony" };
  return {
    title: data.seo_title ?? data.name,
    description: data.seo_description ?? data.description ?? undefined,
    alternates: { canonical: `/zwierzaki/${data.slug}` },
  };
}

const SPECIES_ICON_MAP: Record<string, SpeciesKind> = {
  psy: "dog",
  koty: "cat",
  gryzonie: "rodent",
  ptaki: "bird",
  ryby: "fish",
  gady: "reptile",
};

export default async function SpeciesHubPage({ params }: { params: Params }) {
  const { species } = await params;
  const data = await getSpeciesBySlug(species);
  if (!data) notFound();

  const [topCategories, recommended] = await Promise.all([
    listSubcategories(data.id, null),
    listProductsBySpecies(data.id, 8),
  ]);

  const iconKind = SPECIES_ICON_MAP[data.slug] ?? "dog";
  const isPsy = data.slug === "psy";

  return (
    <article className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[
            { label: "Start", href: "/" },
            { label: "Zwierzaki", href: "/zwierzaki" },
            { label: data.name },
          ]}
        />

        <SpeciesJsonLd species={data} />

        <header className="mt-6 mb-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <Badge tone="secondary">Gatunek</Badge>
            <h1 className="mt-3 mb-3 text-[3rem] leading-tight">{data.name}</h1>
            {data.description && (
              <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
                {data.description}
              </p>
            )}
          </div>
          {isPsy && (
            <div className="hidden md:block">
              <YokoSitting size={220} priority />
            </div>
          )}
        </header>

        {topCategories.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-5">Kategorie</h2>
            <Carousel ariaLabel={`Kategorie: ${data.name}`}>
              {topCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex min-w-[180px] flex-1 snap-start sm:min-w-[200px]"
                >
                  <CategoryTile
                    href={`/zwierzaki/${cat.path_cache}`}
                    categorySlug={cat.slug}
                    fallbackKind={iconKind}
                    label={cat.name}
                    className="flex-1"
                  />
                </div>
              ))}
            </Carousel>
          </section>
        )}

        <PawDivider />

        {recommended.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="mb-1.5 text-[0.78rem] font-bold tracking-[0.14em] text-[color:var(--color-accent-coral)] uppercase">
                  Polecane przez Yoko & Yoshi
                </div>
                <h2>Co polecamy {speciesDativus(data.slug)}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recommended.map((p) => {
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
          </section>
        )}

        {isPsy && (
          <section
            className="mb-12 grid items-center gap-8 rounded-xl border-2 border-dashed border-[color:var(--color-border-default)] p-8 md:grid-cols-[1fr_1.2fr]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-secondary-soft) 0%, var(--color-primary-soft) 100%)",
            }}
          >
            <div className="grid place-items-center">
              <YokoSitting size={300} />
            </div>
            <div>
              <Badge tone="primary">Robimy to</Badge>
              <h2 className="mt-3 mb-3 text-[2rem]">Hub rasowy: Shiba Inu</h2>
              <p className="text-text-secondary mb-5 leading-relaxed">
                Pełny przewodnik po rasie. Plus akcesoria sprawdzone u Yoko
                i Yoshi.
              </p>
              <Button asChild variant="primary">
                <Link href="/poradnik/rasy/shiba-inu">Zobacz przewodnik</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function SpeciesJsonLd({
  species,
}: {
  species: NonNullable<Awaited<ReturnType<typeof getSpeciesBySlug>>>;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: species.name,
    description: species.description ?? undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
