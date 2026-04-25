import { YokoFace } from "@/components/brand/icons";

export function EmptyState({
  title = "Nic nie znaleźliśmy",
  subtitle = "Spróbuj innych filtrów lub zajrzyj do innej kategorii.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-bg-elevated border-border-soft rounded-lg border-2 border-dashed p-12 text-center">
      <div className="relative mb-4 inline-block">
        <YokoFace size={96} />
        {/* magnifying-glass overlay (Yoko z lupą) */}
        <div className="border-text-primary absolute -right-2.5 -bottom-1.5 size-9 rounded-full border-[3px]" />
        <div
          aria-hidden
          className="bg-text-primary absolute right-4 -bottom-5 h-3.5 w-1 rounded-sm"
          style={{ transform: "rotate(40deg)" }}
        />
      </div>
      <h3 className="mb-1.5">{title}</h3>
      <p className="text-text-secondary">{subtitle}</p>
    </div>
  );
}
