import { Breadcrumbs } from "@/components/brand/breadcrumbs";
import { type SpeciesKind } from "@/components/brand/icons";
import { CategoryTile } from "@/components/product/category-tile";
import { Badge } from "@/components/ui/badge";
import { listSpecies } from "@/lib/db/queries/taxonomy";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Zwierzaki — wybierz gatunek | Yoko & Yoshi",
  description:
    "Psy i koty w Yoko & Yoshi. Wybierz swojego — pokażemy, co dla niego polecamy.",
  alternates: { canonical: "/zwierzaki" },
};

const SPECIES_ICON_MAP: Record<string, SpeciesKind> = {
  psy: "dog",
  koty: "cat",
};

const FEATURED_SPECIES_SLUGS = ["psy", "koty"] as const;

export default async function ZwierzakiIndexPage() {
  const allSpecies = await listSpecies();
  const featured = allSpecies.filter((s) =>
    (FEATURED_SPECIES_SLUGS as readonly string[]).includes(s.slug),
  );

  return (
    <article className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs items={[{ label: "Start", href: "/" }, { label: "Zwierzaki" }]} />

        <header className="mt-6 mb-10">
          <Badge tone="secondary">Wybierz gatunek</Badge>
          <h1 className="mt-3 mb-3 text-[2.6rem] leading-tight">Dla jakiego zwierzaka szukasz?</h1>
          <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
            Psy lub koty. Reszta gatunków — w przygotowaniu. Klik i jesteś.
          </p>
        </header>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featured.map((s) => (
              <CategoryTile
                key={s.id}
                href={`/zwierzaki/${s.slug}`}
                kind={SPECIES_ICON_MAP[s.slug] ?? "dog"}
                label={s.name}
                className="py-10"
              />
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">Wkrótce dodamy gatunki — wróć za chwilę.</p>
        )}
      </div>
    </article>
  );
}
