"use client";

import Link from "next/link";
import { useState } from "react";

import { Label } from "@/components/ui/label";

type Species = "pies" | "kot";
type Coat = "krotka" | "srednia" | "dluga" | "podszerstkowa" | "bezsiercna";

const COAT_LABELS: Record<Coat, string> = {
  krotka: "Krótka, gładka",
  srednia: "Średnia",
  dluga: "Długa",
  podszerstkowa: "Z gęstym podszerstkiem (np. shiba, husky, maine coon)",
  bezsiercna: "Bezsierściowa lub kędzierzawa (np. sfinks, pudel)",
};

type Task = {
  title: string;
  frequency: string;
  notes: string;
  shopHref: string;
  shopLabel: string;
};

function tasksFor(species: Species, coat: Coat): Task[] {
  const isCat = species === "kot";

  const brushing: Task = (() => {
    if (coat === "krotka")
      return {
        title: "Szczotkowanie",
        frequency: "1× w tygodniu",
        notes: isCat
          ? "Wystarczy gumowa rękawica lub miękka szczotka — bardziej dla rytuału niż konieczności."
          : "Krótka rękawica zbierająca martwe włosy. Po spacerze w słocie warto przeczesać.",
        shopHref: "/szukaj?cat=trymery-szczotki",
        shopLabel: "Szczotki",
      };
    if (coat === "srednia")
      return {
        title: "Szczotkowanie",
        frequency: "2–3× w tygodniu",
        notes:
          "Średnia szczotka pinowa lub furminator co kilka dni — zapobiega kołtunom.",
        shopHref: "/szukaj?cat=trymery-szczotki",
        shopLabel: "Szczotki",
      };
    if (coat === "dluga")
      return {
        title: "Szczotkowanie",
        frequency: "Codziennie",
        notes:
          "Długi włos kołtuni się błyskawicznie. Codzienna szczotka pinowa + grzebień metalowy do końcówek.",
        shopHref: "/szukaj?cat=trymery-szczotki",
        shopLabel: "Szczotki i grzebienie",
      };
    if (coat === "podszerstkowa")
      return {
        title: "Szczotkowanie",
        frequency: "2× w tygodniu (+ codziennie w sezonie linienia)",
        notes:
          "Furminator lub karda na podszerstek. Dwa razy w roku (wiosna/jesień) sezon zrzucania — wtedy codziennie.",
        shopHref: "/szukaj?cat=trymery-szczotki",
        shopLabel: "Furminatory",
      };
    return {
      title: "Pielęgnacja sierści",
      frequency: "1× w tygodniu",
      notes: isCat
        ? "Sfinks: przecieranie ciepłą wodą lub wilgotną ściereczką, bo skóra wytwarza nadmiar łoju."
        : "Pudel/kędzierzawe: wyczesywanie kołtunów + strzyżenie u groomera co 6–8 tyg.",
      shopHref: "/szukaj?cat=pielegnacja",
      shopLabel: "Akcesoria pielęgnacyjne",
    };
  })();

  const bath: Task = {
    title: "Kąpiel",
    frequency: isCat
      ? coat === "bezsiercna"
        ? "Co 2–4 tygodnie"
        : "Wg potrzeby (kot zwykle myje się sam)"
      : coat === "podszerstkowa"
        ? "Co 6–8 tygodni"
        : "Co 4–6 tygodni",
    notes: isCat
      ? "Kot rzadko potrzebuje kąpieli. Sfinks i niektóre rasy bezsierściowe — tak. Tylko szampon dedykowany dla kotów."
      : "Tylko szampon dla psów (ludzki ma złe pH). Po kąpieli dokładnie wysuszyć, zwłaszcza podszerstek.",
    shopHref: "/szukaj?cat=pielegnacja",
    shopLabel: "Szampony",
  };

  const claws: Task = {
    title: "Pazury",
    frequency: isCat ? "Co 2–3 tygodnie" : "Co 3–4 tygodnie",
    notes: isCat
      ? "Tylko końcówki. Jeśli kot ma drapak — zwykle dba o pazury sam, ale tylne często wymagają pomocy."
      : "Obcinaj tylko biały koniec. Jeśli pazur jest ciemny — z latarką znajdziesz żywy róg.",
    shopHref: "/szukaj?cat=pielegnacja",
    shopLabel: "Obcinacze",
  };

  const ears: Task = {
    title: "Uszy",
    frequency: isCat
      ? "Sprawdzaj co 2 tygodnie"
      : coat === "podszerstkowa"
        ? "Sprawdzaj co 1–2 tygodnie"
        : "Sprawdzaj co 2 tygodnie, czyść w razie potrzeby",
    notes: isCat
      ? "Czyste uszy = bezbarwne. Brązowy nalot lub świąd → weterynarz."
      : "Psy z zwisającymi uszami (np. cocker) — częściej. Tylko płyn dedykowany, nigdy patyczki kosmetyczne.",
    shopHref: "/szukaj?cat=pielegnacja",
    shopLabel: "Płyny do uszu",
  };

  const teeth: Task = {
    title: "Zęby",
    frequency: "2–3× w tygodniu",
    notes:
      "Pasta enzymatyczna na palcu lub szczoteczce. Kamień nazębny → wizyta u weterynarza, regularne mycie zapobiega.",
    shopHref: "/szukaj?cat=pielegnacja",
    shopLabel: "Pasty i szczoteczki",
  };

  return [brushing, bath, claws, ears, teeth];
}

export function GroomingCalendarForm() {
  const [species, setSpecies] = useState<Species>("pies");
  const [coat, setCoat] = useState<Coat>("srednia");

  const tasks = tasksFor(species, coat);

  return (
    <div>
      <div className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-6">
        <div className="grid gap-5">
          <div>
            <Label className="mb-2 block">Pies czy kot?</Label>
            <div className="flex gap-2">
              {(["pies", "kot"] as Species[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecies(s)}
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
            <Label className="mb-2 block">Typ sierści</Label>
            <div className="grid gap-2">
              {(Object.keys(COAT_LABELS) as Coat[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCoat(c)}
                  aria-pressed={coat === c}
                  className={`rounded-lg border-2 px-3 py-2.5 text-left text-[0.92rem] transition ${
                    coat === c
                      ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary-soft)]"
                      : "border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-warm)]"
                  }`}
                >
                  {COAT_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {tasks.map((t) => (
          <div
            key={t.title}
            className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-[1.15rem] font-semibold">
                {t.title}
              </h3>
              <span className="font-display rounded-full bg-[color:var(--color-secondary-soft)] px-3 py-1 text-[0.82rem] text-[color:var(--color-text-primary)]">
                {t.frequency}
              </span>
            </div>
            <p className="text-text-secondary mt-2 text-[0.95rem] leading-relaxed">
              {t.notes}
            </p>
            <Link
              href={t.shopHref}
              className="text-accent-cyan mt-3 inline-block text-[0.88rem] font-semibold underline"
            >
              {t.shopLabel} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
