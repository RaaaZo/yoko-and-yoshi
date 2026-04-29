import type { Metadata } from "next";
import Link from "next/link";

import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AgeCalculatorForm } from "./form";

export const metadata: Metadata = {
  title: "Kalkulator wieku psa i kota — ile to lat człowieka",
  description:
    "Ile lat człowieka ma Twój pies lub kot? Policz dokładnie z uwzględnieniem rozmiaru psa. Plus rekomendacje akcesoriów dopasowane do fazy życia.",
  alternates: { canonical: "/kalkulator-wieku" },
};

export default function AgeCalculatorPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Badge tone="cyan">Narzędzie</Badge>
        <h1 className="mt-4 mb-3 text-[2.6rem] leading-tight">
          Ile lat człowieka ma Twój pupil?
        </h1>
        <p className="text-text-secondary mb-8 text-lg leading-relaxed">
          Stary mit &bdquo;1 rok psa = 7 lat człowieka&rdquo; jest mocno upraszczający.
          Wiek psa zależy od rozmiaru: małe psy żyją nawet 16–18 lat, duże —
          8–10. Policzmy to dokładnie.
        </p>

        <AgeCalculatorForm />

        <PawDivider />

        <MascotCallout speaker="yoko" title="Skąd te liczby?">
          Tablica oparta na wytycznych American Animal Hospital Association
          (AAHA) i American Veterinary Medical Association (AVMA). Dla psów
          uwzględnia rozmiar — bo małe rasy starzeją się wolniej niż duże.
          Dla kotów: pierwszy rok = 15 lat człowieka, drugi rok dodaje 9 lat,
          każdy kolejny — 4.
        </MascotCallout>

        <div className="mt-10 text-center">
          <Button asChild variant="link">
            <Link href="/poradnik">Zobacz poradniki →</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
