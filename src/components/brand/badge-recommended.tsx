import { YokoFace, YoshiFace } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

/**
 * "Polecane przez Yoko/Yoshi" badge.
 *
 * On product cards in tight grids (e.g. 2-col mobile) the full text
 * version overflows the card. The CSS responsive variant collapses to
 * an icon-only badge below `sm` (640px) — text still announced via
 * aria-label for screen readers.
 */
export function BadgeRecommended({
  speaker = "yoko",
  className,
}: {
  speaker?: "yoko" | "yoshi";
  className?: string;
}) {
  const isYoko = speaker === "yoko";
  const label = `Polecane przez ${isYoko ? "Yoko" : "Yoshi"}`;
  return (
    <div
      aria-label={label}
      className={cn(
        "bg-bg-surface border-border-soft text-text-primary inline-flex items-center gap-1.5 rounded-full border-[1.5px] py-1 pl-1 text-[0.72rem] font-semibold shadow-sm",
        // Compact on phones (icon-only), full text from sm+.
        "pr-1 sm:pr-3",
        className,
      )}
    >
      <div
        className={cn(
          "grid size-6 place-items-center overflow-hidden rounded-full",
          isYoko
            ? "bg-[color:var(--color-secondary-soft)]"
            : "bg-[color:var(--color-bg-warm)]",
        )}
      >
        {isYoko ? <YokoFace size={24} /> : <YoshiFace size={24} />}
      </div>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
