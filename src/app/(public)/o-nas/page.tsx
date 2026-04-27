import { YokoYoshiTogether } from "@/components/brand/icons";
import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kim jesteśmy",
  description:
    "Yoko & Yoshi to dwa shiby — i ekipa, która prowadzi za rękę przez świat zakupów dla zwierzaków. Polecamy, Ty kupujesz na Allegro.",
  alternates: { canonical: "/o-nas" },
};

export default function AboutPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge tone="secondary">O nas</Badge>
            <h1 className="mt-4 mb-4 text-[3rem] leading-tight">
              Cześć — to my, <span className="amp">&</span> nasze shiby.
            </h1>
            <p className="text-text-secondary mb-4 text-lg leading-relaxed">
              Yoko & Yoshi to autorski projekt, który polecił sam siebie. Sklep
              stworzony przez opiekunów dwóch shib, którzy przetestowali tysiąc
              produktów i wybrali tylko te dobre. Jeśli kupisz coś przez nasz
              link, dostaniemy małą prowizję — to jak postawienie nam kawy. Cena
              dla Ciebie się nie zmienia.
            </p>
          </div>
          <div
            className="grid place-items-center rounded-xl p-6"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, var(--color-primary-soft), var(--color-bg-warm) 70%)",
            }}
          >
            <YokoYoshiTogether variant="sitting-relaxed" size={400} priority />
          </div>
        </div>

        <section id="zwierzaki" className="mt-16">
          <h2 className="mb-5">Poznaj zespół</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <MascotCallout speaker="yoko" title="Yoko — rudy szef ekipy">
              Energiczny, ciekawski, ekspresyjny. Rekomenduje aktywności,
              zabawki i wszystko, co wymaga ruchu.
            </MascotCallout>
            <MascotCallout speaker="yoshi" title="Yoshi — kremowy filozof">
              Łagodny, marzycielski, spokojny. Rekomenduje karmę, posłania,
              pielęgnację i wszystko, co wymaga troski.
            </MascotCallout>
          </div>
        </section>

        <PawDivider />

        <h2 className="mb-4">Jak to działa</h2>
        <ol className="prose-yy list-decimal space-y-3 pl-5">
          <li>
            Wybieramy produkty: testujemy, czytamy recenzje, rozmawiamy z
            weterynarzami i behawiorystami.
          </li>
          <li>
            Opisujemy je tak, jakbyśmy polecali znajomemu — bez marketingowego
            bełkotu, z konkretnym &quot;dla kogo&quot; i &quot;dla kogo
            nie&quot;.
          </li>
          <li>
            Klikasz &quot;Zobacz na Allegro&quot;, kupujesz u sprawdzonego
            sprzedawcy, dostajesz pod drzwi.
          </li>
          <li>
            Jeśli coś nie zadziała — wracasz do nas i piszesz. Zmieniamy
            polecenie albo dodajemy ostrzeżenie.
          </li>
        </ol>

        <PawDivider />

        <div className="mx-auto grid place-items-center">
          <YokoYoshiTogether variant="playful-01" size={520} />
        </div>
      </div>
    </article>
  );
}
