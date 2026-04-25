import { YokoFace, YoshiFace } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

export function BadgeRecommended({
  speaker = "yoko",
  className,
}: {
  speaker?: "yoko" | "yoshi";
  className?: string;
}) {
  const isYoko = speaker === "yoko";
  return (
    <div
      className={cn(
        "bg-bg-surface border-border-soft text-text-primary inline-flex items-center gap-1.5 rounded-full border-[1.5px] py-1 pr-3 pl-1 text-[0.72rem] font-semibold shadow-sm",
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
      Polecane przez {isYoko ? "Yoko" : "Yoshi"}
    </div>
  );
}
