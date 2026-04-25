import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informacja affiliate",
  description:
    "Jak działają linki partnerskie na Yoko & Yoshi. Pełna transparentność: co dostajemy, jak na to wpływa nasze polecenia.",
  alternates: { canonical: "/informacja-affiliate" },
};

export default function AffiliateInfoPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Badge tone="cyan">Pełna transparentność</Badge>
        <h1 className="mt-4 mb-6 text-[2.6rem] leading-tight">
          Jak działają linki partnerskie
        </h1>
        <div className="prose-yy">
          <p>
            Yoko & Yoshi jest serwisem afiliacyjnym. Oznacza to, że gdy klikasz
            przycisk &quot;Zobacz na Allegro&quot; i dokonujesz zakupu,
            dostajemy niewielką prowizję od sprzedawcy — najczęściej kilka
            procent wartości zamówienia.
          </p>
          <h2>Co to znaczy dla Ciebie</h2>
          <p>
            <strong>Cena dla Ciebie się nie zmienia.</strong> Płacisz dokładnie
            tyle samo, co bez naszego linku. Prowizję pokrywa sprzedawca z
            własnej marży.
          </p>
          <h2>Co to znaczy dla nas</h2>
          <p>
            Dzięki prowizji utrzymujemy serwis, kupujemy produkty do testów i
            piszemy poradniki, których nigdzie indziej nie znajdziesz. Bez tego
            modelu nie byłoby tej witryny.
          </p>
          <h2>Czy to wpływa na nasze polecenia?</h2>
          <p>
            <strong>Wpływa, w sposób który Ci wytłumaczymy:</strong> nie
            polecamy produktów, których nie kupowalibyśmy sami. Nie ukrywamy
            wad. Jeśli jakaś rzecz jest słaba — albo jej nie polecamy, albo
            piszemy wprost &quot;nie kupuj jeśli X&quot;.
          </p>
          <p>
            Z drugiej strony — częściej polecamy produkty dostępne na Allegro
            niż na innych platformach. To dlatego, że to jedyna platforma, z
            którą mamy umowę afiliacyjną. Jeśli znajdziesz coś taniej gdzie
            indziej — kupuj tam.
          </p>
          <h2>Jak rozpoznać link partnerski</h2>
          <p>
            Każdy link do Allegro na tej witrynie jest linkiem afiliacyjnym. W
            kodzie HTML mają atrybut <code>rel=&quot;sponsored&quot;</code> —
            zgodnie z wytycznymi Google.
          </p>
          <h2>Jeśli masz pytania</h2>
          <p>
            Pisz na <a href="mailto:hej@yokoyoshi.pl">hej@yokoyoshi.pl</a> albo
            przez <a href="/kontakt">formularz kontaktowy</a>.
          </p>
        </div>
      </div>
    </article>
  );
}
