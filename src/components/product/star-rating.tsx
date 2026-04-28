import { cn } from "@/lib/utils";

/**
 * 5-star rating display with half-step partial fill.
 *
 * Floors the rating to the nearest 0.5 (3.8 → 3.5, 4.7 → 4.5) so the
 * visual always shows clean halves instead of "almost-full" stars that
 * read as 4 when you mean 3.8.
 *
 * Implementation: two stacked layers of "★★★★★" — bottom one greyed
 * out, top one in the brand colour, clipped via overflow-hidden + a
 * percentage width. Stars are solid glyphs in the user's font, so the
 * coloured layer fully covers the grey beneath wherever it's painted.
 *
 * Font size and overall scale come from the parent via `className`.
 */
export function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const halfStep = Math.floor(rating * 2) / 2;
  const fillPercent = Math.max(0, Math.min(100, (halfStep / 5) * 100));

  return (
    <span
      className={cn(
        "relative inline-block leading-none whitespace-nowrap",
        className,
      )}
      role="img"
      aria-label={`${rating} z 5`}
    >
      <span aria-hidden className="text-[color:var(--color-border-soft)]">
        ★★★★★
      </span>
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 overflow-hidden text-[color:var(--color-secondary)]"
        style={{ width: `${fillPercent}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}
