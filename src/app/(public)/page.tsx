import Link from "next/link";
import { Suspense } from "react";

import {
  PawPrint,
  Sparkle,
  YokoSitting,
  YokoYoshiTogether,
} from "@/components/brand/icons";
import { ArticleCard } from "@/components/brand/article-card";
import { PawDivider } from "@/components/brand/paw-divider";
import { CategoryTile } from "@/components/product/category-tile";
import { Carousel } from "@/components/brand/carousel";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listArticles } from "@/lib/db/queries/content";
import {
  getCachedRecommendedProducts,
  listProductsBySpecies,
} from "@/lib/db/queries/products";
import { getCachedSpecies } from "@/lib/db/queries/taxonomy";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<ItemTilesSkeleton />}>
        <ItemTilesSection />
      </Suspense>
      <PawDivider />
      <Suspense fallback={<RecommendedSkeleton />}>
        <RecommendedSection />
      </Suspense>
      <ShibaPillar />
      <Suspense fallback={<ArticlesSkeleton />}>
        <ArticlesSection />
      </Suspense>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-12 pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Badge tone="secondary">
            <PawPrint size={12} color="#8C5226" />
            Akcesoria · zabawki · pielęgnacja
          </Badge>
          <h1 className="mt-4 mb-4 text-[clamp(2.5rem,5vw,3.6rem)] leading-[1.05]">
            Zabawki, pielęgnacja
            <br />i wszystko poza{" "}
            <span className="text-[color:var(--color-primary)]">miską</span>.
          </h1>
          <p className="text-text-secondary mb-6 max-w-xl text-lg leading-relaxed">
            Polski przewodnik dla opiekunów psów i kotów — ze szczególnym
            targetem na shiby. Polecamy, opisujemy, klikasz na Allegro.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/szukaj">Co polecamy</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/o-nas">Po co tu jesteśmy</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="relative grid place-items-center">
            <YokoYoshiTogether variant="sitting-formal" size={460} priority />
            <div className="absolute top-4 right-5" aria-hidden>
              <Sparkle size={26} />
            </div>
            <div className="absolute bottom-10 left-2 opacity-50" aria-hidden>
              <PawPrint size={28} color="var(--color-border-default)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function ItemTilesSection() {
  const species = await getCachedSpecies();
  // Show only psy and koty as primary species tiles on home.
  const featured = species.filter((s) => s.slug === "psy" || s.slug === "koty");
  if (featured.length === 0) return null;

  // Per-species product counts to fill the tile labels.
  const counts = await Promise.all(
    featured.map((s) => listProductsBySpecies(s.id, 200).then((p) => p.length)),
  );

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          kicker="Wybierz pupila"
          title="Po co dziś tu jesteś?"
          sub="Psy lub koty. Wszystko poza miską."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featured.map((s, i) => (
            <CategoryTile
              key={s.id}
              href={`/zwierzaki/${s.slug}`}
              kind={s.slug === "koty" ? "cat" : "dog"}
              label={s.name}
              count={counts[i] > 0 ? counts[i] : undefined}
              className="py-10"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ItemTilesSkeleton() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

async function RecommendedSection() {
  const products = await getCachedRecommendedProducts(12);
  if (products.length === 0) return null;
  return (
    <section className="px-6 pt-4 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <SectionHead
            kicker="Polecane przez Yoko & Yoshi"
            title="W tym tygodniu — same dobre wybory"
            inline
          />
          <Button asChild variant="link">
            <Link href="/szukaj">Wszystkie polecane →</Link>
          </Button>
        </div>
        <Carousel ariaLabel="Polecane produkty">
          {products.map((p) => {
            const primaryImage =
              p.images?.find((i) => i.is_primary) ?? p.images?.[0] ?? null;
            const itemKicker = p.item_types?.[0]?.name ?? null;
            return (
              <div
                key={p.id}
                className="w-[260px] shrink-0 snap-start sm:w-[280px]"
              >
                <ProductCard
                  href={`/produkt/${p.slug}`}
                  kicker={itemKicker}
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
              </div>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}

function RecommendedSkeleton() {
  return (
    <section className="px-6 pt-4 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-[3/4] w-[260px] shrink-0 rounded-lg sm:w-[280px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShibaPillar() {
  return (
    <section className="px-6 pt-4 pb-8">
      <div
        className="border-border-default mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-xl border-2 border-dashed p-10 md:grid-cols-[1fr_1.2fr]"
        style={{
          background:
            "linear-gradient(135deg, var(--color-secondary-soft) 0%, var(--color-primary-soft) 100%)",
        }}
      >
        <div className="relative grid place-items-center">
          <YokoSitting size={400} />
        </div>
        <div>
          <Badge tone="primary">Robimy to</Badge>
          <h2 className="mt-3 mb-3 text-[2.4rem]">
            Masz{" "}
            <em
              className="not-italic"
              style={{ color: "var(--color-accent-coral)" }}
            >
              shibę
            </em>
            ? Mamy dla niej wszystko.
          </h2>
          <p className="text-text-secondary mb-5 text-[1.05rem] leading-relaxed">
            Trymery i szczotki, które dadzą radę z podszerstkiem. Szarpaki nie
            do zgryzienia w tydzień. Smycze, których nie zerwie najuparciej
            szarpiący pies. Plus baza wiedzy, której nie znajdziesz w polskim
            internecie.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary">
              <Link href="/poradnik/rasy/shiba-inu">Hub rasowy: shiba inu</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/poradnik/rasy/shiba-inu">Polecane akcesoria</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

async function ArticlesSection() {
  const articles = await listArticles({ limit: 3 });
  if (articles.length === 0) return null;
  return (
    <section className="px-6 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <SectionHead
            kicker="Świeżo z dziennika"
            title="Najnowsze poradniki"
            inline
          />
          <Button asChild variant="link">
            <Link href="/poradnik">Wszystkie poradniki →</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              href={`/poradnik/${a.slug}`}
              tag={CATEGORY_LABELS[a.category]}
              title={a.title}
              readingMinutes={a.reading_minutes}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  zywienie: "Żywienie",
  pielegnacja: "Pielęgnacja",
  zdrowie: "Zdrowie",
  rasy: "Rasy",
  akcesoria: "Akcesoria",
  inne: "Inne",
};

function ArticlesSkeleton() {
  return (
    <section className="px-6 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  kicker,
  title,
  sub,
  inline,
}: {
  kicker: string;
  title: string;
  sub?: string;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "" : "max-w-2xl"}>
      <div className="mb-1.5 text-[0.78rem] font-bold tracking-[0.14em] text-[color:var(--color-accent-coral)] uppercase">
        {kicker}
      </div>
      <h2 className={sub ? "mb-2" : "mb-0"}>{title}</h2>
      {sub && (
        <p className="text-text-secondary max-w-2xl text-[1rem]">{sub}</p>
      )}
    </div>
  );
}
