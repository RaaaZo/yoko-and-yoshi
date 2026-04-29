"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import type { RecommendingMascot } from "@/types/domain";

export type QuizProduct = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  oldPrice: number | null;
  rating: number | null;
  ratingCount: number;
  allegroUrl: string | null;
  recommendedBy: RecommendingMascot;
  imageUrl: string | null;
  imageAlt: string | null;
  blurDataUrl: string | null;
  itemTypeSlugs: string[];
  itemTypeName: string | null;
};

type Species = "psy" | "koty";
type Size = "xs" | "s" | "m" | "l" | "xl";
type Temperament = "nicz" | "aport" | "myśl" | "lenix";

const SIZE_LABELS: Record<Size, string> = {
  xs: "XS — do 5 kg",
  s: "S — 5–10 kg",
  m: "M — 10–25 kg",
  l: "L — 25–45 kg",
  xl: "XL — 45 kg+",
};

const TEMPERAMENT_LABELS: Record<Temperament, { title: string; sub: string }> =
  {
    nicz: {
      title: "Niszczyciel",
      sub: "Każda zabawka znika w tydzień",
    },
    aport: {
      title: "Aporter / biegacz",
      sub: "Lubi rzucać i gonić",
    },
    myśl: {
      title: "Myśliciel",
      sub: "Najbardziej lubi łamigłówki",
    },
    lenix: {
      title: "Przytulacz",
      sub: "Pluszaki i drzemki",
    },
  };

// Map (species + temperament) → preferowane sloty item_type slugów.
function preferredItemTypes(
  species: Species,
  temperament: Temperament,
): string[] {
  if (species === "koty") {
    if (temperament === "myśl") return ["zabawki-interaktywne"];
    if (temperament === "lenix") return ["zabawki-interaktywne", "pilki"];
    return ["pilki", "zabawki-interaktywne"];
  }
  // psy
  if (temperament === "nicz") return ["szarpaki-gryzaki"];
  if (temperament === "aport") return ["pilki", "szarpaki-gryzaki"];
  if (temperament === "myśl") return ["zabawki-interaktywne"];
  return ["zabawki-interaktywne", "szarpaki-gryzaki"];
}

function pickRecommendations(
  pool: QuizProduct[],
  preferred: string[],
  limit = 6,
): QuizProduct[] {
  const score = (p: QuizProduct) => {
    const idx = preferred.findIndex((slug) => p.itemTypeSlugs.includes(slug));
    if (idx === -1) return -1;
    // Earlier in preferred list = higher score
    return preferred.length - idx;
  };
  const scored = pool
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);

  if (scored.length >= limit) return scored.slice(0, limit);

  // Fallback: pad with any toy/play item types from the pool
  const fallback = pool.filter(
    (p) =>
      !scored.includes(p) &&
      p.itemTypeSlugs.some((s) =>
        ["szarpaki-gryzaki", "pilki", "zabawki-interaktywne"].includes(s),
      ),
  );
  return [...scored, ...fallback].slice(0, limit);
}

