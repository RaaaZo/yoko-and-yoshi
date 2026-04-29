import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/brand/breadcrumbs";
import { BadgeRecommended } from "@/components/brand/badge-recommended";
import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { AllegroCTA } from "@/components/product/allegro-cta";
import { ProductCard } from "@/components/product/product-card";
import { StarRating } from "@/components/product/star-rating";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCachedRecommendedProducts,
  getProductBySlug,
} from "@/lib/db/queries/products";
import { getCategoryByPath, getSpeciesBySlug } from "@/lib/db/queries/taxonomy";
import { capitaliseSlug, formatPricePLN } from "@/lib/utils";
import type { Product } from "@/types/domain";
import type { Metadata } from "next";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produkt nieznaleziony" };
  return {
    title: product.seo_title ?? product.name,
    description:
      product.seo_description ?? product.short_description ?? undefined,
    openGraph: {
      title: product.seo_title ?? product.name,
      description: product.seo_description ?? product.short_description ?? "",
      images: product.og_image_url
        ? [{ url: product.og_image_url }]
        : product.images?.[0]
          ? [{ url: product.images[0].url }]
          : [],
    },
    alternates: { canonical: `/produkt/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const formattedPrice = formatPricePLN(product.price_pln);
  const formattedOldPrice = formatPricePLN(product.price_old_pln);
  const primaryImage =
    product.images?.find((i) => i.is_primary) ?? product.images?.[0] ?? null;
  const recommender =
    product.recommending_mascot === "yoko" ||
    product.recommending_mascot === "yoshi"
      ? product.recommending_mascot
      : null;
  const itemKicker = product.item_types?.[0]?.name ?? null;

  const breadcrumbs = await buildProductBreadcrumbs(product);

  return (
    <article className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />

        <ProductJsonLd product={product} imageUrl={primaryImage?.url ?? null} />

        <div className="mt-6 grid gap-10 md:grid-cols-[1.1fr_1fr]">
          {/* GALLERY */}
          <div>
            <div className="bg-bg-surface border-border-soft relative aspect-square overflow-hidden rounded-lg border-[1.5px]">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt ?? product.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholder={primaryImage.blur_data_url ? "blur" : "empty"}
                  blurDataURL={primaryImage.blur_data_url ?? undefined}
                  priority
                  className="object-cover"
                />
              ) : (
                <PhotoPlaceholder aspectRatio="1 / 1" />
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img) => (
                  <div
                    key={img.id}
                    className="bg-bg-surface border-border-soft relative aspect-square overflow-hidden rounded-md border"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? product.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* META */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              {itemKicker && <Badge tone="cream">{itemKicker}</Badge>}
              {product.is_recommended && (
                <Badge tone="secondary">Bestseller</Badge>
              )}
              {recommender && <BadgeRecommended speaker={recommender} />}
            </div>

            <h1 className="text-[2.5rem] leading-tight">{product.name}</h1>

            {product.short_description && (
              <p className="text-text-secondary text-lg leading-relaxed">
                {product.short_description}
              </p>
            )}

            {product.rating && (
              <div className="text-text-secondary flex items-center gap-2 text-[0.95rem]">
                <StarRating rating={product.rating} className="text-lg" />
                <span className="font-semibold">{product.rating}</span>
                <span>({product.rating_count} ocen)</span>
              </div>
            )}

            <div className="bg-bg-elevated border-border-soft flex flex-wrap items-baseline gap-3 rounded-lg border-2 border-dashed p-5">
              {formattedOldPrice && (
                <span className="text-text-muted text-lg line-through">
                  {formattedOldPrice}
                </span>
              )}
              {formattedPrice && (
                <span className="num text-text-primary text-3xl">
                  {formattedPrice}
                </span>
              )}
              <span className="text-text-secondary ml-auto text-[0.85rem]">
                Cena z Allegro · sprawdzamy codziennie
              </span>
            </div>

            {product.allegro_url && (
              <AllegroCTA
                href={product.allegro_url}
                productId={product.id}
                price={formattedPrice ?? undefined}
                full
              />
            )}

            {product.own_recommendation && (
              <MascotCallout speaker={recommender ?? "yoko"}>
                {product.own_recommendation}
              </MascotCallout>
            )}
          </div>
        </div>

        {product.full_description && (
          <section className="bg-bg-surface border-border-soft mt-12 rounded-lg border-[1.5px] p-8">
            <h2 className="mb-4">Co warto wiedzieć</h2>
            <div className="prose-yy">
              {product.full_description.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {product.faqs && product.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5">Najczęstsze pytania</h2>
            <Accordion type="single" collapsible className="w-full">
              {product.faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-border-soft border-b"
                >
                  <AccordionTrigger className="font-display py-4 text-left text-[1.05rem] font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-text-secondary pb-4 text-[0.95rem] leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <FaqJsonLd faqs={product.faqs} />
          </section>
        )}

        <PawDivider />

        <Suspense fallback={<RelatedSkeleton />}>
          <RelatedSection productId={product.id} />
        </Suspense>

      </div>
    </article>
  );
}

async function RelatedSection({ productId }: { productId: string }) {
  // For MVP: fall back to "recommended" pool, excluding current product
  const products = await getCachedRecommendedProducts(8);
  const filtered = products.filter((p) => p.id !== productId).slice(0, 4);
  if (filtered.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-6">Może Ci się spodoba</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {filtered.map((p) => {
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
  );
}

/**
 * Build breadcrumbs for a product page.
 *
 * Strategy: take the product's first category_path (e.g. "psy/zabawki"),
 * split into segments and resolve each segment to a {label, href} pair.
 * The first segment maps to a Species (slug → name). Subsequent segments
 * are categories — we resolve them via getCategoryByPath() to use the
 * actual display name instead of capitalising the slug.
 *
 * Falls back to just `Start › {nazwa}` if the product has no category_paths
 * (e.g. data from a partially-populated DB).
 */
async function buildProductBreadcrumbs(
  product: Product,
): Promise<BreadcrumbItem[]> {
  const items: BreadcrumbItem[] = [{ label: "Start", href: "/" }];

  const primaryPath = product.category_paths?.[0];
  if (!primaryPath) {
    items.push({ label: product.name });
    return items;
  }

  const segments = primaryPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    items.push({ label: product.name });
    return items;
  }

  // Fetch species + every intermediate category in parallel — there's no
  // dependency between these lookups, so we don't sequentialise round-trips.
  const speciesSlug = segments[0];
  const categoryPaths = segments
    .slice(1)
    .map((_, i) => segments.slice(0, i + 2).join("/"));
  const [speciesEntry, ...categories] = await Promise.all([
    getSpeciesBySlug(speciesSlug),
    ...categoryPaths.map((p) => getCategoryByPath(p)),
  ]);

  if (speciesEntry) {
    items.push({
      label: speciesEntry.name,
      href: `/zwierzaki/${speciesEntry.slug}`,
    });
  }

  segments.slice(1).forEach((segment, i) => {
    items.push({
      label: categories[i]?.name ?? capitaliseSlug(segment),
      href: `/zwierzaki/${categoryPaths[i]}`,
    });
  });

  // Truncate long product names so the breadcrumb stays on a single
  // line on phones (the H1 below already shows the full name).
  items.push({ label: truncate(product.name, 32) });
  return items;
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function RelatedSkeleton() {
  return (
    <section className="mt-12">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    </section>
  );
}

function ProductJsonLd({
  product,
  imageUrl,
}: {
  product: Awaited<ReturnType<typeof getProductBySlug>>;
  imageUrl: string | null;
}) {
  if (!product) return null;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? undefined,
    image: imageUrl ? [imageUrl] : undefined,
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.rating_count,
        }
      : undefined,
    offers: product.price_pln
      ? {
          "@type": "Offer",
          priceCurrency: "PLN",
          price: product.price_pln,
          url: product.allegro_url ?? undefined,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

function FaqJsonLd({
  faqs,
}: {
  faqs: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>["faqs"];
}) {
  if (!faqs || faqs.length === 0) return null;
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
