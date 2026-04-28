import Link from "next/link";

import { Badge } from "@/components/ui/badge";

/**
 * Card for an article in lists (home "Najnowsze poradniki", /poradnik index).
 *
 * Layout: column flex with the footer (reading time + "Czytaj →") pushed to
 * the bottom via mt-auto so cards in the same row align even when titles
 * span different numbers of lines. The parent grid handles equal heights.
 */
export function ArticleCard({
  href,
  tag,
  title,
  excerpt,
  readingMinutes,
}: {
  href: string;
  tag: string;
  title: string;
  excerpt?: string | null;
  readingMinutes?: number | null;
}) {
  return (
    <Link
      href={href}
      className="bg-bg-surface border-border-soft text-text-primary flex h-full flex-col overflow-hidden rounded-lg border-[1.5px] no-underline transition hover:shadow-md"
    >
      <div
        className="relative aspect-[16/10]"
        style={{
          background:
            "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary-soft) 100%)",
        }}
      >
        <div className="absolute top-3.5 left-3.5">
          <Badge tone="cream">{tag}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2.5 text-[1.15rem] leading-snug">{title}</h3>
        {excerpt && (
          <p className="text-text-secondary mb-3 text-[0.92rem] leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="text-text-muted mt-auto flex justify-between text-[0.82rem]">
          <span>
            {readingMinutes
              ? `${readingMinutes} min czytania`
              : "Czytaj poradnik"}
          </span>
          <span className="text-accent-cyan font-semibold">Czytaj →</span>
        </div>
      </div>
    </Link>
  );
}
