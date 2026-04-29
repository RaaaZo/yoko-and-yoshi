"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "szelki" | "obroza" | "ubranko";

type SizeRow = {
  size: string;
  chestMin: number;
  chestMax: number;
  neckMin: number;
  neckMax: number;
  backMin?: number;
  backMax?: number;
};

const SIZE_TABLE: Record<Mode, SizeRow[]> = {
  szelki: [
    { size: "XXS", chestMin: 25, chestMax: 33, neckMin: 18, neckMax: 25 },
    { size: "XS", chestMin: 33, chestMax: 42, neckMin: 22, neckMax: 30 },
    { size: "S", chestMin: 40, chestMax: 52, neckMin: 28, neckMax: 38 },
    { size: "M", chestMin: 50, chestMax: 65, neckMin: 35, neckMax: 48 },
    { size: "L", chestMin: 62, chestMax: 78, neckMin: 44, neckMax: 58 },
    { size: "XL", chestMin: 75, chestMax: 92, neckMin: 54, neckMax: 70 },
    { size: "XXL", chestMin: 88, chestMax: 110, neckMin: 64, neckMax: 84 },
  ],
  obroza: [
    { size: "XXS", chestMin: 0, chestMax: 0, neckMin: 18, neckMax: 24 },
    { size: "XS", chestMin: 0, chestMax: 0, neckMin: 22, neckMax: 30 },
    { size: "S", chestMin: 0, chestMax: 0, neckMin: 28, neckMax: 36 },
    { size: "M", chestMin: 0, chestMax: 0, neckMin: 34, neckMax: 44 },
    { size: "L", chestMin: 0, chestMax: 0, neckMin: 42, neckMax: 54 },
    { size: "XL", chestMin: 0, chestMax: 0, neckMin: 52, neckMax: 66 },
    { size: "XXL", chestMin: 0, chestMax: 0, neckMin: 64, neckMax: 80 },
  ],
  ubranko: [
    {
      size: "XS",
      chestMin: 30,
      chestMax: 40,
      neckMin: 20,
      neckMax: 28,
      backMin: 18,
      backMax: 24,
    },
    {
      size: "S",
      chestMin: 38,
      chestMax: 48,
      neckMin: 26,
      neckMax: 34,
      backMin: 24,
      backMax: 30,
    },
    {
      size: "M",
      chestMin: 46,
      chestMax: 58,
      neckMin: 32,
      neckMax: 42,
      backMin: 30,
      backMax: 38,
    },
    {
      size: "L",
      chestMin: 56,
      chestMax: 70,
      neckMin: 40,
      neckMax: 52,
      backMin: 38,
      backMax: 48,
    },
    {
      size: "XL",
      chestMin: 68,
      chestMax: 84,
      neckMin: 50,
      neckMax: 64,
      backMin: 48,
      backMax: 60,
    },
    {
      size: "XXL",
      chestMin: 82,
      chestMax: 100,
      neckMin: 62,
      neckMax: 78,
      backMin: 58,
      backMax: 72,
    },
  ],
};

type Result = {
  size: string;
  betweenSizes: boolean;
  neighbours: { smaller?: string; larger?: string };
};

function calculate(
  mode: Mode,
  chest: number,
  neck: number,
  back: number,
): Result | null {
  const table = SIZE_TABLE[mode];
  let bestIndex = -1;

  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    const chestOk =
      mode === "obroza" || (chest >= row.chestMin && chest <= row.chestMax);
    const neckOk = neck >= row.neckMin && neck <= row.neckMax;
    const backOk =
      mode !== "ubranko" ||
      (row.backMin !== undefined &&
        row.backMax !== undefined &&
        back >= row.backMin &&
        back <= row.backMax);
    if (chestOk && neckOk && backOk) {
      bestIndex = i;
      break;
    }
  }

  if (bestIndex === -1) {
    // Fall back: pick row whose primary metric range center is closest.
    const primary = mode === "obroza" ? neck : chest;
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const center =
        mode === "obroza"
          ? (row.neckMin + row.neckMax) / 2
          : (row.chestMin + row.chestMax) / 2;
      const dist = Math.abs(primary - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    return {
      size: table[closest].size,
      betweenSizes: true,
      neighbours: {
        smaller: table[closest - 1]?.size,
        larger: table[closest + 1]?.size,
      },
    };
  }

  return {
    size: table[bestIndex].size,
    betweenSizes: false,
    neighbours: {
      smaller: table[bestIndex - 1]?.size,
      larger: table[bestIndex + 1]?.size,
    },
  };
}

