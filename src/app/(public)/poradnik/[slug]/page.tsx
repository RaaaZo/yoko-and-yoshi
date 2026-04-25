import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/brand/breadcrumbs";
import { PawDivider } from "@/components/brand/paw-divider";
import { Badge } from "@/components/ui/badge";
import { getArticleBySlug } from "@/lib/db/queries/content";
import type { Metadata } from "next";

export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, string> = {
  zywienie: "Żywienie",
  pielegnacja: "Pielęgnacja",
  zdrowie: "Zdrowie",
  rasy: "Rasy",
  akcesoria: "Akcesoria",
  inne: "Inne",
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Poradnik nieznaleziony" };
  return {
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt ?? undefined,
    openGraph: {
      type: "article",
      title: article.seo_title ?? article.title,
      description: article.seo_description ?? article.excerpt ?? "",
      publishedTime: article.published_at ?? undefined,
      images: article.og_image_url ? [article.og_image_url] : [],
    },
    alternates: { canonical: `/poradnik/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Start", href: "/" },
            { label: "Poradniki", href: "/poradnik" },
            { label: article.title },
          ]}
        />

        <div className="mt-6 mb-3">
          <Badge tone="cream">{CATEGORY_LABELS[article.category]}</Badge>
        </div>

        <h1 className="mb-4 text-[2.6rem] leading-tight">{article.title}</h1>

        {article.excerpt && (
          <p className="text-text-secondary mb-6 text-xl leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {article.reading_minutes && (
          <div className="text-text-muted mb-8 text-[0.85rem]">
            {article.reading_minutes} min czytania
          </div>
        )}

        <PawDivider />

        {article.content ? (
          <div className="prose-yy">
            {article.content.split(/\n\n+/).map((para, i) => {
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
          <p className="text-text-secondary">Pełna treść w przygotowaniu.</p>
        )}

        <ArticleJsonLd article={article} />
      </div>
    </article>
  );
}

function ArticleJsonLd({
  article,
}: {
  article: NonNullable<Awaited<ReturnType<typeof getArticleBySlug>>>;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.published_at ?? undefined,
    image: article.og_image_url ? [article.og_image_url] : undefined,
    author: { "@type": "Organization", name: "Yoko & Yoshi" },
    publisher: {
      "@type": "Organization",
      name: "Yoko & Yoshi",
      logo: {
        "@type": "ImageObject",
        url: "/brand/logo-primary.png",
      },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
