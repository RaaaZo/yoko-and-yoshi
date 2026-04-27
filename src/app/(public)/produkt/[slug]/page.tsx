import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/brand/breadcrumbs";
import { BadgeRecommended } from "@/components/brand/badge-recommended";
import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { AllegroCTA } from "@/components/product/allegro-cta";
import { ProductCard } from "@/components/product/product-card";
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
import { formatPricePLN } from "@/lib/utils";
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

  return (
    <article className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[
            { label: "Start", href: "/" },
            ...(itemKicker
              ? [
                  {
                    label: itemKicker,
                    href: `/typ/${product.item_types?.[0]?.slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

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
                <span className="text-lg text-[color:var(--color-secondary)]">
                  ★★★★★
                </span>
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
                Cena z Allegro · aktualizowana automatycznie
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

        <p className="text-text-muted mt-12 text-[0.78rem]">
          Linki z przyciskiem &quot;Zobacz na Allegro&quot; to linki
          partnerskie. Cena dla Ciebie się nie zmienia, my dostajemy małą
          prowizję. Czytaj{" "}
          <Link
            href="/informacja-affiliate"
            className="text-accent-cyan underline"
          >
            informację affiliate
          </Link>
          .
        </p>
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
