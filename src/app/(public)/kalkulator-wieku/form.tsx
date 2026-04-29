"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Species = "pies" | "kot";
type DogSize = "small" | "medium" | "large" | "giant";

const DOG_SIZE_LABELS: Record<DogSize, string> = {
  small: "Mały (do 10 kg)",
  medium: "Średni (10–25 kg)",
  large: "Duży (25–45 kg)",
  giant: "Olbrzymi (45 kg+)",
};

// Każdy kolejny rok po 2. dodaje X lat człowieka. Małe psy starzeją się
// wolniej, olbrzymie — szybciej.
const DOG_PER_YEAR_AFTER_2: Record<DogSize, number> = {
  small: 4,
  medium: 5,
  large: 6,
  giant: 7,
};

function calcDogAge(years: number, size: DogSize): number {
  if (years <= 0) return 0;
  if (years <= 1) return Math.round(15 * years);
  if (years <= 2) return Math.round(15 + 9 * (years - 1));
  return Math.round(24 + DOG_PER_YEAR_AFTER_2[size] * (years - 2));
}

function calcCatAge(years: number): number {
  if (years <= 0) return 0;
  if (years <= 1) return Math.round(15 * years);
  if (years <= 2) return Math.round(15 + 9 * (years - 1));
  return Math.round(24 + 4 * (years - 2));
}

type Phase = {
  label: string;
  description: string;
  recommendCta: string;
  recommendHref: string;
};

function phaseFor(species: Species, years: number): Phase {
  if (species === "pies") {
    if (years < 1)
      return {
        label: "Szczeniak",
        description:
          "Faza intensywnego ząbkowania, socjalizacji i nauki. Niezniszczalne gryzaki to teraz Twój najlepszy przyjaciel.",
        recommendCta: "Zobacz polecane gryzaki dla szczeniaka",
        recommendHref: "/szukaj?cat=szarpaki-gryzaki",
      };
    if (years < 7)
      return {
        label: "Dorosły",
        description:
          "Pełnia sił. Czas na konsekwentny trening, dobre szelki i zabawki dopasowane do temperamentu.",
        recommendCta: "Zrób quiz: jaka zabawka",
        recommendHref: "/quiz/zabawka",
      };
    return {
      label: "Senior",
      description:
        "Stawy i kręgosłup wymagają wsparcia. Ortopedyczne legowiska, miękkie szelki, wolniejsze spacery.",
      recommendCta: "Zobacz posłania dla seniora",
      recommendHref: "/szukaj?cat=poslania",
    };
  }
  if (years < 1)
    return {
      label: "Kocię",
      description:
        "Ciekawość świata na maksa. Małe piłeczki, wędki, drapaki — i dużo zabawy z opiekunem.",
      recommendCta: "Zobacz zabawki dla kociaka",
      recommendHref: "/szukaj?cat=zabawki&species=koty",
    };
  if (years < 10)
    return {
      label: "Dorosły",
      description:
        "Faza stabilna. Drapak, dobry kuwet i interaktywne zabawki to baza dobrego życia.",
      recommendCta: "Zobacz polecane akcesoria dla kota",
      recommendHref: "/zwierzaki/koty",
    };
  return {
    label: "Senior",
    description:
      "Spokojniejsze tempo. Niskie miski, miękkie posłania w ciepłym miejscu, niska kuweta.",
    recommendCta: "Zobacz posłania dla kota",
    recommendHref: "/szukaj?cat=poslania&species=koty",
  };
}

export function AgeCalculatorForm() {
  const [species, setSpecies] = useState<Species>("pies");
  const [age, setAge] = useState("");
  const [size, setSize] = useState<DogSize>("medium");
  const [result, setResult] = useState<{
    human: number;
    phase: Phase;
    years: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const y = Number(age);
    if (!Number.isFinite(y) || y <= 0 || y > 30) {
      setError("Podaj wiek w zakresie 0,1–30 lat.");
      setResult(null);
      return;
    }
    const human = species === "pies" ? calcDogAge(y, size) : calcCatAge(y);
    setError(null);
    setResult({ human, phase: phaseFor(species, y), years: y });
  }

  return (
    <div className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-6">
      <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
        <div>
          <Label className="mb-2 block">Pies czy kot?</Label>
          <div className="flex gap-2">
            {(["pies", "kot"] as Species[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSpecies(s);
                  setResult(null);
                }}
                aria-pressed={species === s}
                className={`font-display flex-1 rounded-full border-2 px-4 py-2 text-[0.95rem] transition ${
                  species === s
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                    : "border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-warm)] text-[color:var(--color-text-primary)]"
                }`}
              >
                {s === "pies" ? "🐕 Pies" : "🐈 Kot"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="age" className="mb-1.5">
            Wiek (lata)
          </Label>
          <Input
            id="age"
            type="number"
            inputMode="decimal"
            min={0.1}
            max={30}
            step={0.5}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="np. 7"
          />
          <p className="text-text-muted mt-1 text-[0.82rem]">
            Możesz wpisać np. 0,5 dla 6 miesięcy.
          </p>
        </div>

        {species === "pies" && (
          <div>
            <Label className="mb-2 block">Rozmiar psa</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(DOG_SIZE_LABELS) as DogSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSize(sz)}
                  aria-pressed={size === sz}
                  className={`rounded-lg border-2 px-3 py-2.5 text-left text-[0.9rem] transition ${
                    size === sz
                      ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary-soft)]"
                      : "border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-warm)]"
                  }`}
                >
                  {DOG_SIZE_LABELS[sz]}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="text-[0.9rem] text-[color:var(--color-danger)]"
          >
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" full>
          Policz wiek
        </Button>
      </form>

      {result && (
        <div className="mt-6 rounded-lg border-2 border-dashed border-[color:var(--color-accent-cyan)] bg-[color:var(--color-bg-warm)] p-5">
          <div className="text-text-muted text-[0.78rem] font-bold tracking-[0.12em] uppercase">
            Wiek w latach człowieka
          </div>
          <div className="font-display mt-1 flex items-baseline gap-3">
            <span className="text-[3.2rem] leading-none">{result.human}</span>
            <span className="text-text-secondary text-[1rem]">lat</span>
          </div>
          <p className="text-text-secondary mt-2 text-[0.95rem] leading-relaxed">
            Twój {species === "pies" ? "pies" : "kot"} ma {result.years}{" "}
            {result.years === 1 ? "rok" : "lat"} — to faza{" "}
            <strong>{result.phase.label.toLowerCase()}</strong>.{" "}
            {result.phase.description}
          </p>
          <div className="mt-4">
            <Button asChild variant="primary" size="sm">
              <Link href={result.phase.recommendHref}>
                {result.phase.recommendCta} →
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
