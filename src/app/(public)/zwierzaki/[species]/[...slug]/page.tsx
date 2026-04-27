import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/brand/breadcrumbs";
import { EmptyState } from "@/components/brand/empty-state";
import { type SpeciesKind } from "@/components/brand/icons";
import { CategoryTile } from "@/components/product/category-tile";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { listProductsByCategoryPath } from "@/lib/db/queries/products";
import {
  getCategoryByPath,
  getSpeciesBySlug,
  listAllCategoryPaths,
  listSubcategories,
} from "@/lib/db/queries/taxonomy";
import type { Metadata } from "next";

export const revalidate = 3600;

type Params = Promise<{ species: string; slug: string[] }>;

export async function generateStaticParams() {
  const paths = await listAllCategoryPaths();
  return paths
    .filter((p) => p.path.includes("/")) // species hub is its own page
    .map((p) => {
      const segments = p.path.split("/");
      return { species: segments[0], slug: segments.slice(1) };
    });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { species, slug } = await params;
  const fullPath = [species, ...slug].join("/");
  const [cat, speciesData] = await Promise.all([
    getCategoryByPath(fullPath),
    getSpeciesBySlug(species),
  ]);
  if (!cat || !speciesData) return { title: "Kategoria nieznaleziona" };
  const title =
    cat.seo_title ?? `${cat.name} dla ${speciesData.name.toLowerCase()}`;
  return {
    title,
    description: cat.seo_description ?? cat.description ?? undefined,
    alternates: { canonical: `/zwierzaki/${fullPath}` },
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

export default async function CategoryPage({ params }: { params: Params }) {
  const { species, slug } = await params;
  const fullPath = [species, ...slug].join("/");
  const [cat, speciesData] = await Promise.all([
    getCategoryByPath(fullPath),
    getSpeciesBySlug(species),
  ]);
  if (!cat || !speciesData) notFound();

  const [subcategories, products] = await Promise.all([
    listSubcategories(speciesData.id, cat.id),
    listProductsByCategoryPath(fullPath, 60),
  ]);

  // Build breadcrumb chain from path segments. Each segment past the
  // species root corresponds to a category in the chain — for now we
  // render plain labels (capitalised slug) because we don't fetch the
  // intermediate categories. Acceptable for MVP; can join later.
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Start", href: "/" },
    { label: "Zwierzaki", href: "/zwierzaki/psy" },
    { label: speciesData.name, href: `/zwierzaki/${species}` },
  ];
  // Intermediate path segments (everything except current = last segment)
  for (let i = 0; i < slug.length - 1; i++) {
    const partialPath = [species, ...slug.slice(0, i + 1)].join("/");
    breadcrumbs.push({
      label: capitalise(slug[i]),
      href: `/zwierzaki/${partialPath}`,
    });
  }
  breadcrumbs.push({ label: cat.name });

  const iconKind = SPECIES_ICON_MAP[species] ?? "dog";

  return (
    <article className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />

        <CategoryJsonLd
          breadcrumbs={breadcrumbs}
          products={products}
          name={cat.name}
        />

        <header className="mt-6 mb-8">
          <Badge tone="cream">{speciesData.name}</Badge>
          <h1 className="mt-3 mb-3 text-[2.6rem] leading-tight">{cat.name}</h1>
          {cat.description && (
            <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
              {cat.description}
            </p>
          )}
        </header>

        {subcategories.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-[1.4rem]">Podkategorie</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {subcategories.map((sub) => (
                <CategoryTile
                  key={sub.id}
                  href={`/zwierzaki/${sub.path_cache}`}
                  kind={iconKind}
                  label={sub.name}
                />
              ))}
            </div>
          </section>
        )}

        {products.length > 0 ? (
          <section>
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-[1.4rem]">
                Produkty{" "}
                {products.length === 60 ? "(top 60)" : `(${products.length})`}
              </h2>
            </div>
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
          </section>
        ) : (
          subcategories.length === 0 && (
            <EmptyState
              title="Brak produktów w tej kategorii"
              subtitle="Wróć później albo zajrzyj do innej kategorii."
            />
          )
        )}
      </div>
    </article>
  );
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

function CategoryJsonLd({
  breadcrumbs,
  products,
  name,
}: {
  breadcrumbs: BreadcrumbItem[];
  products: Awaited<ReturnType<typeof listProductsByCategoryPath>>;
  name: string;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.label,
          ...(b.href ? { item: b.href } : {}),
        })),
      },
      {
        "@type": "ItemList",
        name,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `/produkt/${p.slug}`,
          name: p.name,
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
