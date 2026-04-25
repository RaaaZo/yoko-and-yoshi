import { PawPrint } from "@/components/brand/icons";

export function PawDivider() {
  return (
    <div className="my-8 flex items-center justify-center gap-3.5 text-[color:var(--color-border-default)]">
      <div className="border-border-soft flex-1 border-t border-dashed" />
      <PawPrint size={18} color="var(--color-border-default)" />
      <PawPrint size={22} color="var(--color-border-default)" />
      <PawPrint size={18} color="var(--color-border-default)" />
      <div className="border-border-soft flex-1 border-t border-dashed" />
    </div>
  );
}
