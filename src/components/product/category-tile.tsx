import Link from "next/link";

import {
  SpeciesIcon,
  type SpeciesKind,
} from "@/components/brand/icons/species-icon";
import { cn } from "@/lib/utils";

export function CategoryTile({
  href,
  kind,
  label,
  count,
  className,
  color,
}: {
  href: string;
  kind: SpeciesKind;
  label: string;
  count?: number;
  className?: string;
  color?: string;
}) {
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
      <div className="mb-3 grid place-items-center">
        <SpeciesIcon kind={kind} size={56} />
      </div>
      <div className="font-display text-[1.15rem] font-semibold">{label}</div>
      {typeof count === "number" && (
        <div className="text-text-secondary mt-1 text-[0.8rem]">
          {count} produktów
        </div>
      )}
    </Link>
  );
}
