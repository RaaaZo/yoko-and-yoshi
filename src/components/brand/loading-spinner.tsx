import { YokoFace } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

export function LoadingSpinner({
  size = 64,
  className,
  label = "Ładuję…",
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <div
        style={{
          width: size,
          height: size,
          animation: "var(--animate-yy-spin)",
        }}
      >
        <YokoFace size={size} />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
