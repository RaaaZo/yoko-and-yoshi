import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/brand/breadcrumbs";
import { PawDivider } from "@/components/brand/paw-divider";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { Badge } from "@/components/ui/badge";
import { getBreedBySlug } from "@/lib/db/queries/content";
import type { Metadata } from "next";

export const revalidate = 3600;

type Params = Promise<{ breed: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { breed } = await params;
  const data = await getBreedBySlug(breed);
  if (!data) return { title: "Rasa nieznaleziona" };
  return {
    title: data.seo_title ?? data.name,
    description: data.seo_description ?? undefined,
    alternates: { canonical: `/poradnik/rasy/${data.slug}` },
  };
}

export default async function BreedPage({ params }: { params: Params }) {
  const { breed } = await params;
  const data = await getBreedBySlug(breed);
  if (!data) notFound();

  return (
    <article className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Start", href: "/" },
            { label: "Poradniki", href: "/poradnik" },
            { label: "Rasy", href: "/poradnik?cat=rasy" },
            { label: data.name },
          ]}
        />

        <div className="mt-6 mb-3">
          <Badge tone="primary">⭐ Hub rasowy</Badge>
        </div>

        <h1 className="mb-4 text-[3rem] leading-tight">{data.name}</h1>

        <div className="border-border-default mb-10 grid gap-8 rounded-xl border-2 border-dashed p-8 md:grid-cols-[1fr_1fr]">
          <PhotoPlaceholder aspectRatio="4 / 3" />
          {Object.keys(data.quick_facts).length > 0 && (
            <dl className="grid grid-cols-2 gap-4">
              {Object.entries(data.quick_facts).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-text-muted text-[0.78rem] tracking-wider uppercase">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="font-display text-text-primary mt-1 font-semibold">
                    {String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <PawDivider />

        {data.pillar_content ? (
          <div className="prose-yy">
            {data.pillar_content.split(/\n\n+/).map((para, i) => {
              const trimmed = para.trim();
              if (trimmed.startsWith("## ")) {
                return <h2 key={i}>{trimmed.slice(3)}</h2>;
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={i}>{trimmed.slice(4)}</h3>;
              }
              return <p key={i}>{trimmed}</p>;
            })}
          </div>
        ) : (
          <p className="text-text-secondary">Treść w przygotowaniu.</p>
        )}
      </div>
    </article>
  );
}
