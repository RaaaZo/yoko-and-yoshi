import Link from "next/link";

import { EmptyState } from "@/components/brand/empty-state";
import { Badge } from "@/components/ui/badge";
import { listArticles } from "@/lib/db/queries/content";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Poradniki",
  description:
    "Poradniki o psach, kotach i innych zwierzakach. Pielęgnacja, żywienie, zachowanie, akcesoria.",
};

const CATEGORY_LABELS: Record<string, string> = {
  zywienie: "Żywienie",
  pielegnacja: "Pielęgnacja",
  zdrowie: "Zdrowie",
  rasy: "Rasy",
  akcesoria: "Akcesoria",
  inne: "Inne",
};

export default async function GuidesIndexPage() {
  const articles = await listArticles({ limit: 50 });

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3">Poradniki</h1>
        <p className="text-text-secondary mb-8 max-w-2xl text-lg">
          Wszystko, co warto wiedzieć o psach, kotach i innych zwierzakach.
          Pielęgnacja, żywienie, zachowanie, polecane akcesoria.
        </p>

        {articles.length === 0 ? (
          <EmptyState
            title="Jeszcze nic tu nie ma"
            subtitle="Pierwsze poradniki pojawią się wkrótce."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/poradnik/${a.slug}`}
                className="bg-bg-surface border-border-soft text-text-primary block overflow-hidden rounded-lg border-[1.5px] no-underline transition hover:shadow-md"
              >
                <div
                  className="relative aspect-[16/10]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary-soft) 100%)",
                  }}
                >
                  <div className="absolute top-3.5 left-3.5">
                    <Badge tone="cream">{CATEGORY_LABELS[a.category]}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="mb-2.5 text-[1.15rem] leading-snug">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="text-text-secondary mb-3 text-[0.92rem] leading-relaxed">
                      {a.excerpt}
                    </p>
                  )}
                  <div className="text-text-muted flex justify-between text-[0.82rem]">
                    <span>
                      {a.reading_minutes
                        ? `${a.reading_minutes} min czytania`
                        : "Czytaj poradnik"}
                    </span>
                    <span className="text-accent-cyan font-semibold">
                      Czytaj →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
