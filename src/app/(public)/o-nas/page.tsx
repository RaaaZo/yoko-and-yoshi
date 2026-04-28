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
              Yoko & Yoshi to my — dwoje ludzi i dwie shiby. Pisaliśmy
              najpierw na własnym blogu, potem ludzie zaczęli pytać
              &bdquo;no dobra, ale co kupić&rdquo; — więc zaczęliśmy
              polecać. Teraz jest tego pełen sklep. Klikasz, kupujesz na
              Allegro u sprawdzonego sprzedawcy, my dostajemy uśmiech, że
              ktoś nam zaufał.
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

        <section id="zwierzaki" className="mt-16 scroll-mt-24">
          <h2 className="mb-5">Poznaj zespół</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <MascotCallout speaker="yoko" title="Yoko — ruda królowa wygody">
              Leniwa, zadowolona, kocha drzemki w słońcu. Rekomenduje
              posłania, miski, pielęgnację — wszystko, co wysyła sygnał:
              zostań chwilę dłużej.
            </MascotCallout>
            <MascotCallout speaker="yoshi" title="Yoshi — kremowy szef ekipy">
              Energiczny, czujny, ciągle w ruchu. Rekomenduje szarpaki,
              piłki, smycze i wszystko, co wymaga sprintu.
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
            Klikasz &quot;Kup na Allegro&quot;, kupujesz u sprawdzonego
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
