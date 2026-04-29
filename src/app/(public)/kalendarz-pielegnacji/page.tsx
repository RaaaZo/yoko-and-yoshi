import type { Metadata } from "next";
import Link from "next/link";

import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { GroomingCalendarForm } from "./form";

export const metadata: Metadata = {
  title: "Kalendarz pielęgnacji psa i kota",
  description:
    "Jak często szczotkować, kąpać, obcinać pazury — zależy od typu sierści. Dobierz kalendarz pielęgnacji do swojego pupila i zobacz polecane akcesoria.",
  alternates: { canonical: "/kalendarz-pielegnacji" },
};

export default function GroomingCalendarPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Badge tone="cyan">Narzędzie</Badge>
        <h1 className="mt-4 mb-3 text-[2.6rem] leading-tight">
          Kalendarz pielęgnacji
        </h1>
        <p className="text-text-secondary mb-8 text-lg leading-relaxed">
          Pielęgnacja zależy od gatunku i typu sierści. Wybierz profil pupila,
          a my pokażemy harmonogram szczotkowania, kąpieli, pazurów i uszu —
          plus polecane akcesoria do każdej czynności.
        </p>

        <GroomingCalendarForm />

        <PawDivider />

        <MascotCallout speaker="yoshi" title="Pamiętaj">
          To kalendarz wyjściowy. Konkretną częstotliwość dostosuj do swojego
          pupila — pies wracający z błotnistego spaceru potrzebuje kąpieli
          częściej niż domowy kanapowiec. W razie problemów skórnych zawsze
          konsultuj się z weterynarzem.
        </MascotCallout>

        <div className="mt-10 text-center">
          <Button asChild variant="link">
            <Link href="/poradnik?cat=pielegnacja">
              Zobacz poradniki o pielęgnacji →
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
