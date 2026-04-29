import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { listProductsBySpecies } from "@/lib/db/queries/products";
import { getCachedSpecies } from "@/lib/db/queries/taxonomy";
import type { Product } from "@/types/domain";

import { ToyQuiz, type QuizProduct } from "./quiz";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Quiz: dobierz zabawkę dla psa lub kota",
  description:
    "Trzy pytania — gatunek, rozmiar, temperament — i pokażemy, jaką zabawkę pokocha Twój pupil. Konkretne produkty z naszych poleconych.",
  alternates: { canonical: "/quiz/zabawka" },
};

function toQuizProduct(p: Product): QuizProduct {
  const primary = p.images?.find((i) => i.is_primary) ?? p.images?.[0] ?? null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price_pln,
    oldPrice: p.price_old_pln,
    rating: p.rating,
    ratingCount: p.rating_count,
    allegroUrl: p.allegro_url,
    recommendedBy: p.recommending_mascot,
    imageUrl: primary?.url ?? null,
    imageAlt: primary?.alt ?? null,
    blurDataUrl: primary?.blur_data_url ?? null,
    itemTypeSlugs: (p.item_types ?? []).map((t) => t.slug),
    itemTypeName: p.item_types?.[0]?.name ?? null,
  };
}

export default async function ToyQuizPage() {
  const species = await getCachedSpecies();
  const dogSpecies = species.find((s) => s.slug === "psy");
  const catSpecies = species.find((s) => s.slug === "koty");

  const [dogProducts, catProducts] = await Promise.all([
    dogSpecies ? listProductsBySpecies(dogSpecies.id, 200) : Promise.resolve([]),
    catSpecies ? listProductsBySpecies(catSpecies.id, 200) : Promise.resolve([]),
  ]);

  return (
    <article className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Badge tone="primary">Quiz</Badge>
        <h1 className="mt-4 mb-3 text-[2.6rem] leading-tight">
          Dobierz zabawkę w 30 sekund
        </h1>
        <p className="text-text-secondary mb-8 text-lg leading-relaxed">
          Każdy pies i kot lubi co innego. Odpowiedz na trzy pytania, a Yoko
          i Yoshi powiedzą, co kupić.
        </p>

        <ToyQuiz
          dogProducts={dogProducts.map(toQuizProduct)}
          catProducts={catProducts.map(toQuizProduct)}
        />
      </div>
    </article>
  );
}