export function SizeCalculatorForm() {
  const [mode, setMode] = useState<Mode>("szelki");
  const [chest, setChest] = useState("");
  const [neck, setNeck] = useState("");
  const [back, setBack] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const c = Number(chest);
    const n = Number(neck);
    const b = Number(back);

    if (mode === "obroza") {
      if (!Number.isFinite(n) || n < 10 || n > 100) {
        setError("Podaj obwód szyi w zakresie 10–100 cm.");
        setResult(null);
        return;
      }
    } else {
      if (!Number.isFinite(c) || c < 15 || c > 130) {
        setError("Podaj obwód klatki w zakresie 15–130 cm.");
        setResult(null);
        return;
      }
      if (!Number.isFinite(n) || n < 10 || n > 100) {
        setError("Podaj obwód szyi w zakresie 10–100 cm.");
        setResult(null);
        return;
      }
      if (mode === "ubranko" && (!Number.isFinite(b) || b < 10 || b > 90)) {
        setError("Podaj długość grzbietu w zakresie 10–90 cm.");
        setResult(null);
        return;
      }
    }

    setError(null);
    setResult(calculate(mode, c, n, b));
  }

  return (
    <div className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-6">
      <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
        <div>
          <Label className="mb-2 block">Co dobierasz?</Label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["szelki", "Szelki"],
                ["obroza", "Obrożę"],
                ["ubranko", "Ubranko"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  setResult(null);
                  setError(null);
                }}
                aria-pressed={mode === value}
                className={`font-display rounded-full border-2 px-4 py-2 text-[0.9rem] transition ${
                  mode === value
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                    : "border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-warm)] text-[color:var(--color-text-primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode !== "obroza" && (
          <div>
            <Label htmlFor="chest" className="mb-1.5">
              Obwód klatki piersiowej (cm)
            </Label>
            <Input
              id="chest"
              type="number"
              inputMode="decimal"
              min={15}
              max={130}
              step={0.5}
              value={chest}
              onChange={(e) => setChest(e.target.value)}
              placeholder="np. 56"
            />
          </div>
        )}

        <div>
          <Label htmlFor="neck" className="mb-1.5">
            Obwód szyi (cm)
          </Label>
          <Input
            id="neck"
            type="number"
            inputMode="decimal"
            min={10}
            max={100}
            step={0.5}
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder="np. 38"
          />
        </div>

        {mode === "ubranko" && (
          <div>
            <Label htmlFor="back" className="mb-1.5">
              Długość grzbietu (cm)
            </Label>
            <Input
              id="back"
              type="number"
              inputMode="decimal"
              min={10}
              max={90}
              step={0.5}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="np. 32"
            />
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
          Pokaż rozmiar
        </Button>
      </form>

      {result && (
        <div className="mt-6 rounded-lg border-2 border-dashed border-[color:var(--color-accent-cyan)] bg-[color:var(--color-bg-warm)] p-5">
          <div className="text-text-muted text-[0.78rem] font-bold tracking-[0.12em] uppercase">
            Polecany rozmiar
          </div>
          <div className="font-display mt-1 text-[3rem] leading-none">
            {result.size}
          </div>
          {result.betweenSizes ? (
            <p className="text-text-secondary mt-2 text-[0.95rem] leading-relaxed">
              Twój pies jest między rozmiarami — najbliżej {result.size}, ale
              warto rozważyć też{" "}
              {[result.neighbours.smaller, result.neighbours.larger]
                .filter(Boolean)
                .join(" lub ")}
              . Zasada: jeśli wahasz się, wybierz większy rozmiar (zwłaszcza w
              szelkach).
            </p>
          ) : (
            <p className="text-text-secondary mt-2 text-[0.95rem] leading-relaxed">
              {result.neighbours.smaller && result.neighbours.larger ? (
                <>
                  Sąsiednie rozmiary to {result.neighbours.smaller} i{" "}
                  {result.neighbours.larger}. Jeśli pies jeszcze rośnie, weź
                  większy.
                </>
              ) : (
                <>
                  Pamiętaj: różni producenci mają minimalnie różne tabele
                  (±2 cm). Jeśli oferta pozwala na zwrot — zamów dwa rozmiary i
                  zostaw lepiej leżący.
                </>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
