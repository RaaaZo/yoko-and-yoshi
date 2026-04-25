import Link from "next/link";

import { cn } from "@/lib/utils";

const SOFT_COLOR_MAP: Record<string, string> = {
  "secondary-soft": "var(--color-secondary-soft)",
  "primary-soft": "var(--color-primary-soft)",
  "accent-cyan-soft": "var(--color-accent-cyan-soft)",
  "bg-warm": "var(--color-bg-warm)",
  "bg-elevated": "var(--color-bg-elevated)",
};

export function ItemTile({
  href,
  icon,
  label,
  count,
  softColorToken,
  className,
}: {
  href: string;
  icon: string;
  label: string;
  count?: number;
  softColorToken?: string | null;
  className?: string;
}) {
  const bg =
    SOFT_COLOR_MAP[softColorToken ?? "bg-warm"] ?? "var(--color-bg-warm)";

  return (
    <Link
      href={href}
      className={cn(
        "yy-tile-anim border-border-soft text-text-primary block rounded-lg border-2 border-dashed p-5 text-center no-underline",
        className,
      )}
      style={{ background: bg }}
    >
      <div className="yy-tile-icon mb-2 text-4xl leading-none" aria-hidden>
        {icon}
      </div>
      <div className="font-display text-[1rem] font-semibold">{label}</div>
      {typeof count === "number" && (
        <div className="text-text-secondary mt-0.5 text-[0.78rem]">
          {count} produktów
        </div>
      )}
    </Link>
  );
}
