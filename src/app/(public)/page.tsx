import Link from "next/link";
import { Suspense } from "react";

import {
  PawPrint,
  Sparkle,
  YokoSitting,
  YokoYoshiTogether,
} from "@/components/brand/icons";
import { NewsletterBox } from "@/components/brand/newsletter-box";
import { PawDivider } from "@/components/brand/paw-divider";
import { ItemTile } from "@/components/product/item-tile";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listArticles } from "@/lib/db/queries/content";
import { getCachedRecommendedProducts } from "@/lib/db/queries/products";
import { getCachedItemTypes } from "@/lib/db/queries/taxonomy";

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
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <NewsletterBox />
        </div>
      </section>
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
            Kuratorska selekcja: szarpaki, piłki, trymery, smycze, posłania,
            transportery. Dla psów, kotów i innych zwierzaków — ze szczególną
            miłością do shib. Klikasz, kupujesz na Allegro, dostajesz pod drzwi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/szukaj">Odkryj produkty</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/o-nas">Poznaj nas</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-7">
            <Stat n="2 400+" l="produktów" />
            <Stat n="48" l="poradników" />
            <Stat n="4,8 ★" l="ocena czytelników" />
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

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="num text-text-primary text-[1.6rem]">{n}</div>
      <div className="text-text-secondary text-[0.82rem]">{l}</div>
    </div>
  );
}

async function ItemTilesSection() {
  const items = await getCachedItemTypes();
  if (items.length === 0) return null;
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          kicker="Kategorie produktów"
          title="Po co dziś tu jesteś?"
          sub="Filtruj od razu po typie rzeczy — nie po gatunku."
        />
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-6">
          {items.map((it) => (
            <ItemTile
              key={it.id}
              href={`/typ/${it.slug}`}
              icon={it.icon_emoji ?? "·"}
              label={it.name}
              count={it.count_cache > 0 ? it.count_cache : undefined}
              softColorToken={it.soft_color_token}
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
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

async function RecommendedSection() {
  const products = await getCachedRecommendedProducts(5);
  if (products.length === 0) return null;
  return (
    <section className="px-6 pt-4 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <SectionHead
            kicker="Polecane przez Yoko & Yoshi"
            title="Tydzień u nas: same dobre wybory"
            inline
          />
          <Button asChild variant="link">
            <Link href="/promocje">Zobacz wszystkie polecane →</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((p) => {
            const primaryImage =
              p.images?.find((i) => i.is_primary) ?? p.images?.[0] ?? null;
            const itemKicker = p.item_types?.[0]?.name ?? null;
            return (
              <ProductCard
                key={p.id}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RecommendedSkeleton() {
  return (
    <section className="px-6 pt-4 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
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
          <Badge tone="primary">⭐ Specjalność firmy</Badge>
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
            Trymery i szczotki radzące sobie z podszerstkiem, szarpaki dla
            mocnych zgryzów, smycze nie do zerwania przez upartego psa — i baza
            wiedzy, której nie znajdziesz nigdzie indziej.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary">
              <Link href="/poradnik/rasy/shiba-inu">Hub rasowy: shiba inu</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/poradnik/rasy/shiba-inu">Polecane akcesoria</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-7">
            <Stat n="180+" l="produktów dla shib" />
            <Stat n="14" l="artykułów rasowych" />
            <Stat n="3 240" l="shib w społeczności" />
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
              read={a.reading_minutes ? `${a.reading_minutes} min` : null}
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

function ArticleCard({
  href,
  tag,
  title,
  read,
}: {
  href: string;
  tag: string;
  title: string;
  read: string | null;
}) {
  return (
    <Link
      href={href}
      className="bg-bg-surface border-border-soft text-text-primary block overflow-hidden rounded-lg border-[1.5px] no-underline"
    >
      <div
        className="relative aspect-[16/10]"
        style={{
          background:
            "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary-soft) 100%)",
        }}
      >
        <div className="absolute top-3.5 left-3.5">
          <Badge tone="cream">{tag}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="mb-2.5 text-[1.15rem] leading-snug">{title}</h3>
        <div className="text-text-muted flex justify-between text-[0.82rem]">
          <span>{read ? `${read} czytania` : "Czytaj poradnik"}</span>
          <span className="text-accent-cyan font-semibold">Czytaj →</span>
        </div>
      </div>
    </Link>
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