export function ToyQuiz({
  dogProducts,
  catProducts,
}: {
  dogProducts: QuizProduct[];
  catProducts: QuizProduct[];
}) {
  const [step, setStep] = useState(0);
  const [species, setSpecies] = useState<Species | null>(null);
  const [, setSize] = useState<Size | null>(null);
  const [temperament, setTemperament] = useState<Temperament | null>(null);

  const totalSteps = species === "koty" ? 2 : 3;

  const recommendations = useMemo(() => {
    if (!species || !temperament) return [];
    const pool = species === "koty" ? catProducts : dogProducts;
    const preferred = preferredItemTypes(species, temperament);
    return pickRecommendations(pool, preferred, 8);
  }, [species, temperament, dogProducts, catProducts]);

  function reset() {
    setStep(0);
    setSpecies(null);
    setSize(null);
    setTemperament(null);
  }

  const isComplete = step >= totalSteps;

  return (
    <div className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-6">
      {!isComplete && (
        <div className="mb-5 flex items-center gap-2 text-[0.85rem]">
          <span className="text-text-muted font-semibold tracking-[0.1em] uppercase">
            Krok {step + 1} z {totalSteps}
          </span>
          <div className="bg-bg-warm relative h-1.5 flex-1 overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 left-0 bg-[color:var(--color-primary)] transition-all"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {step === 0 && (
        <div>
          <h2 className="mb-4 text-[1.4rem]">Pies czy kot?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["psy", "koty"] as Species[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSpecies(s);
                  setStep(s === "koty" ? 2 : 1); // koty: pomijamy rozmiar
                }}
                className="font-display rounded-lg border-2 border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-warm)] p-6 text-[1.2rem] transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-soft)]"
              >
                {s === "psy" ? "🐕 Pies" : "🐈 Kot"}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && species === "psy" && (
        <div>
          <h2 className="mb-4 text-[1.4rem]">Jak duży jest Twój pies?</h2>
          <div className="grid gap-2">
            {(Object.keys(SIZE_LABELS) as Size[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => {
                  setSize(sz);
                  setStep(2);
                }}
                className="font-display rounded-lg border-2 border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-warm)] px-4 py-3 text-left text-[1rem] transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-soft)]"
              >
                {SIZE_LABELS[sz]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="text-text-secondary mt-4 text-[0.9rem] underline"
          >
            ← cofnij
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="mb-4 text-[1.4rem]">
            Jaki temperament ma Twój{" "}
            {species === "koty" ? "kot" : "pies"}?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(TEMPERAMENT_LABELS) as Temperament[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTemperament(t);
                  setStep(3);
                }}
                className="rounded-lg border-2 border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-warm)] p-4 text-left transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-soft)]"
              >
                <div className="font-display text-[1.05rem] font-semibold">
                  {TEMPERAMENT_LABELS[t].title}
                </div>
                <div className="text-text-secondary mt-1 text-[0.88rem]">
                  {TEMPERAMENT_LABELS[t].sub}
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(species === "koty" ? 0 : 1)}
            className="text-text-secondary mt-4 text-[0.9rem] underline"
          >
            ← cofnij
          </button>
        </div>
      )}

      {isComplete && species && temperament && (
        <div>
          <div className="text-text-muted text-[0.78rem] font-bold tracking-[0.14em] uppercase">
            Twój wynik
          </div>
          <h2 className="mt-1 mb-2 text-[1.6rem] leading-tight">
            {species === "koty" ? "Dla Twojego kota" : "Dla Twojego psa"} —{" "}
            {TEMPERAMENT_LABELS[temperament].title.toLowerCase()}
          </h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            {recommendations.length > 0
              ? "Wybraliśmy zabawki, które pasują do takiego profilu. Klikaj, żeby zobaczyć szczegóły lub od razu kupić na Allegro."
              : "Na razie nie mamy poleconych dla tego profilu — zerknij na pełny katalog zabawek."}
          </p>

          {recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {recommendations.map((p) => (
                <ProductCard
                  key={p.id}
                  href={`/produkt/${p.slug}`}
                  kicker={p.itemTypeName}
                  name={p.name}
                  imageUrl={p.imageUrl}
                  imageAlt={p.imageAlt ?? p.name}
                  blurDataUrl={p.blurDataUrl}
                  price={p.price}
                  oldPrice={p.oldPrice}
                  recommended={p.recommendedBy}
                  rating={p.rating}
                  ratingCount={p.ratingCount}
                  allegroUrl={p.allegroUrl}
                  productId={p.id}
                />
              ))}
            </div>
          ) : (
            <Button asChild variant="primary">
              <Link
                href={`/szukaj?species=${species === "koty" ? "koty" : "psy"}`}
              >
                Zobacz wszystkie zabawki
              </Link>
            </Button>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={reset}>
              Zrób quiz jeszcze raz
            </Button>
            <Button asChild variant="link">
              <Link href="/szukaj">Przeglądaj cały katalog →</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
