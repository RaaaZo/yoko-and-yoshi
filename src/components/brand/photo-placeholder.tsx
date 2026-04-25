import { cn } from "@/lib/utils";

/**
 * Placeholder rendered wherever a real photo will be supplied later.
 * Mirrors the design's `.yy-photo-placeholder` (dashed border + diagonal stripes).
 */
export function PhotoPlaceholder({
  aspectRatio = "1 / 1",
  className,
  label,
}: {
  aspectRatio?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("photo-placeholder", className)}
      style={{ aspectRatio }}
      data-photo-label={label}
    />
  );
}
