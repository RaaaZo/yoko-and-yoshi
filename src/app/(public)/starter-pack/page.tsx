import type { Metadata } from "next";
import Link from "next/link";

import { MascotCallout } from "@/components/brand/mascot-callout";
import { PawDivider } from "@/components/brand/paw-divider";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { listProductsByItemTypeSlug } from "@/lib/db/queries/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Starter pack: szczeniak i kociak — co kupić na start",
  description:
    "Pełna lista rzeczy, które warto mieć w domu pierwszego dnia ze szczeniakiem lub kociakiem. Po kolei, z konkretnymi propozycjami produktów.",
  alternates: { canonical: "/starter-pack" },
};

type ChecklistItem = {
  title: string;
  description: string;
  itemTypeSlug: string;
};

type ChecklistSection = {
  heading: string;
  emoji: string;
  items: ChecklistItem[];
};

const PUPPY_SECTIONS: ChecklistSection[] = [
  {
    heading: "Dom",
    emoji: "🏠",
    items: [
      {
        title: "Posłanie / kojec",
        description:
          "Miękkie, w ustronnym miejscu, dopasowane rozmiarem. Kojec zamykany pomaga w treningu czystości i bezpieczeństwie nocą.",
        itemTypeSlug: "poslania",
      },
      {
        title: "Miski na wodę i jedzenie",
        description:
          "Stalowa lub ceramiczna (plastikowa się rysuje, gromadzi bakterie). Osobne na wodę i karmę.",
        itemTypeSlug: "miski-poidla",
      },
      {
        title: "Transporter",
        description:
          "Niezbędny u weterynarza, w aucie, w pociągu. Na początek mniejszy — szczeniak lubi się czuć bezpiecznie w ciasnym miejscu.",
        itemTypeSlug: "transportery",
      },
    ],
  },
  {
    heading: "Spacer",
    emoji: "🚶",
    items: [
      {
        title: "Szelki",
        description:
          "Dla szczeniaka lepsze niż obroża — nie obciążają kręgosłupa szyjnego. Pamiętaj, że pies rośnie — kup z zapasem regulacji.",
        itemTypeSlug: "szelki",
      },
      {
        title: "Smycz",
        description:
          "Klasyczna 2–3 metrowa, plus krótka miejska na chodnik. Flexi (rozsuwana) — dopiero po podstawowym treningu chodzenia przy nodze.",
        itemTypeSlug: "smycze-obroze",
      },
    ],
  },
  {
    heading: "Pielęgnacja",
    emoji: "🧴",
    items: [
      {
        title: "Szczotka i obcinacz pazurów",
        description:
          "Dopasuj do typu sierści. Pazury obcinaj od pierwszych dni, nawet symbolicznie — szczeniak musi się przyzwyczaić.",
        itemTypeSlug: "trymery-szczotki",
      },
      {
        title: "Szampon dla psa",
        description:
          "Tylko dedykowany — ludzki ma złe pH. Na początek delikatny, hipoalergiczny.",
        itemTypeSlug: "pielegnacja",
      },
    ],
  },
  {
    heading: "Zabawa i edukacja",
    emoji: "🦴",
    items: [
      {
        title: "Gryzaki na ząbkowanie",
        description:
          "Szczeniak gryzie WSZYSTKO między 3. a 7. miesiącem. Bez gryzaków — gryzie buty.",
        itemTypeSlug: "szarpaki-gryzaki",
      },
      {
        title: "Zabawki interaktywne",
        description:
          "Mata węchowa, kong, puzzle z karmą. Zmęczony psychicznie pies = spokojny pies.",
        itemTypeSlug: "zabawki-interaktywne",
      },
      {
        title: "Piłka",
        description:
          "Nie za mała (nie połknie), nie za twarda (nie złamie zęba). Guma naturalna lub specjalna pianka.",
        itemTypeSlug: "pilki",
      },
    ],
  },
];

