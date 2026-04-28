import Link from "next/link";

import {
  CategoryIcon,
  type CategoryIconKind,
} from "@/components/brand/icons/category-icon";
import {
  SpeciesIcon,
  type SpeciesKind,
} from "@/components/brand/icons/species-icon";
import { cn } from "@/lib/utils";

const CATEGORY_KINDS: ReadonlySet<CategoryIconKind> = new Set([
  "zabawki",
  "pielegnacja",
  "maty-i-legowiska",
  "miski",
  "akcesoria",
  "drapaki",
]);

function isCategoryKind(slug: string): slug is CategoryIconKind {
  return (CATEGORY_KINDS as ReadonlySet<string>).has(slug);
}

/**
 * Tile used in two contexts:
 *  1. Species landing — pass `kind` as a SpeciesKind ("dog", "cat", ...).
 *  2. Category browsing — pass `categorySlug`; we render a CategoryIcon
 *     for the matching category, falling back to `fallbackKind` (the
 *     parent species) for slugs we don't have an icon for yet.
 */
export function CategoryTile({
  href,
  label,
  count,
  className,
  color,
  kind,
  categorySlug,
  fallbackKind,
}: {
  href: string;
  label: string;
  count?: number;
  className?: string;
  color?: string;
  /** Render a SpeciesIcon (used on /zwierzaki landing). */
  kind?: SpeciesKind;
  /** Render a CategoryIcon matching this slug. */
  categorySlug?: string;
  /** SpeciesIcon to fall back to when categorySlug has no matching icon. */
  fallbackKind?: SpeciesKind;
}) {
  const icon = (() => {
    if (categorySlug && isCategoryKind(categorySlug)) {
      return <CategoryIcon kind={categorySlug} size={56} />;
    }
    if (kind) return <SpeciesIcon kind={kind} size={56} />;
    if (fallbackKind) return <SpeciesIcon kind={fallbackKind} size={56} />;
    return null;
  })();

  return (
    <Link
      href={href}
      className={cn(
        "yy-tile-anim border-border-soft text-text-primary block rounded-lg border-2 border-dashed p-6 text-center no-underline",
        className,
      )}
      style={
        color ? { background: color } : { background: "var(--color-bg-warm)" }
      }
    >
      <div className="mb-3 grid place-items-center">{icon}</div>
      <div className="font-display text-[1.15rem] font-semibold">{label}</div>
      {typeof count === "number" && (
        <div className="text-text-secondary mt-1 text-[0.8rem]">
          {count} produktów
        </div>
      )}
    </Link>
  );
}
