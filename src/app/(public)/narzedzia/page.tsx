import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Narzędzia dla opiekunów psów i kotów",
  description:
    "Quiz doboru zabawki, kalkulator rozmiaru szelek, kalendarz pielęgnacji, kalkulator wieku, starter pack — wszystkie narzędzia Yoko & Yoshi w jednym miejscu.",
  alternates: { canonical: "/narzedzia" },
};

type Tool = {
  href: string;
  emoji: string;
  title: string;
  description: string;
  cta: string;
};

const TOOLS: Tool[] = [
  {
    href: "/quiz/zabawka",
    emoji: "🎯",
    title: "Quiz: dobierz zabawkę",
    description:
      "Trzy pytania i pokażemy, co kupić Twojemu pupilowi. Konkretne produkty z naszych poleconych.",
    cta: "Zacznij quiz",
  },
  {
    href: "/kalkulator-rozmiaru",
    emoji: "📏",
    title: "Kalkulator rozmiaru",
    description:
      "Szelki, obroże, ubranka — wpisz obwody i zobacz, jaki rozmiar zamówić, żeby nie wracać do sprzedawcy.",
    cta: "Policz rozmiar",
  },
  {
    href: "/kalkulator-wieku",
    emoji: "🎂",
    title: "Kalkulator wieku",
    description:
      "Ile lat człowieka ma Twój pies lub kot? Z uwzględnieniem rozmiaru psa — bo małe i duże starzeją się inaczej.",
    cta: "Policz wiek",
  },
  {
    href: "/kalendarz-pielegnacji",
    emoji: "🪮",
    title: "Kalendarz pielęgnacji",
    description:
      "Jak często szczotkować, kąpać, obcinać pazury — dopasowane do gatunku i typu sierści.",
    cta: "Pokaż kalendarz",
  },
  {
    href: "/starter-pack",
    emoji: "🎁",
    title: "Starter pack",
    description:
      "Pełna lista rzeczy, które warto mieć pierwszego dnia ze szczeniakiem lub kociakiem.",
    cta: "Zobacz checklist",
  },
];

export default function ToolsHubPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Badge tone="cyan">Narzędzia</Badge>
        <h1 className="mt-4 mb-3 text-[3rem] leading-tight">
          Narzędzia, które ułatwią Ci życie
        </h1>
        <p className="text-text-secondary mb-10 max-w-2xl text-lg leading-relaxed">
          Pięć małych narzędzi, które rozwiązują typowe &bdquo;nie wiem co wybrać&rdquo;
          przy zakupach dla psa lub kota.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group bg-bg-surface border-border-soft hover:border-primary flex flex-col gap-3 rounded-xl border-2 p-6 no-underline transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-[2.4rem] leading-none">{t.emoji}</div>
              <h2 className="font-display text-text-primary m-0 text-[1.4rem] font-semibold">
                {t.title}
              </h2>
              <p className="text-text-secondary m-0 text-[0.95rem] leading-relaxed">
                {t.description}
              </p>
              <span className="text-accent-cyan mt-auto inline-flex items-center gap-1 pt-2 text-[0.9rem] font-semibold">
                {t.cta}
                <span aria-hidden className="transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
