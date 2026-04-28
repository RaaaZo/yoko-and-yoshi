import Link from "next/link";

import { ArticleCard } from "@/components/brand/article-card";
import { EmptyState } from "@/components/brand/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listArticles } from "@/lib/db/queries/content";
import type { Article } from "@/types/domain";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Poradniki",
  description:
    "Poradniki o psach, kotach i innych zwierzakach. Pielęgnacja, zachowanie, akcesoria.",
};

const CATEGORY_LABELS: Record<Article["category"], string> = {
  zywienie: "Żywienie",
  pielegnacja: "Pielęgnacja",
  zdrowie: "Zdrowie",
  rasy: "Rasy",
  akcesoria: "Akcesoria",
  inne: "Inne",
};

const FILTERABLE: Array<Article["category"]> = [
  "rasy",
  "pielegnacja",
  "zdrowie",
  "akcesoria",
];

function isCategory(value: string | undefined): value is Article["category"] {
  return value !== undefined && value in CATEGORY_LABELS;
}

type SP = Promise<{ cat?: string }>;

export default async function GuidesIndexPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const activeCategory = isCategory(sp.cat) ? sp.cat : undefined;

  const articles = await listArticles({
    limit: 50,
    category: activeCategory,
  });

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3">Poradniki</h1>
        <p className="text-text-secondary mb-6 max-w-2xl text-lg">
          Wszystko, co warto wiedzieć o psach, kotach i zwierzakach, których
          jeszcze nie mamy. Pielęgnacja, zachowanie, polecane akcesoria —
          głównie z myślą o opiekunach shib, ale przyda się każdemu.
        </p>

        <nav
          aria-label="Filtruj poradniki"
          className="mb-8 flex flex-wrap items-center gap-2"
        >
          <Link href="/poradnik" className="no-underline">
            <Badge tone={activeCategory ? "outline" : "cyan"}>Wszystkie</Badge>
          </Link>
          {FILTERABLE.map((c) => (
            <Link key={c} href={`/poradnik?cat=${c}`} className="no-underline">
              <Badge tone={activeCategory === c ? "cyan" : "outline"}>
                {CATEGORY_LABELS[c]}
              </Badge>
            </Link>
          ))}
        </nav>

        {articles.length === 0 ? (
          <EmptyState
            title={
              activeCategory
                ? `Brak poradników: ${CATEGORY_LABELS[activeCategory].toLowerCase()}`
                : "Jeszcze nic tu nie ma"
            }
            subtitle={
              activeCategory
                ? "Spróbuj innej kategorii albo zajrzyj później."
                : "Pierwsze poradniki pojawią się wkrótce."
            }
            action={
              activeCategory ? (
                <Button asChild variant="secondary">
                  <Link href="/poradnik">Zobacz wszystkie poradniki</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                href={`/poradnik/${a.slug}`}
                tag={CATEGORY_LABELS[a.category]}
                title={a.title}
                excerpt={a.excerpt}
                readingMinutes={a.reading_minutes}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
