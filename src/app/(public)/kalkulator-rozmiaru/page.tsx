import type { Metadata } from "next";
import Link from "next/link";

import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { SizeCalculatorForm } from "./form";

export const metadata: Metadata = {
  title: "Kalkulator rozmiaru szelek, obroży i ubranek dla psa",
  description:
    "Zmierz pupila i sprawdź, jaki rozmiar szelek, obroży lub ubranka kupić. Obwód klatki, szyi, długość grzbietu — pokażemy rozmiar i polecimy konkretne produkty.",
  alternates: { canonical: "/kalkulator-rozmiaru" },
};

export default function SizeCalculatorPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Badge tone="cyan">Narzędzie</Badge>
        <h1 className="mt-4 mb-3 text-[2.6rem] leading-tight">
          Jaki rozmiar szelek, obroży lub ubranka?
        </h1>
        <p className="text-text-secondary mb-8 text-lg leading-relaxed">
          Złe szelki uciskają, za luźne — wyślizgują się przez głowę. Wpisz
          obwody Twojego psa i zobacz, jaki rozmiar zamówić oraz które modele
          polecamy w tym przedziale.
        </p>

        <SizeCalculatorForm />

        <PawDivider />

        <MascotCallout speaker="yoko" title="Jak prawidłowo zmierzyć?">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Obwód klatki:</strong> najszersze miejsce — tuż za
              przednimi łapami, wokół klatki piersiowej.
            </li>
            <li>
              <strong>Obwód szyi:</strong> w miejscu, gdzie obroża ma leżeć —
              zazwyczaj u nasady szyi.
            </li>
            <li>
              <strong>Długość grzbietu</strong> (do ubranka): od kłębu (między
              łopatkami) do nasady ogona.
            </li>
            <li>
              Mierz miarką krawiecką ułożoną przylegająco, ale bez ucisku —
              powinny się zmieścić dwa palce między miarką a sierścią.
            </li>
          </ul>
        </MascotCallout>

        <div className="mt-10 text-center">
          <Button asChild variant="link">
            <Link href="/szukaj?cat=szelki">Zobacz wszystkie szelki →</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
