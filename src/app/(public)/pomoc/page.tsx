import Link from "next/link";
import type { Metadata } from "next";

import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pomoc i FAQ",
  description:
    "Najczęstsze pytania o yoko&yoshi — jak działają linki do Allegro, dostawa, zwroty, polecane produkty. Nie znalazłeś odpowiedzi? Napisz.",
  alternates: { canonical: "/pomoc" },
};

type FaqItem = { q: string; a: string };
type FaqSection = { heading: string; items: FaqItem[] };

const FAQ_SECTIONS: FaqSection[] = [
  {
    heading: "O serwisie",
    items: [
      {
        q: "Czym jest yoko&yoshi?",
        a: "Jesteśmy polskim przewodnikiem zakupowym dla opiekunów psów i kotów — ze szczególnym targetem na shiby. Wybieramy, opisujemy i polecamy konkretne produkty (zabawki, pielęgnację, akcesoria), a Ty kupujesz je na Allegro u sprawdzonych sprzedawców.",
      },
      {
        q: "Czy jesteście sklepem?",
        a: "Nie. Nie magazynujemy ani nie wysyłamy produktów. Każdy klik „Allegro” prowadzi do oferty u sprzedawcy na Allegro — to on realizuje zamówienie, fakturę i ewentualne zwroty.",
      },
      {
        q: "Dlaczego linki prowadzą do Allegro?",
        a: "Bo to najprostsza i najtańsza droga zakupowa w Polsce: znana platforma, znane warunki, Allegro Smart, kupujący chronieni programem ochrony. Nie chcieliśmy budować kolejnego sklepu, który walczy ceną — wolimy skupić się na tym, co umiemy lepiej: doborze produktów.",
      },
      {
        q: "Kim są Yoko i Yoshi?",
        a: "To nasze dwie shiby. Yoko — ruda, leniwa królowa wygody (poleca posłania, miski, pielęgnację). Yoshi — kremowy, energiczny szef ekipy (poleca szarpaki, piłki, smycze). Każdy produkt na stronie jest opatrzony odznaką „polecane przez Yoko” lub „polecane przez Yoshi”, w zależności od tego, kto by go wybrał.",
      },
      {
        q: "Czy zarabiacie na linkach do Allegro?",
        a: "Tak — uczestniczymy w programie partnerskim Allegro, więc gdy kupisz coś po naszym kliku, dostajemy małą prowizję od sprzedawcy. Dla Ciebie cena pozostaje taka sama. Dzięki temu możemy utrzymywać serwis bez reklam zewnętrznych.",
      },
    ],
  },
  {
    heading: "Zakupy i dostawa",
    items: [
      {
        q: "Jak złożyć zamówienie?",
        a: "Wybierz produkt, kliknij przycisk „Allegro ↗”, dokończ zakup w koszyku Allegro tak jak zwykle. Jeśli nie masz konta Allegro, możesz kupić jako gość lub założyć konto — to chwila.",
      },
      {
        q: "Jak działa dostawa?",
        a: "Dostawę realizuje sprzedawca na Allegro. Większość ofert obsługuje Allegro Smart (darmowa dostawa do paczkomatu lub kuriera od progu cenowego). Czas dostawy widać na stronie konkretnej oferty — zwykle 1–3 dni robocze.",
      },
      {
        q: "Zwroty i reklamacje?",
        a: "Zwroty i reklamacje obsługuje sprzedawca na Allegro — masz 14 dni na zwrot bez podania przyczyny (zgodnie z prawem konsumenckim) i pełną ochronę programu „Allegro Protect”. Jeśli coś idzie nie tak, najpierw skontaktuj się ze sprzedawcą, potem z Allegro. Daj nam znać, jeśli któryś sprzedawca okazał się problematyczny — sprawdzimy i ewentualnie usuniemy ofertę z poleceń.",
      },
      {
        q: "Jakie metody płatności są dostępne?",
        a: "Dostępne są wszystkie metody Allegro: BLIK, karta, przelew, PayPo (raty / odroczona płatność), portfel Allegro Pay. Pełną listę zobaczysz na stronie konkretnej oferty.",
      },
    ],
  },
  {
    heading: "Polecane produkty",
    items: [
      {
        q: "Skąd wiecie, które produkty są dobre?",
        a: "Trzy źródła: testy własne (Yoko i Yoshi sprawdzają, co się da), recenzje innych właścicieli (czytamy setki opinii pod ofertami i na grupach FB) oraz konsultacje z weterynarzami i behawiorystami. Jeśli produkt nie spełnia choćby jednego z naszych kryteriów (jakość, bezpieczeństwo, sensowna cena) — nie trafia na stronę.",
      },
      {
        q: "Co oznacza odznaka „polecane przez Yoko/Yoshi”?",
        a: "Yoko poleca to, co lubi sama: posłania, miski, kosmetyki, akcesoria do drzemki. Yoshi poleca to, co lubi on: szarpaki, piłki, smycze, akcesoria do biegania. Jeśli widzisz odznakę, znaczy że nasza shiba osobiście testowała ten produkt i dała mu zielone światło.",
      },
      {
        q: "Czy testujecie wszystkie produkty?",
        a: "Nie wszystkie — niektóre rzeczy (np. transportery samochodowe, klatki kennelowe) trudno przetestować bez zakupu kilku sztuk. W takich przypadkach polegamy na recenzjach, certyfikatach i konsultacjach. Zawsze zaznaczamy, gdy produkt jest „polecany na podstawie rekomendacji”, a nie własnego testu.",
      },
      {
        q: "Jak często aktualizujecie listę poleconych?",
        a: "Polecane przeglądamy raz w miesiącu — sprawdzamy, czy oferty są nadal aktywne, ceny rozsądne, sprzedawca nie ma świeżych negatywnych ocen. Listę „W tym tygodniu — same dobre wybory” na home rotujemy co tydzień.",
      },
      {
        q: "Mogę zaproponować produkt, który warto polecić?",
        a: "Jasne, bardzo chętnie. Napisz przez formularz na /kontakt — podaj link do oferty Allegro i krótko opisz, dlaczego Twoja shiba (albo Twój kot) to lubi. Nie wszystko trafia na stronę, ale każde zgłoszenie czytamy.",
      },
    ],
  },
];

function jsonLd() {
  const items = FAQ_SECTIONS.flatMap((s) => s.items);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export default function HelpPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Badge tone="cyan">Pomoc</Badge>
        <h1 className="mt-4 mb-3 text-[3rem] leading-tight">
          Najczęstsze pytania
        </h1>
        <p className="text-text-secondary mb-10 text-lg leading-relaxed">
          Jak działa serwis, jak kupujesz, jak dobieramy produkty. Klikaj
          pytania — rozwijają się w odpowiedzi.
        </p>

        {FAQ_SECTIONS.map((section, idx) => (
          <section
            key={section.heading}
            className={idx > 0 ? "mt-10" : undefined}
          >
            <h2 className="mb-2 text-[1.5rem]">{section.heading}</h2>
            <Accordion type="single" collapsible className="text-base">
              {section.items.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`${section.heading}-${i}`}
                >
                  <AccordionTrigger className="text-[1.05rem] leading-snug">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-text-secondary text-[0.98rem] leading-relaxed">
                    <p>{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        <PawDivider />

        <MascotCallout speaker="yoshi" title="Nie znalazłeś odpowiedzi?">
          Napisz do nas — z reguły odpowiadamy tego samego dnia.{" "}
          <Link href="/kontakt" className="font-semibold underline">
            Przejdź do kontaktu →
          </Link>
        </MascotCallout>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
    </article>
  );
}