const KITTEN_SECTIONS: ChecklistSection[] = [
  {
    heading: "Dom",
    emoji: "🏠",
    items: [
      {
        title: "Posłanie",
        description:
          "Kot wybiera sam — przygotuj 2–3 miejsca: koszyk, legowisko, wysoka półka. Najczęściej i tak będzie spał na pralce.",
        itemTypeSlug: "poslania",
      },
      {
        title: "Miski",
        description:
          "Stalowe lub ceramiczne, osobne na wodę i karmę. Wodę najlepiej w fontannie (kot pije więcej z bieżącej).",
        itemTypeSlug: "miski-poidla",
      },
      {
        title: "Transporter",
        description:
          "Niezbędny do weterynarza. Twardy plastik z otwieranym wiekiem od góry — łatwiej wyjąć opornego kota.",
        itemTypeSlug: "transportery",
      },
    ],
  },
  {
    heading: "Higiena (kotowa świętość)",
    emoji: "🚽",
    items: [
      {
        title: "Kuweta i żwirek",
        description:
          "Reguła: liczba kotów + 1 kuweta. Otwartą lub zamkniętą — większość kotów woli otwartą i z wysokimi bokami.",
        itemTypeSlug: "akcesoria-podrozne",
      },
      {
        title: "Drapak",
        description:
          "Bez drapaka kot zniszczy meble. Wysoki (żeby się rozciągnął), stabilny, z sizalu lub jutowanego włókna.",
        itemTypeSlug: "akcesoria-podrozne",
      },
    ],
  },
  {
    heading: "Pielęgnacja",
    emoji: "🧴",
    items: [
      {
        title: "Szczotka",
        description:
          "Codzienne wyczesywanie u długowłosych, raz w tygodniu u krótkowłosych. Furminator = zbawienie w sezonie linienia.",
        itemTypeSlug: "trymery-szczotki",
      },
      {
        title: "Obcinacz pazurów",
        description:
          "Tylko końcówki. Drapak nie wystarcza — tylne pazury i tak trzeba obcinać.",
        itemTypeSlug: "pielegnacja",
      },
    ],
  },
  {
    heading: "Zabawa",
    emoji: "🧶",
    items: [
      {
        title: "Wędka i piłeczki",
        description:
          "Kot łowi — codzienna polowanka 10–15 min, inaczej znudzony rozkręca chaos w nocy.",
        itemTypeSlug: "pilki",
      },
      {
        title: "Zabawki interaktywne",
        description:
          "Maty węchowe, podajniki z kibblem, tunele. Stymulują naturalne instynkty łowieckie.",
        itemTypeSlug: "zabawki-interaktywne",
      },
    ],
  },
];

async function ItemBlock({ item }: { item: ChecklistItem }) {
  const products = await listProductsByItemTypeSlug(item.itemTypeSlug, 2);
  return (
    <div className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-5">
      <h3 className="font-display mb-1.5 text-[1.1rem] font-semibold">
        {item.title}
      </h3>
      <p className="text-text-secondary mb-4 text-[0.95rem] leading-relaxed">
        {item.description}
      </p>
      {products.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {products.map((p) => {
            const primary =
              p.images?.find((i) => i.is_primary) ?? p.images?.[0] ?? null;
            return (
              <ProductCard
                key={p.id}
                href={`/produkt/${p.slug}`}
                kicker={p.item_types?.[0]?.name ?? null}
                name={p.name}
                imageUrl={primary?.url}
                imageAlt={primary?.alt ?? p.name}
                blurDataUrl={primary?.blur_data_url}
                price={p.price_pln}
                oldPrice={p.price_old_pln}
                recommended={p.recommending_mascot}
                rating={p.rating}
                ratingCount={p.rating_count}
                allegroUrl={p.allegro_url}
                productId={p.id}
              />
            );
          })}
        </div>
      ) : (
        <Button asChild variant="link">
          <Link href={`/szukaj?cat=${item.itemTypeSlug}`}>
            Zobacz w katalogu →
          </Link>
        </Button>
      )}
    </div>
  );
}

function Section({ section }: { section: ChecklistSection }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-[1.6rem]">
        <span className="mr-2" aria-hidden>
          {section.emoji}
        </span>
        {section.heading}
      </h2>
      <div className="grid gap-4">
        {section.items.map((item) => (
          <ItemBlock key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

function PuppyTab() {
  return (
    <>
      {PUPPY_SECTIONS.map((s) => (
        <Section key={s.heading} section={s} />
      ))}
    </>
  );
}

function KittenTab() {
  return (
    <>
      {KITTEN_SECTIONS.map((s) => (
        <Section key={s.heading} section={s} />
      ))}
    </>
  );
}

export default function StarterPackPage() {
  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Badge tone="primary">Starter pack</Badge>
        <h1 className="mt-4 mb-3 text-[2.6rem] leading-tight">
          Pierwszy szczeniak lub kociak? Oto checklist.
        </h1>
        <p className="text-text-secondary mb-8 text-lg leading-relaxed">
          Lista rzeczy, które warto mieć w domu pierwszego dnia. Po kolei,
          z opisem &bdquo;dlaczego to ważne&rdquo; i konkretnymi propozycjami z naszych
          poleconych.
        </p>

        <Tabs defaultValue="szczeniak" className="gap-6">
          <TabsList className="bg-bg-warm h-11 w-full">
            <TabsTrigger value="szczeniak" className="text-[0.95rem]">
              🐶 Szczeniak
            </TabsTrigger>
            <TabsTrigger value="kociak" className="text-[0.95rem]">
              🐱 Kociak
            </TabsTrigger>
          </TabsList>

          <TabsContent value="szczeniak">
            <PuppyTab />
          </TabsContent>
          <TabsContent value="kociak">
            <KittenTab />
          </TabsContent>
        </Tabs>

        <PawDivider />

        <MascotCallout speaker="yoshi" title="Wskazówka">
          Nie kupuj wszystkiego naraz. Pierwsze tygodnie to obserwacja —
          dopiero po nich wiesz, czy Twój pies woli pluszaki czy gryzaki, czy
          kot lubi tunel czy zabawki na sznurku. Lepiej dokupić niż mieć
          szafę nieruszanych rzeczy.
        </MascotCallout>
      </div>
    </article>
  );
}
